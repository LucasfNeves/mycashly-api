import { PrismaUsersRepository } from '../application/repositories/postgres'

import {
  AuthenticateUserController,
  CreateUserController,
} from '../application/controllers/user/index'
import {
  RegisterUseCase,
  AuthenticateUseCase,
  UpdateUserUseCase,
} from '../application/use-cases/user/index'
import { UpdateUserController } from '../application/controllers/user/update-user'

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

export const makeUpdateUserController = () => {
  const usersRepository = new PrismaUsersRepository()

  const updateUserUseCase = new UpdateUserUseCase(usersRepository)

  const updateUserController = new UpdateUserController(updateUserUseCase)

  return updateUserController
}
