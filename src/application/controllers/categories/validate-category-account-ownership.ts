import { ValidateCategoryOwnershipUseCase } from '../../use-cases/categories'
import { notFoundError, ok, serverError } from '../helpers/http'
import { IController, IRequest } from '../../interfaces/IController'
import { IResponse } from '../../interfaces/IMiddleware'
import { UserNotFoundError } from '../../../errors/user-not-found-error'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../helpers/validation'
import { NotFoundException } from '../../../errors/not-found-exception'

export class ValidateCategoryOwnershipController implements IController {
  constructor(
    private readonly validateCategoryOwnershipUseCase: ValidateCategoryOwnershipUseCase,
  ) {}

  async handle({ accountId, params }: IRequest): Promise<IResponse> {
    try {
      const { categoryId } = params!

      if (!categoryId) {
        throw new NotFoundException('Category ID is required')
      }

      if (!accountId) {
        throw new UserNotFoundError()
      }

      const userIdIsValid = checkIfIdIsValid(accountId)

      if (!userIdIsValid) {
        return generateInvalidIdResponse()
      }

      const isOwner = await this.validateCategoryOwnershipUseCase.execute({
        accountId,
        categoryId,
      })

      return ok({ ...isOwner })
    } catch (error) {
      console.error(error)
      if (error instanceof NotFoundException) {
        return notFoundError({ errorMessage: error.message })
      }

      if (error instanceof Error && 'code' in error && error.code === 'P2023') {
        return notFoundError({ errorMessage: 'Category not found' })
      }

      return serverError()
    }
  }
}
