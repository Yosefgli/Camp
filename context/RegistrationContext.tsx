'use client'

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import type { ParentFormData, ChildFormData, SummaryFormData, SignatureFormData } from '@/lib/validation/schemas'

export interface RegistrationState {
  step: number
  campInfoAcknowledged: boolean
  parent: Partial<ParentFormData>
  children: ChildFormData[]
  summary: Partial<SummaryFormData>
  signature: Partial<SignatureFormData>
  registrationId: string | null
  totalAmount: number | null
  couponApplied: boolean
}

type Action =
  | { type: 'SET_STEP'; step: number }
  | { type: 'ACKNOWLEDGE_CAMP_INFO' }
  | { type: 'SET_PARENT'; parent: ParentFormData }
  | { type: 'ADD_CHILD'; child: ChildFormData }
  | { type: 'REMOVE_CHILD'; index: number }
  | { type: 'UPDATE_CHILD'; index: number; child: ChildFormData }
  | { type: 'SET_SUMMARY'; summary: SummaryFormData }
  | { type: 'SET_SIGNATURE'; signature: SignatureFormData }
  | { type: 'SET_REGISTRATION_RESULT'; registrationId: string; totalAmount: number }
  | { type: 'SET_COUPON'; applied: boolean }
  | { type: 'RESET' }

const initialState: RegistrationState = {
  step: 1,
  campInfoAcknowledged: false,
  parent: {},
  children: [],
  summary: {},
  signature: {},
  registrationId: null,
  totalAmount: null,
  couponApplied: false,
}

function reducer(state: RegistrationState, action: Action): RegistrationState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step }
    case 'ACKNOWLEDGE_CAMP_INFO':
      return { ...state, campInfoAcknowledged: true }
    case 'SET_PARENT':
      return { ...state, parent: action.parent }
    case 'ADD_CHILD':
      return { ...state, children: [...state.children, action.child] }
    case 'REMOVE_CHILD':
      return { ...state, children: state.children.filter((_, i) => i !== action.index) }
    case 'UPDATE_CHILD':
      return {
        ...state,
        children: state.children.map((c, i) => (i === action.index ? action.child : c)),
      }
    case 'SET_SUMMARY':
      return { ...state, summary: action.summary }
    case 'SET_SIGNATURE':
      return { ...state, signature: action.signature }
    case 'SET_REGISTRATION_RESULT':
      return { ...state, registrationId: action.registrationId, totalAmount: action.totalAmount }
    case 'SET_COUPON':
      return { ...state, couponApplied: action.applied }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

const STORAGE_KEY = 'camp_reg_state'

interface ContextValue {
  state: RegistrationState
  dispatch: React.Dispatch<Action>
  goToStep: (step: number) => void
  canGoToStep: (step: number) => boolean
}

const RegistrationContext = createContext<ContextValue | null>(null)

export function RegistrationProvider({ children: providerChildren }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    if (typeof window === 'undefined') return init
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      return saved ? (JSON.parse(saved) as RegistrationState) : init
    } catch {
      return init
    }
  })

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // sessionStorage unavailable
    }
  }, [state])

  const canGoToStep = useCallback(
    (target: number): boolean => {
      if (target <= 1) return true
      if (target === 2) return state.campInfoAcknowledged
      if (target === 3) return state.campInfoAcknowledged && !!state.parent.email
      if (target === 4) return target > 3 && state.children.length > 0
      if (target === 5) return target > 4 && !!state.summary.paymentMethod
      return false
    },
    [state],
  )

  const goToStep = useCallback(
    (step: number) => {
      if (canGoToStep(step) || step < state.step) {
        dispatch({ type: 'SET_STEP', step })
      }
    },
    [canGoToStep, state.step],
  )

  return (
    <RegistrationContext.Provider value={{ state, dispatch, goToStep, canGoToStep }}>
      {providerChildren}
    </RegistrationContext.Provider>
  )
}

export function useRegistration(): ContextValue {
  const ctx = useContext(RegistrationContext)
  if (!ctx) throw new Error('useRegistration must be used inside RegistrationProvider')
  return ctx
}
