"use client"

import { Trash2, Plus, Minus } from "lucide-react"
import type { Goal } from "@/types"
import { useDeleteGoal, useIncrementGoal } from "@/hooks/useGoal"

interface Props {
  goal: Goal
}

export function GoalCard({ goal }: Props) {
  const deleteGoal = useDeleteGoal()
  const increment = useIncrementGoal()
  const pct = Math.min((goal.currentValue / goal.targetValue) * 100, 100)

  return (
    <div className="p-4 rounded-xl border bg-white/5 border-white/10">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{goal.title}</p>
          <p className="text-xs text-white/40 mt-0.5">
            {goal.currentValue.toLocaleString("pt-BR")}{goal.unit ? ` ${goal.unit}` : ""} / {goal.targetValue.toLocaleString("pt-BR")}{goal.unit ? ` ${goal.unit}` : ""}
          </p>
        </div>
        <button
          onClick={() => deleteGoal.mutate(goal.id)}
          className="text-white/20 hover:text-red-400 transition-colors flex-shrink-0 ml-2"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="h-2 bg-white/10 rounded-full mb-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${pct}%`,
            backgroundColor: goal.completed || pct >= 100 ? "#22c55e" : "#8b5cf6",
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40">{Math.round(pct)}%</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => increment.mutate({ id: goal.id, amount: -1, current: goal.currentValue })}
            disabled={goal.currentValue <= 0}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all flex items-center justify-center"
          >
            <Minus size={12} />
          </button>
          <button
            onClick={() => increment.mutate({ id: goal.id, amount: 1, current: goal.currentValue })}
            disabled={goal.currentValue >= goal.targetValue}
            className="w-7 h-7 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 disabled:opacity-30 transition-all flex items-center justify-center text-violet-400"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
