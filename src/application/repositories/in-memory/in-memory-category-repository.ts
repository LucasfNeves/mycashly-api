import { Category } from '@prisma/client'
import { CategoriesRepository } from '../interfaces/categories-repository'

export class inMemoryCategoriesRepository implements CategoriesRepository {
  categories: Category[] = [
    // Income
    { name: 'Salário', type: 'INCOME', id: '1', userId: '1' },
    { name: 'Investimento', type: 'INVESTMENT', id: '2', userId: '1' },
    { name: 'Outro', type: 'INCOME', id: '3', userId: '1' },
    // Expense
    { name: 'Casa', type: 'EXPENSE', id: '4', userId: '1' },
    { name: 'Alimentação', type: 'EXPENSE', id: '5', userId: '1' },
    { name: 'Educação', type: 'EXPENSE', id: '6', userId: '1' },
    { name: 'Lazer', type: 'EXPENSE', id: '7', userId: '1' },
    { name: 'Mercado', type: 'EXPENSE', id: '8', userId: '1' },
    { name: 'Roupas', type: 'EXPENSE', id: '9', userId: '1' },
    { name: 'Transporte', type: 'EXPENSE', id: '10', userId: '1' },
    { name: 'Viagem', type: 'EXPENSE', id: '11', userId: '1' },
    { name: 'Outro', type: 'EXPENSE', id: '12', userId: '1' },
  ]

  async findyAllByUserId(userId: string): Promise<Category[]> {
    const categories = this.categories.filter(
      (category) => category.userId === userId,
    )

    if (categories.length === 0) {
      return []
    }

    return categories
  }
  async findFirst(categoryId: string, userId: string) {
    const category = this.categories.find(
      (category) => category.id === categoryId && category.userId === userId,
    )

    if (!category) {
      return null
    }

    return category
  }
}
