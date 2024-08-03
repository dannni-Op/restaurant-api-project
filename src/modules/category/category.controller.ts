import { Body, Controller, Get, Post } from '@nestjs/common';
import { Category } from 'src/entities/category.entity';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { CategoryService } from './category.service';

@Controller('/categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  async create(@Body() request: CreateCategoryDto): Promise<Category> {
    const category = await this.categoryService.create(request);
    return category;
  }
}
