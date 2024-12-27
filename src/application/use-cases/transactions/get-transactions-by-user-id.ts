import { Transactions } from '@prisma/client'
import { TransactionsRepository } from '../../repositories/interfaces/transaction-repository'
import { UserNotFoundError } from '../../../errors'

export class GetTransactionsByUserIdUseCase {
  constructor(private transactionRepository: TransactionsRepository) {}

  async execute(userId: string): Promise<Transactions[]> {
    const transactions = await this.transactionRepository.findByUserId(userId)

    if (!transactions) {
      throw new UserNotFoundError()
    }

    return { ...transactions }
  }
}
