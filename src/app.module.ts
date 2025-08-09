import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { DatabaseModule } from './integrations/database/database.module';
import { LocationsModule } from './api/locations/locations.module';
import { OrdersModule } from './api/orders/orders.module';
import { ProductsModule } from './api/products/products.module';
import { AuthGuard } from './api/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    LocationsModule,
    OrdersModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
