declare namespace Express {
  export interface Request {
    metadata: {
      userId?: string
    }
  }
}
