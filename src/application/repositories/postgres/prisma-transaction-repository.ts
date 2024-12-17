import { Prisma } from '@prisma/client'
import { TransactionsRepository } from '../interfaces/transaction-repository'
import { prisma } from '../../../lib/prisma'

export class PrismaTransactionsRepository implements TransactionsRepository {
  async create(createTransactionParams: Prisma.TransactionsCreateInput) {
    const transaction = await prisma.transactions.create({
      data: createTransactionParams,
    })

    return transaction
  }
}
