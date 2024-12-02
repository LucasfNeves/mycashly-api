import { UserAlreadyExists } from '../../../errors/user-already-exists'
import { env } from 'process'
import { z } from 'zod'
import { badRequest, created, serverError } from '../helpers/http'

import { createUserSchema } from '../../../schemas/user'
import { User } from '@prisma/client'

interface CreateUserRequest {
  body: {
    email: string
    name: string
    password: string
  }
}

interface RegisterUserUseCaseParams {
  execute: (params: {
    email: string
    name: string
    password: string
  }) => Promise<{ createdUser: User }>
}

export class CreateUserController {
  constructor(private registerUserUseCase: RegisterUserUseCaseParams) {}

  async register(httpRequest: CreateUserRequest) {
    try {
      const params = httpRequest.body

      await createUserSchema.parseAsync(params)

      const { email, name, password } = params

      const createdUser = await this.registerUserUseCase.execute({
        email,
        name,
        password,
      })

      return created(createdUser)
    } catch (error) {
      if (error instanceof UserAlreadyExists) {
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
