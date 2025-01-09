import { ok, serverError } from '../helpers/http'
import { UserNotFoundError } from '../../../errors/user-not-found-error'
import { IController, IRequest, IResponse } from '../../interfaces/IController'
import { DeleteUserUseCase } from '../../use-cases/user/delete-user'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../helpers/validation'
import { userNotFoundResponse } from '../helpers/user'

export class DeleteUserController implements IController {
  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {}
  async handle({ userId }: IRequest): Promise<IResponse> {
    try {
      if (!userId) {
        throw new UserNotFoundError()
      }

      const idIsValid = checkIfIdIsValid(userId)

      if (!idIsValid) {
        return generateInvalidIdResponse()
      }

      const { user } = await this.deleteUserUseCase.execute(userId)

      if (!user) {
        return userNotFoundResponse()
      }

      return ok(user)
    } catch (error) {
      if (
        error instanceof UserNotFoundError ||
        (error instanceof Error && 'code' in error && error.code === 'P2025')
      ) {
        return userNotFoundResponse()
      }

      return serverError()
    }
  }
}
