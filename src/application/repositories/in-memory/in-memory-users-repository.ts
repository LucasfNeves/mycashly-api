import { User, Prisma } from '@prisma/client'
import { UsersRepository } from '../interfaces/users-repository'

export class inMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string) {
    const user = this.items.find((user) => user.email === email)

    if (!user) {
      return null
    }

    return user
  }
  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: '1',
      name: data.name,
      email: data.email,
      password: data.password,
    }

    this.items.push(user)

    return user
  }

  async updateUser(userId: string, data: Prisma.UserUpdateInput) {
    const user = this.items.find((user) => user.id === userId)

    if (!user) {
      return null
    }

    const updatedUser = {
      ...user,
      ...data,
    } as User

    this.items = this.items.map((user) =>
      user.id === userId ? updatedUser : user,
    )

    return updatedUser
  }

  async findById(userId: string) {
    const user = this.items.find((user) => user.id === userId)

    if (!user) {
      return null
    }

    return user
  }

  async deleteUser(userId: string) {
    const user = this.items.find((user) => user.id === userId)

    if (!user) {
      return null
    }

    this.items = this.items.filter((user) => user.id !== userId)

    return user
  }

  async getUserBalance(userId: string): Promise<{
    expenses: number | Prisma.Decimal
    incomes: number | Prisma.Decimal
    investments: number | Prisma.Decimal
    balance: number | Prisma.Decimal
  }> {
    const uu = userId

    if (uu) {
      return {
        expenses: 0,
        incomes: 0,
        investments: 0,
        balance: 0,
      }
    }

    return {
      expenses: 0,
      incomes: 0,
      investments: 0,
      balance: 0,
    }
  }
}
