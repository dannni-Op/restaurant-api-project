import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Injectable()
export class CategoryRepository {
  private repository: Repository<Category>;
  constructor(private readonly dataSource: DataSource) {
    this.repository = dataSource.getRepository(Category);
  }

  async createCategory(request: CreateCategoryDto): Promise<Category> {
    const category = this.repository.create(request);
    const result = await this.repository.save(category);
    return result;
  }

  async findByName(name: string): Promise<Category | null> {
    const result = await this.repository.findOneBy({ name });
    return result;
  }

  async findById(id: number): Promise<Category | null> {
    const result = await this.repository.findOneBy({ id });
    return result;
  }

  async findByIdWithRelations(id: number): Promise<Category | null> {
    const result = await this.repository.findOne({
      where: {
        id,
      },
      relations: ['products'],
    });
    return result;
  }

  async getCategories(): Promise<Category[]> {
    const result = await this.repository.find();
    return result;
  }

  async updateCategory(
    id: number,
    request: UpdateCategoryDto,
  ): Promise<Category> {
    await this.repository.update({ id }, request);
    const result = await this.findById(id);
    return result;
  }

  async deleteCategory(id: number): Promise<boolean> {
    await this.repository.delete({ id });
    return true;
  }
}
