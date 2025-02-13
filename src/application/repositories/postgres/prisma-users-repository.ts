import { prisma } from '../../../lib/prisma'
import { Prisma } from '@prisma/client'
import { UsersRepository } from '../interfaces/users-repository'
import { UserNotFoundError } from '../../../errors/user-not-found-error'

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const { email, name, password } = data

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password,
        categories: {
          createMany: {
            data: [
              // Income
              { name: 'Salário', type: 'INCOME' },
              { name: 'Investimento', type: 'INVESTMENT' },
              { name: 'Outro', type: 'INCOME' },
              // Expense
              { name: 'Casa', type: 'EXPENSE' },
              { name: 'Alimentação', type: 'EXPENSE' },
              { name: 'Educação', type: 'EXPENSE' },
              { name: 'Lazer', type: 'EXPENSE' },
              { name: 'Mercado', type: 'EXPENSE' },
              { name: 'Roupas', type: 'EXPENSE' },
              { name: 'Transporte', type: 'EXPENSE' },
              { name: 'Viagem', type: 'EXPENSE' },
              { name: 'Outro', type: 'EXPENSE' },
            ],
          },
        },
      },
    })

    return user
  }

  async updateUser(userId: string, data: Prisma.UserUpdateInput) {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data,
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return user
  }

  async updatePassword(userId: string, password: string) {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return user
  }

  async findById(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    if (!user) {
      throw new UserNotFoundError()
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  }

  async deleteUser(userId: string) {
    const user = await prisma.user.delete({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new UserNotFoundError()
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  }

  async getUserBalance(userId: string): Promise<{
    expenses: number | Prisma.Decimal
    incomes: number | Prisma.Decimal
    investments: number | Prisma.Decimal
    balance: number | Prisma.Decimal
  }> {
    const {
      _sum: { value: totalExpenses },
    } = await prisma.transactions.aggregate({
      where: {
        userId,
        type: 'EXPENSE',
      },
      _sum: {
        value: true,
      },
    })

    const {
      _sum: { value: totalIncomes },
    } = await prisma.transactions.aggregate({
      where: {
        userId,
        type: 'INCOME',
      },
      _sum: {
        value: true,
      },
    })

    const {
      _sum: { value: totalInvestments },
    } = await prisma.transactions.aggregate({
      where: {
        userId,
        type: 'INVESTMENT',
      },
      _sum: {
        value: true,
      },
    })

    const _totalExpenses = totalExpenses || new Prisma.Decimal(0)
    const _totalIncomes = totalIncomes || new Prisma.Decimal(0)
    const _totalInvestments = totalInvestments || new Prisma.Decimal(0)

    const balance = new Prisma.Decimal(_totalIncomes)
      .minus(new Prisma.Decimal(_totalExpenses))
      .minus(new Prisma.Decimal(_totalInvestments))

    return {
      expenses: _totalExpenses,
      incomes: _totalIncomes,
      investments: _totalInvestments,
      balance: balance,
    }
  }
}
