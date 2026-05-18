export const TABLES = {
  CHILDREN: 'tblFrHOZMlOy53bFq',
  PARENTS: 'tbls6zYpbPSTvPOlG',
} as const

// קייטנות ילדים field IDs
export const CHILD_FIELDS = {
  FIRST_NAME: 'fldyTHZifg1oWuKFq',
  LAST_NAME: 'fldjH8myQtHeYFljQ',
  ID_NUMBER: 'fldh1IFcg1HDyf3HV',
  GENDER: 'fldZSy2GHn8SOfy2D',
  BIRTH_DATE: 'fldM2Na3LKXysnzCP',
  KINDERGARTEN_NAME: 'fld8fvRL5C5nwy2hE',
  SHIRT_SIZE: 'fldliamV3XdPWKMSx',
  HEALTH_FUND: 'fldWhzgqVuNeWn9tD',
  NOTES: 'fld4o48b241unsNrk',
  GRADE: 'fldiXRKVoiJqEMnsq',
  SCHOOL_NAME: 'fld8OpbJA2cJZkmYS',
  CLASS: 'fldEj4PRKDEyuPpOg',
  HEALTH_DECLARATION: 'fld5xBbj3IIeMiQCL',
  REGISTRATION_PERIOD: 'fldCmULKG7u5vwJdn',
  HAS_ALLERGY: 'fldtwF9PLhaO1pEYH',
  ALLERGY_DETAILS: 'fldwy7fz13LFhJH1J',
  DIAGNOSED: 'fldEvfjEG6Qy0bN01',
  HAS_AIDE: 'fldyXx511x1tWkh2Z',
  AIDE_COMMITMENT: 'fldTuKoEZLdCuo9Dh',
  COST_BEFORE_DISCOUNT: 'fldvAmnR4hObWmCd8',
  CAMP_YEAR: 'fldzDElHxQ8Erl6F1',
  PARENT_LINK: 'fldfaF8yvtaMnG23V',
  PRICE_SCHOOL_FULL: 'fldIwc6vMEVzJ0SLq',
  PRICE_SCHOOL_HALF: 'fldsCoRGZT6dGLu55',
  PRICE_KAN_FULL: 'fldbAP5Zf3lNKWjOQ',
  PRICE_KAN_HALF: 'fldUiSZEPiNnkANcV',
} as const

// קייטנות הורים field IDs
export const PARENT_FIELDS = {
  SUBMISSION_ID: 'fldqRJCZTPEEqK4wr',
  EMAIL: 'fldTKk9swqylwsCaQ',
  FATHER_NAME: 'fldFmWHffb7QOPDs7',
  FATHER_PHONE: 'flde4XNcFrHM8jZeU',
  MOTHER_NAME: 'fldK2uqUCa7ZdxDid',
  MOTHER_PHONE: 'fld5OzfjydOvXeLDE',
  CHILDREN_LINK: 'fldWKOxGrDZAP62g2',
  ADDRESS: 'fld4F1AWJWoat4wa7',
  NOTES: 'fldR3WiBry5PNeq7A',
  PAYMENT_METHOD: 'fldaxhokqqmI0RpP0',
  CAMP_YEAR: 'fldmiwv7WkcZR7Jlh',
  TOTAL_TO_PAY: 'fld6qgRKiSMeegpDP',
  MOTHER_SIGNED: 'fldQFpxs8xNP0A6Dm',
  FATHER_SIGNED: 'fldTWXgrAj1kIU7Ws',
  SIGNATURE_ATTACHMENT: 'fldwQti7AMUwXUSJ4',
  WHATSAPP_KAN_PARENTS: 'fldqKmBIlanDU3TZt',
  WHATSAPP_SCHOOL_PARENTS: 'fldNyJ3lLANicNwph',
  AMOUNT_BEFORE_DISCOUNT: 'fld69bzehqpXY3RLD',
  AMOUNT_AFTER_DISCOUNT: 'fldBaHLa5c578gQ8j',
  AMOUNT_PAID_NEDARIM: 'fldYipb4RTAKojBMI',
  TRANSACTION_ID: 'fldTtTcBEqNHIoGUb',
  CONTACT_MOTHER: 'fldi2uhkBsdzbqxLR',
  CONTACT_FATHER: 'fldYme1r5Rv3rz8Iy',
} as const

export const CAMP_YEAR_VALUE = 'קייטנה 2025'

export const REGISTRATION_PERIODS = {
  FULL: 'לכל התקופה מתאריך 23.07.25 עד 12.08.25',
  HALF_FIRST: 'לחלק הראשון של התקופה מתאריך 23.07.25 עד 31.07.25',
  HALF_SECOND: 'לחלק השני של התקופה, מתאריך 04.08.25 עד 12.08.25',
} as const

export const GRADE_OPTIONS = [
  'עולה לגן טרום חובה',
  'עולה לגן חובה',
  "עולה לכיתה א'",
  "עולה לכיתה ב'",
  "עולה לכיתה ג'",
  "עולה לכיתה ד'",
  "עולה לכיתה ה'",
] as const

export const SCHOOL_OPTIONS = [
  'בית חינוך',
  'יצחק נבון',
  'דקל',
  'אלעד',
  'צופית',
  'חב"ד אלעד',
] as const

export const SHIRT_SIZES = ['4', '6', '8', '10', '12', '14', '16', '18', 'S'] as const
export const HEALTH_FUNDS = ['כללית', 'מכבי', 'מאוחדת', 'לאומית'] as const
