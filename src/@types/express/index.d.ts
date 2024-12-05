declare namespace Express {
  export interface Request {
    metadata: {
      accountId?: string
    }
  }
}
