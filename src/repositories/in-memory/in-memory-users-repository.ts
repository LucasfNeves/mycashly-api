import { User, Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'

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
}
