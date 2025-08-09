import { Controller, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthUser, Protected } from '../auth/auth.decorators';
import { AuthUserType } from 'src/types/auth.types';
import { OrderFiltersDto } from './dto/order-filters.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Protected()
  async getUserOrders(
    @AuthUser() user: AuthUserType,
    @Query() filters: OrderFiltersDto,
  ) {
    return this.ordersService.getUserOrders(user.id, filters);
  }

  @Protected()
  async getUserOrderById(@AuthUser() user: AuthUserType, orderId: number) {
    return this.ordersService.getUserOrderById(user.id, orderId);
  }

  @Protected()
  async cancelOrder(@AuthUser() user: AuthUserType, orderId: number) {
    return this.ordersService.cancelOrder(user.id, orderId);
  }

  // Todo: Add admin POV controllers if there is time left
}
