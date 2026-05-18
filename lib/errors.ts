export class AirtableFieldError extends Error {
  constructor(public fieldName: string, message: string) {
    super(message)
    this.name = 'AirtableFieldError'
  }
}

export class AirtableRateLimitError extends Error {
  constructor() {
    super('Airtable rate limit exceeded')
    this.name = 'AirtableRateLimitError'
  }
}

export class PaymentVerificationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PaymentVerificationError'
  }
}

export function toUserMessage(error: unknown): string {
  if (error instanceof AirtableFieldError)
    return 'שגיאה בשמירת הנתונים. בדקו את הפרטים ונסו שוב.'
  if (error instanceof AirtableRateLimitError)
    return 'עומס זמני. אנא נסו שוב בעוד מספר שניות.'
  if (error instanceof PaymentVerificationError)
    return 'אימות תשלום נכשל. פנו לתמיכה.'
  return 'אירעה שגיאה בלתי צפויה. אנא נסו שוב.'
}
