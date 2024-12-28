import { ok, userNotFound } from '../helpers/http'
import { IController, IRequest } from '../../interfaces/IController'
import { IResponse } from '../../interfaces/IController'
import { GetUserBalanceUseCase } from '../../use-cases/user'
import { serverError } from '../helpers/http'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../helpers/validation'
import { NotFoundException, UserNotFoundError } from '../../../errors'

export class GetUserBalanceController implements IController {
  constructor(private readonly getUserBalanceUseCase: GetUserBalanceUseCase) {}

  async handle({ userId }: IRequest): Promise<IResponse> {
    if (!userId) {
      return userNotFound({ errorMessage: 'User not found' })
    }
    try {
      const idIsValid = checkIfIdIsValid(userId)

      if (!idIsValid) {
        return generateInvalidIdResponse()
      }

      const balance = await this.getUserBalanceUseCase.execute(userId)

      return ok(balance)
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return userNotFound({ errorMessage: 'User not found' })
      }

      if (error instanceof NotFoundException) {
        return userNotFound({ errorMessage: error.message })
      }

      if (error instanceof UserNotFoundError) {
        return userNotFound({ errorMessage: error.message })
      }

      return serverError()
    }
  }
}
