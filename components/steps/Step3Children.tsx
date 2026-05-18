'use client'

import { useState } from 'react'
import { useRegistration } from '@/context/RegistrationContext'
import AddChildForm from '@/components/AddChildForm'
import ChildCard from '@/components/ChildCard'
import type { ChildFormData } from '@/lib/validation/schemas'

export default function Step3Children() {
  const { state, dispatch } = useRegistration()
  const [showForm, setShowForm] = useState(state.children.length === 0)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  function handleSaveNew(child: ChildFormData) {
    dispatch({ type: 'ADD_CHILD', child })
    setShowForm(false)
  }

  function handleSaveEdit(child: ChildFormData) {
    if (editingIndex !== null) {
      dispatch({ type: 'UPDATE_CHILD', index: editingIndex, child })
      setEditingIndex(null)
    }
  }

  function handleRemove(index: number) {
    dispatch({ type: 'REMOVE_CHILD', index })
  }

  function handleEdit(index: number) {
    setShowForm(false)
    setEditingIndex(index)
  }

  function handleContinue() {
    if (state.children.length === 0) return
    dispatch({ type: 'SET_STEP', step: 4 })
  }

  return (
    <div className="animate-slide-up space-y-6">
      <div>
        <h2 className="section-title">ילדים להרשמה</h2>
        <p className="text-sm text-gray-500">הוסיפו את כל הילדים שברצונכם לרשום לקייטנה</p>
      </div>

      {/* Existing children */}
      {state.children.length > 0 && !showForm && editingIndex === null && (
        <div className="space-y-3">
          {state.children.map((child, i) => (
            <ChildCard
              key={i}
              child={child}
              index={i}
              onRemove={handleRemove}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Edit form */}
      {editingIndex !== null && (
        <div className="form-card">
          <AddChildForm
            initial={state.children[editingIndex]}
            onSave={handleSaveEdit}
            onCancel={() => setEditingIndex(null)}
          />
        </div>
      )}

      {/* New child form */}
      {showForm && editingIndex === null && (
        <div className="form-card">
          <AddChildForm
            onSave={handleSaveNew}
            onCancel={() => state.children.length > 0 && setShowForm(false)}
          />
        </div>
      )}

      {/* Add button */}
      {!showForm && editingIndex === null && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary-300 py-4 text-primary-600 font-semibold hover:bg-primary-50 transition"
        >
          <span className="text-xl">+</span>
          הוספת ילד/ה נוסף/ת
        </button>
      )}

      {state.children.length === 0 && !showForm && (
        <p className="text-center text-sm text-red-500">יש להוסיף לפחות ילד אחד להמשך</p>
      )}

      {/* Nav */}
      {editingIndex === null && !showForm && (
        <div className="flex justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_STEP', step: 2 })}
            className="btn-secondary"
          >
            ← חזור
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={state.children.length === 0}
            className="btn-primary flex-1"
          >
            המשך — סיכום ←
          </button>
        </div>
      )}
    </div>
  )
}
