import { UserNotFoundError } from '../../../errors/user-not-found-error'
import { IController, IRequest, IResponse } from '../../interfaces/IController'
import { ok, serverError } from '../helpers/http'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../helpers/validation'
import { userNotFoundResponse } from '../helpers/user'
import { GetAllCategoriesUseCase } from '../../use-cases/categories'

export class GetAllCategoriesController implements IController {
  constructor(
    private readonly getAllCategoriesUseCase: GetAllCategoriesUseCase,
  ) {}

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

      const categories = await this.getAllCategoriesUseCase.execute(userId)

      return ok({ ...categories })
    } catch (error) {
      console.error(error)
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse()
      }

      return serverError()
    }
  }
}
