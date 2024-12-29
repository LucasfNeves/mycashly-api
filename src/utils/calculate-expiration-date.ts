export function calculateExpirationDate(daysToAdd: number): Date {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + daysToAdd)
  return expiresAt
}
