import { Body, Controller } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Protected } from '../auth/auth.decorators';
import { UserRole } from 'generated/prisma';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Protected(UserRole.Admin)
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Protected()
  async updateProduct(@Body() updateProductDto: UpdateProductDto) {
    return this.productsService.updateProduct(updateProductDto);
  }
}
