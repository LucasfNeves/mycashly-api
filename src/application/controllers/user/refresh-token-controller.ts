import { ZodError } from 'zod'

import { serverError, unauthorized, badRequest, ok } from '../helpers/http'

import { RefreshTokenUseCase } from '../../use-cases/user/refresh-token-use-case'

import { RefreshTokenExpiredError } from '../../../errors/refresh-token-expired-error'
import { NotFoundException } from '../../../errors'

import { refreshTokenSchema } from '../../../schemas/user'

import { IController, IRequest, IResponse } from '../../interfaces/IController'

export class RefreshTokenController implements IController {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    try {
      const params = await refreshTokenSchema.parseAsync(body)
      const { refreshToken: refreshTokenId } = params

      const { accessToken, refreshToken: newRefreshTokenId } =
        await this.refreshTokenUseCase.execute(refreshTokenId)

      return ok({ accessToken, refreshToken: newRefreshTokenId })
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors[0].message
        return badRequest({ errorMessage })
      }

      if (
        error instanceof NotFoundException ||
        error instanceof RefreshTokenExpiredError
      ) {
        return unauthorized({ errorMessage: error.message })
      }

      return serverError()
    }
  }
}
