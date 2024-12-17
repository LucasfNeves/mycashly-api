import { z } from 'zod'
import { NotFoundException } from '../../../errors/not-found-exception'
import { UserNotFoundError } from '../../../errors/user-not-found-error'
import { createtransactionSchema } from '../../../schemas/transactions'
import { IController, IRequest, IResponse } from '../../interfaces/IController'
import { CreateTransactionUseCase } from '../../use-cases/transactions/create-transactions'
import {
  badRequest,
  created,
  notFoundError,
  serverError,
} from '../helpers/http'
import { userNotFoundResponse } from '../helpers/user'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../helpers/validation'

export class CreateTransactionsController implements IController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  async handle({ body, accountId }: IRequest): Promise<IResponse> {
    try {
      const { categoryId, name, value, date, type } =
        await createtransactionSchema.parseAsync(body)

      const userId = accountId

      if (!userId) {
        return userNotFoundResponse()
      }

      const idIsValid = checkIfIdIsValid(userId)

      if (!idIsValid) {
        return generateInvalidIdResponse()
      }

      const transaction = await this.createTransactionUseCase.execute({
        categoryId,
        date,
        name,
        type,
        value,
        userId,
      })

      return created({ ...transaction })
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors[0].message
        return badRequest({ errorMessage })
      }

      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse()
      }

      if (error instanceof NotFoundException) {
        return notFoundError({ errorMessage: error.message })
      }

      return serverError()
    }
  }
}
