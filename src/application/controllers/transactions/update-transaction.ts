import { z } from 'zod'
import { NotFoundException } from '../../../errors/not-found-exception'
import { UserNotFoundError } from '../../../errors/user-not-found-error'
import { updateTransactionSchema } from '../../../schemas/transactions'
import { IController, IRequest, IResponse } from '../../interfaces/IController'
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
import { UpdateTransactionUseCase } from '../../use-cases/transactions/update-transaction'
import { UpdateTransactionUseCaseParams } from '../../use-cases/transactions/update-transaction'

export class UpdateTransactionsController implements IController {
  constructor(
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
  ) {}

  async handle({ body, userId, params }: IRequest): Promise<IResponse> {
    try {
      const updateTransactionParams =
        body as unknown as UpdateTransactionUseCaseParams

      const transactionId = params?.transactionId as string

      await updateTransactionSchema.parseAsync(updateTransactionParams)

      if (!userId) {
        return userNotFoundResponse()
      }

      const idIsValid = checkIfIdIsValid(userId)

      const transactionIdIsValid = checkIfIdIsValid(transactionId)

      if (!idIsValid || !transactionIdIsValid) {
        return generateInvalidIdResponse()
      }

      const updatedTransaction = await this.updateTransactionUseCase.execute(
        transactionId,
        userId,
        updateTransactionParams,
      )

      return created({ ...updatedTransaction })
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

      console.error(error)

      return serverError()
    }
  }
}
