export const NEDARIM_IFRAME_URL = 'https://www.matara.pro/nedarimplus/iframe/'

interface NedarimPaymentParams {
  registrationId: string
  amountILS: number
  firstName: string
  lastName: string
  phone?: string
  email?: string
  city?: string
  callbackUrl: string
}

export interface NedarimPostMessagePayload {
  Mosad: string
  ApiValid: string
  Zeout: string
  FirstName: string
  LastName: string
  Street: string
  City: string
  Phone: string
  Mail: string
  PaymentType: string
  Amount: string
  Tashlumim: string
  Day: string
  Currency: string
  Groupe: string
  Comment: string
  Param1: string
  Param2: string
  CallBack: string
  CallBackMailError: string
}

export function buildNedarimPostMessage(params: NedarimPaymentParams): NedarimPostMessagePayload {
  const mosad = process.env.NEDARIM_TERMINAL_ID
  const apiValid = process.env.NEDARIM_API_VALID
  if (!mosad) throw new Error('NEDARIM_TERMINAL_ID is not set')
  if (!apiValid) throw new Error('NEDARIM_API_VALID is not set')

  return {
    Mosad: mosad,
    ApiValid: apiValid,
    Zeout: '',
    FirstName: params.firstName,
    LastName: params.lastName,
    Street: '',
    City: params.city ?? '',
    Phone: params.phone ?? '',
    Mail: params.email ?? '',
    PaymentType: 'Ragil',
    Amount: String(params.amountILS),
    Tashlumim: '1',
    Day: '',
    Currency: '1',
    Groupe: '',
    Comment: 'קייטנה 2025',
    Param1: params.registrationId,
    Param2: '',
    CallBack: `${params.callbackUrl}?rid=${encodeURIComponent(params.registrationId)}`,
    CallBackMailError: '',
  }
}
