import { UserNotFoundError } from '../../../errors/user-not-found-error'
import { IController, IRequest, IResponse } from '../../interfaces/IController'
import { GetUserByIdUseCase } from '../../use-cases/user/get-user-by-id'
import { ok, serverError } from '../helpers/http'
import { userNotFoundResponse } from '../helpers/user'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../helpers/validation'

export class GetUserByIdController implements IController {
  constructor(private readonly getUserByIdUseCase: GetUserByIdUseCase) {}
  async handle({ userId }: IRequest): Promise<IResponse> {
    try {
      if (!userId) {
        throw new UserNotFoundError()
      }

      const idIsValid = checkIfIdIsValid(userId)

      if (!idIsValid) {
        return generateInvalidIdResponse()
      }

      const user = await this.getUserByIdUseCase.execute(userId)

      if (!user) {
        return userNotFoundResponse()
      }

      return ok({ ...user })
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse()
      }

      return serverError()
    }
  }
}
