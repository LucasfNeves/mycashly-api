import { UserNotFoundError } from '../../../errors/user-not-found-error'
import { IController, IRequest, IResponse } from '../../interfaces/IController'
import { GetUserByIdUseCase } from '../../use-cases/user/get-user-by-id'
import { ok, serverError } from '../helpers/http'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../helpers/validation'

export class GetUserByIdController implements IController {
  constructor(private readonly getUserByIdUseCase: GetUserByIdUseCase) {}
  async handle({ accountId }: IRequest): Promise<IResponse> {
    try {
      const userId = accountId

      if (!userId) {
        throw new UserNotFoundError()
      }

      const idIsValid = checkIfIdIsValid(userId)

      if (!idIsValid) {
        generateInvalidIdResponse()
      }

      const user = await this.getUserByIdUseCase.execute(userId)

      return ok({ ...user })
    } catch (error) {
      console.error(error)

      return serverError()
    }
  }
}
