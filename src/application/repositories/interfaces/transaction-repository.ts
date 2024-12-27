import { Prisma, Transactions } from '@prisma/client'

export interface TransactionsRepository {
  create(
    createTransactionParams: Prisma.TransactionsCreateInput,
  ): Promise<Transactions>

  update(
    transactionId: string,
    updateTransactionParams: Prisma.TransactionsUpdateInput,
  ): Promise<Transactions | null>

  delete(transactionId: string): Promise<Transactions | null>

  findByUserId(userId: string): Promise<Transactions[] | null>
}
