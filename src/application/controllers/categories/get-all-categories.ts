import { IController, IRequest, IResponse } from '../../interfaces/IController'
import { notFoundError, ok, serverError } from '../helpers/http'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../helpers/validation'
import { userNotFoundResponse } from '../helpers/user'
import { GetAllCategoriesUseCase } from '../../use-cases/categories'
import { NotFoundException } from '../../../errors/not-found-exception'

export class GetAllCategoriesController implements IController {
  constructor(
    private readonly getAllCategoriesUseCase: GetAllCategoriesUseCase,
  ) {}

  async handle({ userId }: IRequest): Promise<IResponse> {
    try {
      if (!userId) {
        return userNotFoundResponse()
      }

      const idIsValid = checkIfIdIsValid(userId)

      if (!idIsValid) {
        return generateInvalidIdResponse()
      }

      const categories = await this.getAllCategoriesUseCase.execute(userId)

      return ok(categories)
    } catch (error) {
      if (error instanceof NotFoundException) {
        return notFoundError({ errorMessage: error.message })
      }

      return serverError()
    }
  }
}
