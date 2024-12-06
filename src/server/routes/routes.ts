import {
  makeAuthenticateController,
  makeCreateUserController,
  makeGetUserByIdController,
  makeUpdateUserController,
} from '../../factories/user'
import { routeAdapter } from '../../adapters/route-adapter'
import { Router } from 'express'
import { middlewareAdapter } from '../../adapters/middleware-adapter'
import { makeAuthenticationMiddleware } from '../../factories/make-authenticate-middleware'

export const router = Router()

/** Users */

router.post('/users', routeAdapter(makeCreateUserController()))

router.post('/sessions', routeAdapter(makeAuthenticateController()))

/** Users Authenticated */

router.patch(
  '/users',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeUpdateUserController()),
)

router.get(
  '/users',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeGetUserByIdController()),
)

/** Transactions */

/** Transactions Authenticated */
