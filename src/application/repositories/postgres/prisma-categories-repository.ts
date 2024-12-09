import { Category } from '@prisma/client'
import { CategoriesRepository } from '../interfaces/categories-repository'
import { prisma } from '../../../lib/prisma'

export class PrismaCategoriesRepository implements CategoriesRepository {
  async findyAllByUserId(userId: string): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      where: {
        userId,
      },
    })

    return categories
  }

  async findFirst(
    categoryId: string,
    userId: string,
  ): Promise<Category | null> {
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: userId,
      },
    })

    return category
  }
}
