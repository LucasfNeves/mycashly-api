import { Transactions, TransactionType } from '@prisma/client'
import { TransactionsRepository } from '../../repositories/interfaces/transaction-repository'
import { UserNotFoundError } from '../../../errors'

export interface TransactionsFilters {
  month: number
  year: number
  type?: TransactionType
}

export class GetTransactionsByUserIdUseCase {
  constructor(private transactionRepository: TransactionsRepository) {}

  async execute(
    userId: string,
    filters: TransactionsFilters,
  ): Promise<Transactions[]> {
    const transactions = await this.transactionRepository.findByUserId(
      userId,
      filters,
    )

    if (!transactions) {
      throw new UserNotFoundError()
    }

    return transactions
  }
}
