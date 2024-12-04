export interface IRequest {
  body: Record<string, unknown>
  params?: Record<string, unknown>
}

export interface IResponse {
  statusCode: number
  body: Record<string, unknown>
}

export interface IController {
  handle: (request: IRequest) => Promise<IResponse>
}
