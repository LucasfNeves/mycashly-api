import { ZodError } from 'zod'
import { validateTransactionsQueryParams } from '../../../schemas/transactions'
import { IController, IRequest, IResponse } from '../../interfaces/IController'
import { GetTopFiveExpensesUseCase } from '../../use-cases/transactions/get-top-five-expenses'
import { badRequest, ok, serverError } from '../helpers/http'
import { userNotFoundResponse } from '../helpers/user'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../helpers/validation'
import { UserNotFoundError } from '../../../errors'

export class GetTopFiveExpensesController implements IController {
  constructor(
    private readonly getTopFiveExpensesUseCase: GetTopFiveExpensesUseCase,
  ) {}

  async handle({ userId, query }: IRequest): Promise<IResponse> {
    try {
      if (!userId) {
        return userNotFoundResponse()
      }

      const isIdValid = checkIfIdIsValid(userId)

      if (!isIdValid) {
        return generateInvalidIdResponse()
      }

      const filters = validateTransactionsQueryParams.parse({
        month: query?.month ? Number(query.month) : undefined,
        year: query?.year ? Number(query.year) : undefined,
        type: query?.type,
      })

      const transactions = await this.getTopFiveExpensesUseCase.execute(
        userId,
        filters,
      )

      return ok(transactions)
    } catch (error) {
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
