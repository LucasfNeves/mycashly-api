import { UserNotFoundError } from '../../../errors'
import { IController, IRequest, IResponse } from '../../interfaces/IController'
import { GetTransactionsByUserIdUseCase } from '../../use-cases/transactions/get-transactions-by-user-id'
import { badRequest, ok, serverError } from '../helpers/http'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../helpers/validation'

export class GetTransactionsByUserIdController implements IController {
  constructor(
    private getTransactionsByUserIdUseCase: GetTransactionsByUserIdUseCase,
  ) {}

  async handle({ userId }: IRequest): Promise<IResponse> {
    try {
      if (!userId) {
        return badRequest({ message: 'User id is required' })
      }

      const idIsValid = checkIfIdIsValid(userId)

      if (!idIsValid) {
        return generateInvalidIdResponse()
      }

      const transactions =
        await this.getTransactionsByUserIdUseCase.execute(userId)

      return ok({ ...transactions })
    } catch (error) {
      console.error(error)

      if (error instanceof UserNotFoundError) {
        return badRequest({ message: error.message })
      }

      return serverError()
    }
  }
}
