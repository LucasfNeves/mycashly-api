import { prisma } from '../../../lib/prisma'
import { Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'

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
}
