"use client"

import { useHabits } from "@/hooks/useHabit"
import { HabitCard } from "./HabitCard"

export function HabitList() {
  const { data: habits = [], isLoading } = useHabits()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    )
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-8 text-white/30 text-sm">
        Nenhum hábito ainda
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
    </div>
  )
}
