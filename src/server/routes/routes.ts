import {
  makeAuthenticateController,
  makeCreateUserController,
  makeDeleteUserController,
  makeGetUserByIdController,
  makeUpdateUserController,
} from '../../factories/user'
import { routeAdapter } from '../../adapters/route-adapter'
import { Router } from 'express'
import { middlewareAdapter } from '../../adapters/middleware-adapter'
import { makeAuthenticationMiddleware } from '../../factories/make-authenticate-middleware'
import { makeGetAllCategoriesController } from '../../factories/categories'
import { makeCreateTransactionsController } from '../../factories/transactions'

export const router = Router()

/** Authenticate */

router.post('/auth/signup', routeAdapter(makeCreateUserController()))

router.post('/auth/signin', routeAdapter(makeAuthenticateController()))

/** Authenticated */

/** Users */

router.get(
  '/users/me',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeGetUserByIdController()),
)

router.patch(
  '/users',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeUpdateUserController()),
)

router.delete(
  '/users',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeDeleteUserController()),
)

/** Categories */

router.get(
  '/categories',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeGetAllCategoriesController()),
)

/** Transactions */
router.post(
  '/transactions',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeCreateTransactionsController()),
)
