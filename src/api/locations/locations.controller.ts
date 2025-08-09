import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateOpeningHoursDto } from './dto/create-opening-hours.dto';
import { UpsertOpeningHoursDto } from './dto/upsert-opening-hours.dto';
import { CreateClosingRulesDto } from './dto/create-closing-rules.dto';
import { UpsertClosingRulesDto } from './dto/upsert-closing-rules.dto';
import { CreateLocationDto } from './dto/create-location.dto';
import { AuthUser, Protected } from '../auth/auth.decorators';
import { UserRole } from 'generated/prisma/wasm';
import { CreateProductAvailabilityDto } from './dto/create-product-availability.dto';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { AuthUserType } from 'src/types/auth.types';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  async getLocations() {
    return this.locationsService.getLocations();
  }

  @Get(':locationId/products')
  async getLocationProducts(
    @Param('locationId', ParseIntPipe) locationId: number,
  ) {
    return this.locationsService.getLocationProducts(locationId);
  }

  @Get(':locationId/order-availability')
  async checkIfLocationIsAvailableForOrdering(
    @Param('locationId', ParseIntPipe) locationId: number,
    @Query('time') time: string,
  ) {
    return this.locationsService.checkIfLocationIsAvailableForOrdering(
      locationId,
      time,
    );
  }

  @Protected(UserRole.Admin)
  @Post()
  async createLocation(@Body() dto: CreateLocationDto) {
    return this.locationsService.createLocation(dto);
  }

  @Protected(UserRole.Admin)
  @Post(':locationId/product-availability')
  async createProductAvailability(
    @Param('locationId', ParseIntPipe) locationId: number,
    @Body() dto: CreateProductAvailabilityDto,
  ) {
    return this.locationsService.createProductAvailability(locationId, dto);
  }

  @Protected(UserRole.Admin)
  @Post(':locationId/product-availability/:id')
  async updateProductAvailability(
    @Param('locationId', ParseIntPipe) locationId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateProductAvailabilityDto,
  ) {
    return this.locationsService.updateProductAvailability(id, locationId, dto);
  }

  @Protected(UserRole.Admin)
  @Post(':locationId/opening-hours')
  async insertOpeningHours(
    @Param('locationId', ParseIntPipe) locationId: number,
    @Body() dto: CreateOpeningHoursDto,
  ) {
    return this.locationsService.insertOpeningHours(locationId, dto);
  }

  @Protected(UserRole.Admin)
  @Post(':locationId/opening-hours/upsert')
  async upsertOpeningHours(
    @Param('locationId', ParseIntPipe) locationId: number,
    @Body() dto: UpsertOpeningHoursDto,
  ) {
    return this.locationsService.upsertOpeningHours(locationId, dto);
  }

  @Protected(UserRole.Admin)
  @Post(':locationId/closing-rules')
  async insertClosingRules(
    @Param('locationId', ParseIntPipe) locationId: number,
    @Body() dto: CreateClosingRulesDto,
  ) {
    return this.locationsService.insertClosingRules(locationId, dto);
  }

  @Protected(UserRole.Admin)
  @Post(':locationId/closing-rules/upsert')
  async upsertClosingRules(
    @Param('locationId', ParseIntPipe) locationId: number,
    @Body() dto: UpsertClosingRulesDto,
  ) {
    return this.locationsService.upsertClosingRules(locationId, dto);
  }

  @Protected()
  @Post(':locationId/create-order')
  async createOrder(
    @Param('locationId', ParseIntPipe) locationId: number,
    @Body() dto: CreateOrderDto,
    @AuthUser() user: AuthUserType,
  ) {
    return this.locationsService.createOrder(locationId, dto, user.id);
  }
}
