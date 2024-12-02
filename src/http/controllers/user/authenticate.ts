import { env } from 'process'
import { z } from 'zod'
import { badRequest, serverError } from '../helpers/http'

import { authenticateUserSchema } from '../../../schemas/user'
import { AuthenticateUseCase } from '../../../use-cases/user/authenticate'
import { InvalidCredentialsError } from '../../../errors/user-already-exists copy'
import { ok } from '../helpers/http'

interface AuthenticateUserRequest {
  body: {
    email: string
    password: string
  }
}

export class AuthenticateUserController {
  constructor(private authenticateUseCase: AuthenticateUseCase) {}

  async execute(httpRequest: AuthenticateUserRequest) {
    try {
      const params = httpRequest.body

      await authenticateUserSchema.parseAsync(params)

      const { email, password } = params

      const user = await this.authenticateUseCase.execute({
        email,
        password,
      })

      return ok({ ...user })
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return badRequest({
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
