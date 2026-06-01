"use client"

import { useState } from "react"
import { useCreateGoal } from "@/hooks/useGoal"

interface Props {
  onSuccess?: () => void
}

export function GoalForm({ onSuccess }: Props) {
  const createGoal = useCreateGoal()
  const [title, setTitle] = useState("")
  const [targetValue, setTargetValue] = useState("")
  const [unit, setUnit] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const target = parseFloat(targetValue)
    if (!title.trim() || isNaN(target) || target <= 0) return
    createGoal.mutate(
      { title: title.trim(), targetValue: target, unit: unit.trim() || undefined },
      {
        onSuccess: () => {
          setTitle("")
          setTargetValue("")
          setUnit("")
          onSuccess?.()
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm text-white/60 mb-1">Meta *</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Quilômetros corridos"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-white/60 mb-1">Valor alvo *</label>
          <input
            type="number"
            min="1"
            step="any"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            placeholder="10"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Unidade</label>
          <input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="km, horas..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={!title.trim() || !targetValue || createGoal.isPending}
        className="w-full bg-violet-500 hover:bg-violet-600 disabled:opacity-40 text-white font-medium py-3 rounded-xl transition-colors"
      >
        {createGoal.isPending ? "Criando..." : "Criar Meta"}
      </button>
    </form>
  )
}
