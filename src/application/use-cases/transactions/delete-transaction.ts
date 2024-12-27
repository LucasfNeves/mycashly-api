import { Transactions } from '@prisma/client'
import { TransactionsRepository } from '../../repositories/interfaces/transaction-repository'
import { NotFoundException } from '../../../errors'

export class DeleteTransactionUseCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async execute(transactionId: string): Promise<Transactions | null> {
    const deletedTransaction =
      await this.transactionsRepository.delete(transactionId)

    if (!deletedTransaction) {
      throw new NotFoundException('Transaction not found')
    }

    return { ...deletedTransaction }
  }
}
