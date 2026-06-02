"use client"

import { useGoals } from "@/hooks/useGoal"
import { GoalCard } from "./GoalCard"

export function GoalList() {
  const { data: goals = [], isLoading } = useGoals()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    )
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-8 text-white/30 text-sm">
        Nenhuma meta esta semana
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  )
}
