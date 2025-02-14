import { Prisma, Transactions } from '@prisma/client'
import { TransactionsRepository } from '../interfaces/transaction-repository'
import { prisma } from '../../../lib/prisma'
import { TransactionsFilters } from '../../use-cases/transactions'

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

  async findByUserId(userId: string, filters: TransactionsFilters) {
    const transaction = await prisma.transactions.findMany({
      where: {
        userId: userId,
        type: filters.type,
        date: {
          gte: new Date(Date.UTC(filters.year, filters.month)),
          lt: new Date(Date.UTC(filters.year, filters.month + 1)),
        },
      },
    })

    return transaction
  }

  async findTopFiveExpenses(userId: string, filters: TransactionsFilters) {
    const transactions = await prisma.transactions.findMany({
      where: {
        userId: userId,
        type: 'EXPENSE',
        date: {
          gte: new Date(Date.UTC(filters.year, filters.month)),
          lt: new Date(Date.UTC(filters.year, filters.month + 1)),
        },
      },
      take: 5,
      orderBy: {
        value: 'desc',
      },
    })

    return transactions
  }
}
