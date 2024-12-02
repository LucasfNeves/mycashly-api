import { PrismaUsersRepository } from '../repositories/prisma'

import {
  AuthenticateUserController,
  CreateUserController,
} from '../http/controllers/user/index'
import { RegisterUseCase, AuthenticateUseCase } from '../use-cases/user/index'

export const makeCreateUserController = () => {
  const usersRepository = new PrismaUsersRepository()

  const registerUserUseCase = new RegisterUseCase(usersRepository)

  const createUserController = new CreateUserController(registerUserUseCase)

  return createUserController
}

export const makeAuthenticateController = () => {
  const usersRepository = new PrismaUsersRepository()

  const authenticateUseCase = new AuthenticateUseCase(usersRepository)

  const authenticateController = new AuthenticateUserController(
    authenticateUseCase,
  )

  return authenticateController
}
