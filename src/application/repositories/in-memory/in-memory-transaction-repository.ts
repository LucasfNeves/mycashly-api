import { Prisma, Transactions, TransactionType } from '@prisma/client'
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

  async update(
    transactionId: string,
    updateTransactionParams: Prisma.TransactionsUpdateInput,
  ): Promise<Transactions | null> {
    const transaction = this.transactions.find(
      (transaction) => transaction.id === transactionId,
    )

    if (!transaction) {
      return null
    }

    // Helper para pegar o valor ou manter o original
    const getValue = <T>(newValue: T | undefined, originalValue: T) =>
      newValue !== undefined ? newValue : originalValue

    const updatedTransaction = {
      ...transaction,
      name: getValue(updateTransactionParams.name as string, transaction.name),
      value: getValue(
        updateTransactionParams.value as number,
        transaction.value,
      ),
      type: getValue(
        updateTransactionParams.type as TransactionType,
        transaction.type,
      ),
      date: getValue(updateTransactionParams.date as Date, transaction.date),
      categoryId: getValue(
        updateTransactionParams.category?.connect?.id,
        transaction.categoryId,
      ),
    }

    this.transactions = this.transactions.map((transaction) =>
      transaction.id === transactionId ? updatedTransaction : transaction,
    )

    return updatedTransaction
  }

  async delete(transactionId: string): Promise<Transactions | null> {
    const transaction = this.transactions.find(
      (transaction) => transaction.id === transactionId,
    )

    if (!transaction) {
      return null
    }

    this.transactions = this.transactions.filter(
      (transaction) => transaction.id !== transactionId,
    )

    return transaction
  }

  async findByUserId(userId: string): Promise<Transactions[] | null> {
    const transactions = this.transactions.filter(
      (transaction) => transaction.userId === userId,
    )

    return transactions
  }

  async findTopFiveExpenses(userId: string): Promise<Transactions[] | null> {
    const transactions = this.transactions
      .filter(
        (transaction) =>
          transaction.userId === userId && transaction.type === 'EXPENSE',
      )
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

    return transactions
  }
}
