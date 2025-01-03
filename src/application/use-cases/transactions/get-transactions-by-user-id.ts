import { Transactions, TransactionType } from '@prisma/client'
import { TransactionsRepository } from '../../repositories/interfaces/transaction-repository'
import { UserNotFoundError } from '../../../errors'
import { UsersRepository } from '../../repositories/interfaces/users-repository'

export interface TransactionsFilters {
  month: number
  year: number
  type?: TransactionType
}

export class GetTransactionsByUserIdUseCase {
  constructor(
    private transactionRepository: TransactionsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(
    userId: string,
    filters: TransactionsFilters,
  ): Promise<Transactions[]> {
    const userExists = await this.usersRepository.findById(userId)

    if (!userExists) {
      throw new UserNotFoundError('User not found')
    }

    const { month, year, type } = filters

    const transactions =
      (await this.transactionRepository.findByUserId(userId, {
        month,
        year,
        type,
      })) || []

    return transactions
  }
}
