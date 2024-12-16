import { Transactions } from '@prisma/client'
import { IdGeneratorAdapter } from '../../../adapters/id-generator'
import { NotFoundException } from '../../../errors/not-found-exception'
import { UserNotFoundError } from '../../../errors/user-not-found-error'
import { CategoriesRepository } from '../../repositories/interfaces/categories-repository'
import { TransactionsRepository } from '../../repositories/interfaces/transaction-repository'
import { UsersRepository } from '../../repositories/interfaces/users-repository'

export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly idGeneratorAdapter: IdGeneratorAdapter,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}
  async execute(createTransactionParams: Transactions) {
    const userId = createTransactionParams.userId
    const categoryId = createTransactionParams.categoryId

    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const category = await this.categoriesRepository.findFirst(
      userId,
      categoryId!,
    )

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    const transactionId = this.idGeneratorAdapter.execute()

    const transaction = await this.transactionRepository.create({
      ...createTransactionParams,
      id: transactionId,
      User: { connect: { id: userId } },
    })

    return { transaction }
  }
}
