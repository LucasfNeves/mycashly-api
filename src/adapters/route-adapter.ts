import { Request, Response } from 'express'
import { IController } from '../application/interfaces/IController'

// Currying
export function routeAdapter(controller: IController) {
  return async (request: Request, response: Response) => {
    const { statusCode, body } = await controller.handle({ body: request.body })

    response.status(statusCode).send(body)
  }
}
