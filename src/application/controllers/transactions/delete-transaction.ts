import { NotFoundException } from '../../../errors'
import { IController } from '../../interfaces/IController'
import { IRequest, IResponse } from '../../interfaces/IController'
import { DeleteTransactionUseCase } from '../../use-cases/transactions/delete-transaction'
import { notFoundError, ok, serverError } from '../helpers/http'
import { userNotFoundResponse } from '../helpers/user'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../helpers/validation'

export class DeleteTransactionController implements IController {
  constructor(
    private readonly deleteTransactionUseCase: DeleteTransactionUseCase,
  ) {}

  async handle({ params }: IRequest): Promise<IResponse> {
    try {
      const transactionId = params?.transactionId as string

      const isIdValid = checkIfIdIsValid(transactionId)

      if (!isIdValid) {
        return generateInvalidIdResponse()
      }

      const deleteTransaction =
        await this.deleteTransactionUseCase.execute(transactionId)

      if (!deleteTransaction) {
        return notFoundError({
          errorMessage: 'Transaction not found',
        })
      }

      return ok({ ...deleteTransaction })
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return notFoundError({ errorMessage: 'Transaction not found' })
      }

      if (error instanceof NotFoundException) {
        return userNotFoundResponse()
      }
      console.error(error)

      return serverError()
    }
  }
}
