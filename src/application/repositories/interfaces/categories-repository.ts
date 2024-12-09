import { Category } from '@prisma/client'

export interface CategoriesRepository {
  findyAllByUserId(userId: string): Promise<Category[]>
  findFirst(categoryId: string, userId: string): Promise<Category | null>
}
