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
import { RefreshTokenController } from '../application/controllers/user/refresh-token-controller'
import { PrismaRefreshTokenRepository } from '../application/repositories/postgres/prisma-refresh-token-repository'
import { JwtAdapterImpl } from '../adapters/jwt-adapter'
import { RefreshTokenUseCase } from '../application/use-cases/user/refresh-token-use-case'
import { UpdatePasswordUseCase } from '../application/use-cases/user/update-password'
import { UpdatePasswordController } from '../application/controllers/user/update-password-controller'

export const makeCreateUserController = () => {
  const usersRepository = new PrismaUsersRepository()
  const refreshTokenRepository = new PrismaRefreshTokenRepository()
  const jwtAdapter = new JwtAdapterImpl()

  const registerUserUseCase = new RegisterUseCase(
    usersRepository,
    refreshTokenRepository,
    jwtAdapter,
  )

  const createUserController = new CreateUserController(registerUserUseCase)

  return createUserController
}

export const makeAuthenticateController = () => {
  const usersRepository = new PrismaUsersRepository()
  const refreshTokenRepository = new PrismaRefreshTokenRepository()
  const jwtAdapter = new JwtAdapterImpl()

  const authenticateUseCase = new AuthenticateUseCase(
    usersRepository,
    refreshTokenRepository,
    jwtAdapter,
  )

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

export const makeRefreshTokenController = () => {
  const refreshTokenRepository = new PrismaRefreshTokenRepository()
  const jwtAdapter = new JwtAdapterImpl()

  const refreshTokenUseCase = new RefreshTokenUseCase(
    refreshTokenRepository,
    jwtAdapter,
  )

  const refreshTokenController = new RefreshTokenController(refreshTokenUseCase)

  return refreshTokenController
}

export const makeUpdatePasswordController = () => {
  const usersRepository = new PrismaUsersRepository()

  const updatePasswordUseCase = new UpdatePasswordUseCase(usersRepository)

  const updatePasswordController = new UpdatePasswordController(
    updatePasswordUseCase,
  )

  return updatePasswordController
}
