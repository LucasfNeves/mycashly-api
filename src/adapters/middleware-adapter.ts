import { NextFunction, Request, Response } from 'express'
import { IMiddleware } from '../application/interfaces/IMiddleware'

// Currying
export function middlewareAdapter(middleware: IMiddleware) {
  return async (request: Request, response: Response, next: NextFunction) => {
    const result = await middleware.handle({
      headers: request.headers as Record<string, unknown>,
    })

    if ('statusCode' in result) {
      response.status(result.statusCode).send(result.body)
    }

    if ('data' in result) {
      request.metadata = {
        ...request.metadata,
        ...result.data,
      }
    }

    next()
  }
}
