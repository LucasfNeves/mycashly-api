type ResponseBody = {
  errorMessage?: string
  message?: string
  [key: string]: string | number | boolean | object | null | undefined
}

type Response = {
  statusCode: number
  body: ResponseBody
}

export const badRequest = (body: ResponseBody): Response => {
  return {
    statusCode: 400,
    body,
  }
}

export const unauthorized = (body: ResponseBody): Response => {
  return {
    statusCode: 401,
    body,
  }
}

export const userNotFound = (): Response => {
  return {
    statusCode: 404,
    body: {
      errorMessage: 'User not found',
    },
  }
}

export const notFoundError = ({
  errorMessage,
}: {
  errorMessage: string
}): Response => {
  return {
    statusCode: 404,
    body: { errorMessage },
  }
}

export const created = (body: ResponseBody): Response => {
  return {
    statusCode: 201,
    body,
  }
}

export const serverError = (): Response => {
  return {
    statusCode: 500,
    body: {
      errorMessage: 'Internal server error',
    },
  }
}

export const ok = (body: ResponseBody): Response => {
  return {
    statusCode: 200,
    body,
  }
}
