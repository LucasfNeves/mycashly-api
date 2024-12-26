export interface IRequest {
  headers: Record<string, unknown>
}

export interface IResponse {
  statusCode: number
  body: Record<string, unknown>
}

export interface IData {
  data: { userId: string }
}

export interface IMiddleware {
  handle: (request: IRequest) => Promise<IResponse | IData>
}
