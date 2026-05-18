interface PaymentParams {
  registrationId: string
  amountILS: number
  parentName: string
}

interface NedarimPaymentConfig {
  iframeUrl: string
}

export function buildNedarimPaymentUrl(params: PaymentParams): NedarimPaymentConfig {
  const terminalId = process.env.NEDARIM_TERMINAL_ID
  if (!terminalId) throw new Error('NEDARIM_TERMINAL_ID is not set')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const today = new Date()
  const apiValid = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`
  const uniqueRef = `${params.registrationId}_${Date.now()}`

  const callbackUrl = `${appUrl}/api/payment/callback`
  const successUrl = `${appUrl}/payment/return?status=success&registrationId=${params.registrationId}`
  const failUrl = `${appUrl}/payment/return?status=fail&registrationId=${params.registrationId}`

  const queryParams = new URLSearchParams({
    mosadID: terminalId,
    ApiValid: apiValid,
    Sum: String(params.amountILS),
    Zeout: uniqueRef,
    Comment: `קייטנה 2025 - ${params.parentName}`,
    SukumType: '1',
    Currency: '1',
    PageLanguage: 'HE',
    CallbackURL: callbackUrl,
    SuccessURL: successUrl,
    FailURL: failUrl,
  })

  return {
    iframeUrl: `https://www.matara.pro/nedarimplus/online/?${queryParams.toString()}`,
  }
}
