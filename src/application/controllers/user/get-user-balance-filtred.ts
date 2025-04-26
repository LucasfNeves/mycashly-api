import { badRequest, ok, userNotFound } from '../helpers/http'
import { IController, IRequest } from '../../interfaces/IController'
import { IResponse } from '../../interfaces/IController'
import { serverError } from '../helpers/http'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../helpers/validation'
import { UserNotFoundError } from '../../../errors'
import { GetUserBalanceFilteredUseCase } from '../../use-cases/user/get-user-balancer-filtered'
import { validateTransactionsQueryParams } from '../../../schemas/transactions'
import { ZodError } from 'zod'

export class GetUserBalanceFilteredController implements IController {
  constructor(
    private readonly getUserBalanceFiltredUseCase: GetUserBalanceFilteredUseCase,
  ) {}

  async handle({ userId, query }: IRequest): Promise<IResponse> {
    try {
      if (!userId) {
        return userNotFound({ errorMessage: 'User not found' })
      }

      const idIsValid = checkIfIdIsValid(userId)

      if (!idIsValid) {
        return generateInvalidIdResponse()
      }

      const filters = validateTransactionsQueryParams.parse({
        month: query?.month ? Number(query.month) : undefined,
        year: query?.year ? Number(query.year) : undefined,
      })

      const balance = await this.getUserBalanceFiltredUseCase.execute(
        userId,
        filters,
      )

      return ok(balance)
    } catch (error) {
      if (
        error instanceof UserNotFoundError ||
        (error instanceof Error && 'code' in error && error.code === 'P2025')
      ) {
        return userNotFound({ errorMessage: 'User not found' })
      }

      if (error instanceof ZodError) {
        return badRequest({ message: error.errors[0].message })
      }

      return serverError()
    }
  }
}
