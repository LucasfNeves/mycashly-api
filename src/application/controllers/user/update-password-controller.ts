import { IController, IRequest, IResponse } from '../../interfaces/IController'
import { UpdatePasswordUseCase } from '../../use-cases/user/update-password'
import { ok, serverError, userNotFound } from '../helpers/http'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../helpers/validation'
import { updatePasswordSchema } from '../../../schemas/user'

export class UpdatePasswordController implements IController {
  constructor(private readonly updatePasswordUseCase: UpdatePasswordUseCase) {}

  async handle({ body, userId }: IRequest): Promise<IResponse> {
    try {
      if (!userId) {
        return userNotFound({ errorMessage: 'User id is required' })
      }

      const isIdValid = checkIfIdIsValid(userId)

      if (!isIdValid) {
        return generateInvalidIdResponse()
      }

      const updatePasswordParams = await updatePasswordSchema.parseAsync(body)

      const { updatePassword } = await this.updatePasswordUseCase.execute(
        userId,
        updatePasswordParams,
      )

      return ok({ ...updatePassword })
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
