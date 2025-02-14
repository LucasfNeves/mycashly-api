import { Transactions } from '@prisma/client'
import { TransactionsRepository } from '../../repositories/interfaces/transaction-repository'
import { TransactionsFilters } from './get-transactions-by-user-id'
import { UserNotFoundError } from '../../../errors'
import { UsersRepository } from '../../repositories/interfaces/users-repository'

export class GetTopFiveExpenses {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly usersRepository: UsersRepository,
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
      (await this.transactionsRepository.findTopFiveExpenses(userId, {
        month,
        year,
        type,
      })) || []

    return transactions
  }
}
