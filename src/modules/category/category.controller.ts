import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Category } from 'src/entities/category.entity';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { CategoryService } from './category.service';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Controller('/categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  async create(@Body() request: CreateCategoryDto): Promise<Category> {
    const category = await this.categoryService.create(request);
    return category;
  }

  @Get('/:id')
  async get(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    const category = await this.categoryService.get(id);
    return category;
  }

  @Get()
  async getAll(): Promise<Category[]> {
    const categories = await this.categoryService.getAll();
    return categories;
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateCategoryDto,
  ): Promise<Category> {
    // Object.keys(request); //jadi array
    if (Object.keys(request).length == 0) {
      //bisa juga response pesan tidak ada perubahan
      return await this.categoryService.get(id);
    }
    const category = await this.categoryService.update(id, request);
    return category;
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    const result = await this.categoryService.delete(id);
    return result;
  }
}
