import { Prisma, Transactions } from '@prisma/client'
import { TransactionsFilters } from '../../use-cases/transactions'

export interface TransactionsRepository {
  create(
    createTransactionParams: Prisma.TransactionsCreateInput,
  ): Promise<Transactions>

  update(
    transactionId: string,
    updateTransactionParams: Prisma.TransactionsUpdateInput,
  ): Promise<Transactions | null>

  delete(transactionId: string): Promise<Transactions | null>

  findByUserId(
    userId: string,
    filters: TransactionsFilters,
  ): Promise<Transactions[] | null>

  findTopFiveExpenses(
    userId: string,
    filters: TransactionsFilters,
  ): Promise<Transactions[] | null>
}
