import { TransactionType } from '@prisma/client'
import { IdGeneratorAdapter } from '../../../adapters/id-generator'
import { UserNotFoundError } from '../../../errors/user-not-found-error'
import { TransactionsRepository } from '../../repositories/interfaces/transaction-repository'
import { UsersRepository } from '../../repositories/interfaces/users-repository'
import { CategoriesRepository } from '../../repositories/interfaces/categories-repository'
import { NotFoundException } from '../../../errors/not-found-exception'

interface CreateTransactionUseCaseParams {
  categoryId: string
  name: string
  value: number
  date: Date | string
  type: TransactionType
  userId: string
}

export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly idGeneratorAdapter: IdGeneratorAdapter,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}
  async execute(createTransactionParams: CreateTransactionUseCaseParams) {
    const { categoryId, date, name, type, value, userId } =
      createTransactionParams

    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const transactionId = await this.idGeneratorAdapter.execute()

    const category = await this.categoriesRepository.findFirst(
      categoryId,
      userId,
    )

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    const transaction = await this.transactionRepository.create({
      id: transactionId,
      category: { connect: { id: categoryId } },
      User: { connect: { id: userId } },
      date,
      name,
      type,
      value,
    })

    return { transaction }
  }
}
