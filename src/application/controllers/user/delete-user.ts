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
  async handle({ accountId }: IRequest): Promise<IResponse> {
    try {
      const userId = accountId

      if (!userId) {
        throw new UserNotFoundError()
      }

      const idIsValid = checkIfIdIsValid(userId)

      if (!idIsValid) {
        return generateInvalidIdResponse()
      }

      const deleteUser = await this.deleteUserUseCase.execute(userId)

      if (!deleteUser) {
        return userNotFoundResponse()
      }

      return ok({ ...deleteUser })
    } catch (error) {
      console.error(error)

      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return userNotFoundResponse()
      }

      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse()
      }

      return serverError()
    }
  }
}
