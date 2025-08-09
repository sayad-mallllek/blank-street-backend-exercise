import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/integrations/database/database.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly database: DatabaseService) {}

  async createProduct(createProductDto: CreateProductDto) {
    return this.database.product.create({
      data: createProductDto,
    });
  }

  async updateProduct(updateProductDto: UpdateProductDto) {
    return this.database.product.update({
      where: { id: updateProductDto.id },
      data: updateProductDto,
    });
  }
}
