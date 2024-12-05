import { Request, Response } from 'express'

import { IController } from '../application/interfaces/IController'

// Currying
export function routeAdapter(controller: IController) {
  return async (request: Request, response: Response) => {
    console.log(request.metadata.accountId)

    const { statusCode, body } = await controller.handle({
      body: request.body,
      params: request.params,
      accountId: request.metadata.accountId,
    })

    response.status(statusCode).send(body)
  }
}
