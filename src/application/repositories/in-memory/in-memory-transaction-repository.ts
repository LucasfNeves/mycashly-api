import { Prisma, Transactions } from '@prisma/client'
import { TransactionsRepository } from '../interfaces/transaction-repository'
import { randomUUID } from 'crypto'

export class inMemoryTransactionsRepository implements TransactionsRepository {
  transactions: Transactions[] = []

  async create(
    createTransactionParams: Prisma.TransactionsCreateInput,
  ): Promise<Transactions> {
    const transaction = {
      id: randomUUID(),
      name: createTransactionParams.name,
      value: createTransactionParams.value,
      type: createTransactionParams.type,
      date: new Date(createTransactionParams.date || Date.now()),
      userId: (createTransactionParams.User as { connect: { id: string } })
        .connect.id,
      categoryId: (
        createTransactionParams.category as { connect: { id: string } }
      ).connect.id,
    }

    this.transactions.push(transaction)

    return transaction
  }
}
