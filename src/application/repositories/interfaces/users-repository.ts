import { Prisma, User } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { TransactionsFilters } from '../../use-cases/transactions'

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
  updateUser(
    userId: string,
    data: Prisma.UserUpdateInput,
  ): Promise<{
    id: string
    name: string
    email: string
  } | null>
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

  getUserBalance(userId: string): Promise<{
    expenses: number | Decimal
    incomes: number | Decimal
    investments: number | Decimal
    balance: number | Decimal
  }>

  getUserBalanceFiltred(
    userId: string,
    filters: TransactionsFilters,
  ): Promise<{
    expenses: number | Decimal
    incomes: number | Decimal
    investments: number | Decimal
    balance: number | Decimal
  }>

  updatePassword(
    userId: string,
    password: string,
  ): Promise<{
    id: string
    name: string
    email: string
  } | null>

  getUserWithPasswordByIdRepository(userId: string): Promise<{
    id: string
    name: string
    email: string
    password: string
  } | null>
}
