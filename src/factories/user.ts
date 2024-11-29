import { CreateUserController } from '@/http/controllers/user/index'
import { PrismaUsersRepository } from '@/repositories/prisma'
import { RegisterUseCase } from '@/use-cases/user/index'

export const makeCreateUserController = () => {
  const usersRepository = new PrismaUsersRepository()

  const createUserUseCase = new RegisterUseCase(usersRepository)

  const createUserController = new CreateUserController(createUserUseCase)

  return createUserController
}
