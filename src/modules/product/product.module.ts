import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { ProductController } from './product.controller';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [CategoryModule],
  exports: [ProductService],
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
})
export class ProductModule {}
