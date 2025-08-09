import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { DatabaseService } from 'src/integrations/database/database.service';
import { CreateOpeningHoursDto } from './dto/create-opening-hours.dto';
import { UpsertOpeningHoursDto } from './dto/upsert-opening-hours.dto';
import { CreateClosingRulesDto } from './dto/create-closing-rules.dto';
import { UpsertClosingRulesDto } from './dto/upsert-closing-rules.dto';
import { CreateProductAvailabilityDto } from './dto/create-product-availability.dto';
import { UpdateProductAvailabilityDto } from './dto/update-product-availability.dto';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { Prisma } from 'generated/prisma';

@Injectable()
export class LocationsService {
  constructor(private readonly database: DatabaseService) {}

  async getLocations() {
    return this.database.location.findMany({});
  }

  async checkIfLocationIsAvailableForOrdering(
    locationId: number,
    time: string,
  ) {
    const date = new Date(time);
    return !!(await this.database.location.findFirst({
      where: {
        id: locationId,
        active: true,
        openingHours: {
          some: {
            days: { has: String(date.getDay()) },
            openTime: { lte: date },
            closeTime: { gte: date },
          },
        },
        closingRules: {
          some: {
            from: { lte: date },
            to: { gte: date },
          },
        },
      },
    }));
  }

  async getLocationProducts(locationId: number) {
    return this.database.product.findMany({
      where: {
        locationAvailability: {
          some: { locationId },
        },
      },
    });
  }

  async createLocation(createLocationDto: CreateLocationDto) {
    return this.database.location.create({
      data: createLocationDto,
    });
  }

  async createProductAvailability(
    locationId: number,
    createLocationDto: CreateProductAvailabilityDto,
  ) {
    return this.database.productLocationAvailability.create({
      data: {
        ...createLocationDto,
        locationId,
      },
    });
  }

  async updateProductAvailability(
    id: number,
    locationId: number,
    updateProductAvailabilityDto: UpdateProductAvailabilityDto,
  ) {
    return this.database.productLocationAvailability.update({
      where: { id, locationId },
      data: updateProductAvailabilityDto,
    });
  }

  async insertOpeningHours(locationId: number, dto: CreateOpeningHoursDto) {
    const { days, openTime, closeTime } = dto;
    return this.database.openingHours.create({
      data: {
        locationId,
        days,
        openTime: new Date(openTime),
        closeTime: new Date(closeTime),
      },
    });
  }

  async upsertOpeningHours(locationId: number, dto: UpsertOpeningHoursDto) {
    const { id, days, openTime, closeTime } = dto;
    return this.database.openingHours.upsert({
      where: { id, locationId },
      update: {
        locationId,
        days,
        openTime: new Date(openTime),
        closeTime: new Date(closeTime),
      },
      create: {
        locationId,
        days,
        openTime: new Date(openTime),
        closeTime: new Date(closeTime),
      },
    });
  }

  async insertClosingRules(locationId: number, dto: CreateClosingRulesDto) {
    const { from, to } = dto;
    return this.database.closingRules.create({
      data: {
        locationId,
        from: new Date(from),
        to: new Date(to),
      },
    });
  }

  async upsertClosingRules(locationId: number, dto: UpsertClosingRulesDto) {
    const { id, from, to } = dto;
    return this.database.closingRules.upsert({
      where: { id, locationId },
      update: {
        locationId,
        from: new Date(from),
        to: new Date(to),
      },
      create: {
        locationId,
        from: new Date(from),
        to: new Date(to),
      },
    });
  }

  async createOrder(locationId: number, dto: CreateOrderDto, userId: number) {
    if (
      !(await this.checkIfLocationIsAvailableForOrdering(
        locationId,
        new Date().toISOString(),
      ))
    )
      throw new BadRequestException('Location is not available for ordering');

    const locationAvailability =
      await this.database.productLocationAvailability.findMany({
        where: {
          locationId,
        },
        select: {
          product: true,
          active: true,
          quantity: true,
        },
      });

    if (
      dto.items.some(
        (item) =>
          !locationAvailability.some(
            (availability) =>
              availability.product.id === item.productId &&
              availability.active &&
              availability.quantity >= item.quantity,
          ),
      )
    ) {
      throw new BadRequestException(
        'Product cannot be processed for ordering in this location',
      );
    }

    const productIdToQuantityMapping: Record<number, number> = dto.items.reduce(
      (acc, item) => {
        acc[item.productId] = item.quantity;
        return acc;
      },
      {},
    );

    await this.database.$transaction(
      async (tx) => {
        const totalPrice = locationAvailability.reduce((acc, availability) => {
          const quantity =
            productIdToQuantityMapping[availability.product.id] || 0;
          return acc + availability.product.price * quantity;
        }, 0);

        const order = await tx.order.create({
          data: {
            discountCodeId: dto.discountCodeId,

            locationId,
            userId,
            totalPrice,
          },
        });

        await tx.orderProducts.createMany({
          data: locationAvailability.map((availability) => {
            const quantity =
              productIdToQuantityMapping[availability.product.id];
            return {
              orderId: order.id,
              productId: availability.product.id,
              quantity,
            };
          }),
        });

        const valueRows = Object.entries(productIdToQuantityMapping).map(
          ([productId, qty]) => Prisma.sql`(${Number(productId)}, ${qty})`,
        );

        if (valueRows.length > 0) {
          await tx.$executeRaw`
            UPDATE "ProductLocationAvailability" AS pla
            SET "quantity" = pla."quantity" - q.qty
            FROM (VALUES ${Prisma.join(valueRows)}) AS q("productId", "qty")
            WHERE pla."locationId" = ${locationId}
              AND pla."productId" = q."productId"
          `;
        }
      },
      { timeout: 10000 },
    );
  }
}
