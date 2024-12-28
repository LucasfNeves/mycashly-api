import { PrismaUsersRepository } from '../application/repositories/postgres'

import {
  AuthenticateUserController,
  CreateUserController,
  DeleteUserController,
  GetUserBalanceController,
  GetUserByIdController,
  UpdateUserController,
} from '../application/controllers/user/index'
import {
  RegisterUseCase,
  AuthenticateUseCase,
  UpdateUserUseCase,
  GetUserByIdUseCase,
  DeleteUserUseCase,
  GetUserBalanceUseCase,
} from '../application/use-cases/user/index'

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

export const makeGetUserByIdController = () => {
  const usersRepository = new PrismaUsersRepository()

  const getUserByIdUseCase = new GetUserByIdUseCase(usersRepository)

  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

  return getUserByIdController
}

export const makeDeleteUserController = () => {
  const usersRepository = new PrismaUsersRepository()

  const deleteUserUseCase = new DeleteUserUseCase(usersRepository)

  const deleteUserController = new DeleteUserController(deleteUserUseCase)

  return deleteUserController
}

export const makeGetUserBalanceController = () => {
  const usersRepository = new PrismaUsersRepository()

  const getUserBalanceUseCase = new GetUserBalanceUseCase(usersRepository)

  const getUserBalanceController = new GetUserBalanceController(
    getUserBalanceUseCase,
  )

  return getUserBalanceController
}
