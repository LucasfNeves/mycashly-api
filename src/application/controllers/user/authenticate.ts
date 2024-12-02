import { env } from 'process'
import { z } from 'zod'
import { badRequest, serverError, unauthorized } from '../helpers/http'

import { authenticateUserSchema } from '../../../schemas/user'
import { AuthenticateUseCase } from '../../use-cases/user/authenticate'
import { InvalidCredentialsError } from '../../../errors/user-already-exists copy'
import { ok } from '../helpers/http'
import { IController, IRequest, IResponse } from '../../interfaces/IController'

export class AuthenticateUserController implements IController {
  constructor(private readonly authenticateUseCase: AuthenticateUseCase) {}

  async handle(request: IRequest): Promise<IResponse> {
    try {
      const params = await authenticateUserSchema.parseAsync(request.body)

      const { email, password } = params

      const { acessToken } = await this.authenticateUseCase.execute({
        email,
        password,
      })

      return ok({ acessToken })
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return unauthorized({
          message: error.message,
        })
      }

      if (error instanceof z.ZodError) {
        const errorMessage = error.errors[0].message
        return badRequest({ errorMessage })
      }

      if (env.NODE_ENV !== 'production') {
        console.error(error)
      } else {
        // TODO: Here we should log the error in a log service
      }

      return serverError()
    }
  }
}
