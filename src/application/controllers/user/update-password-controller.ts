import { IController, IRequest, IResponse } from '../../interfaces/IController'
import { UpdatePasswordUseCase } from '../../use-cases/user/update-password'
import { badRequest, ok, serverError, userNotFound } from '../helpers/http'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../helpers/validation'
import { updatePasswordSchema } from '../../../schemas/user'
import { ZodError } from 'zod'
import { PasswordMustBeDifferentError } from '../../../errors/password-must-be-different-error'
import { InvalidCredentialsError, UserNotFoundError } from '../../../errors'

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
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return userNotFound({ errorMessage: 'User not found' })
      }

      if (error instanceof ZodError) {
        return badRequest({
          message: error.errors[0].message,
        })
      }

      if (error instanceof UserNotFoundError) {
        return userNotFound({ errorMessage: 'User not found' })
      }

      if (error instanceof PasswordMustBeDifferentError) {
        return badRequest({
          message: error.message,
        })
      }

      if (error instanceof InvalidCredentialsError) {
        return badRequest({
          message: error.message,
        })
      }

      return serverError()
    }
  }
}
