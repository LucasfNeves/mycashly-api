type ResponseBody = {
  errorMessage?: string
  message?: string
  [key: string]: string | number | boolean | object | null | undefined
}

type Response = {
  statusCode: number
  body: Record<string, unknown>
}

export const badRequest = (body: ResponseBody): Response => {
  return {
    statusCode: 400,
    body,
  }
}

export const conflict = (body: ResponseBody): Response => {
  return {
    statusCode: 409,
    body,
  }
}

export const unauthorized = (body: ResponseBody): Response => {
  return {
    statusCode: 401,
    body,
  }
}

export const userNotFound = ({
  errorMessage,
}: {
  errorMessage: string
}): Response => {
  return {
    statusCode: 404,
    body: { errorMessage },
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

export const ok = <T>(body: T | T[]): Response => {
  return {
    statusCode: 200,
    body: body as Record<string, unknown>,
  }
}
