import { Prisma, Transactions } from '@prisma/client'
import { TransactionsRepository } from '../interfaces/transaction-repository'
import { prisma } from '../../../lib/prisma'

export class PrismaTransactionsRepository implements TransactionsRepository {
  async create(createTransactionParams: Prisma.TransactionsCreateInput) {
    const transaction = await prisma.transactions.create({
      data: createTransactionParams,
    })

    return transaction
  }

  async update(
    transactionId: string,
    updateTransactionParams: Prisma.TransactionsUpdateInput,
  ): Promise<Transactions | null> {
    const transaction = await prisma.transactions.update({
      where: {
        id: transactionId,
      },
      data: updateTransactionParams,
    })

    return transaction
  }

  async delete(transactionId: string) {
    const transaction = await prisma.transactions.delete({
      where: {
        id: transactionId,
      },
    })

    return transaction
  }
}
