import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from 'generated/prisma';
import { DatabaseService } from 'src/integrations/database/database.service';
import { OrderFiltersDto } from './dto/order-filters.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly database: DatabaseService) {}

  async getUserOrders(userId: number, filters: OrderFiltersDto) {
    return this.database.order.findMany({
      where: {
        userId: userId,
        ...(filters.status && { status: filters.status }),
        ...(filters.locations && { locationId: { in: filters.locations } }),
        ...(filters.products && { productId: { in: filters.products } }),
      },
    });
  }

  async getUserOrderById(userId: number, orderId: number) {
    return this.database.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      },
    });
  }

  private async _checkIfOrderIsEligableToBeCancelledOrThrowIfNotFound(
    orderId: number,
    userId: number,
  ) {
    const order = await this.database.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    const FIFTEEN_MINS_AGO = new Date(Date.now() - 1000 * 60 * 15);

    return (
      order.status !== OrderStatus.ISSUED || order.createdAt < FIFTEEN_MINS_AGO
    );
  }

  async cancelOrder(userId: number, orderId: number) {
    if (
      !(await this._checkIfOrderIsEligableToBeCancelledOrThrowIfNotFound(
        orderId,
        userId,
      ))
    ) {
      throw new BadRequestException('Order is not eligible for cancellation');
    }

    return this.database.order.update({
      where: {
        id: orderId,
        userId: userId,
      },
      data: {
        status: OrderStatus.CANCELLED,
      },
    });
  }
}
