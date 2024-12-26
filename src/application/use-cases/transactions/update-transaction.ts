import { Prisma, TransactionType } from '@prisma/client'
import { CategoriesRepository } from '../../repositories/interfaces/categories-repository'
import { TransactionsRepository } from '../../repositories/interfaces/transaction-repository'
import { NotFoundException } from '../../../errors'

export interface UpdateTransactionUseCaseParams {
  categoryId?: string
  name: string
  value: number
  date: Date | string
  type: TransactionType
}

export class UpdateTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionsRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async execute(
    transactionId: string,
    userId: string,
    updateTransactionParams: UpdateTransactionUseCaseParams,
  ) {
    const { categoryId, date, name, type, value } = updateTransactionParams

    // Constroi o objeto de dados para a atualização
    const transactionData: Prisma.TransactionsUpdateInput = {
      name,
      value,
      date,
      type,
    }

    // Condiciona a atualização da categoria caso exista
    if (categoryId) {
      const categoryExists = await this.categoriesRepository.findFirst(
        categoryId,
        userId,
      )

      if (!categoryExists) {
        throw new NotFoundException('Category not found')
      }

      transactionData.category = { connect: { id: categoryId } }
    }

    // Realiza a atualização da transação
    const updatedTransaction = await this.transactionRepository.update(
      transactionId,
      transactionData,
    )

    return { ...updatedTransaction }
  }
}
