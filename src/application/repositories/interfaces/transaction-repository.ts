import { Prisma, Transactions } from '@prisma/client'

export interface TransactionsRepository {
  create(
    createTransactionParams: Prisma.TransactionsCreateInput,
  ): Promise<Transactions>
}
