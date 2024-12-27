import { ZodError } from 'zod'
import { UserNotFoundError } from '../../../errors'
import { validateTransactionsQueryParams } from '../../../schemas/transactions'
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

  async handle({ userId, query }: IRequest): Promise<IResponse> {
    try {
      const { month, year, type } = query ?? {}

      if (!userId) {
        return badRequest({ message: 'User id is required' })
      }

      const idIsValid = checkIfIdIsValid(userId)

      if (!idIsValid) {
        return generateInvalidIdResponse()
      }

      const filters = validateTransactionsQueryParams.parse({
        month: Number(month),
        year: Number(year),
        type,
      })

      const transactions = await this.getTransactionsByUserIdUseCase.execute(
        userId,
        filters,
      )

      return ok({ transactions })
    } catch (error) {
      console.error(error)

      if (error instanceof ZodError) {
        return badRequest({ message: error.errors[0].message })
      }

      if (error instanceof UserNotFoundError) {
        return badRequest({ message: error.message })
      }

      return serverError()
    }
  }
}
