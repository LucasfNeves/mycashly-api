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
}
