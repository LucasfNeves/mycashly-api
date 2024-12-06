import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
  updateUser(userId: string, data: Prisma.UserUpdateInput): Promise<User | null>
  findById(userId: string): Promise<{
    id: string
    name: string
    email: string
  } | null>
  deleteUser(userId: string): Promise<{
    id: string
    name: string
    email: string
  } | null>
}
