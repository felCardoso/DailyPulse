"use client"

import { Trash2, Flame } from "lucide-react"
import type { Habit } from "@/types"
import { useDeleteHabit, useLogHabit, useHabitStreak } from "@/hooks/useHabit"
import { useAppStore } from "@/store/app-store"
import { cn } from "@/lib/utils"

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split("T")[0]
  })
}

interface Props {
  habit: Habit
}

export function HabitCard({ habit }: Props) {
  const deleteHabit = useDeleteHabit()
  const logHabit = useLogHabit()
  const streak = useHabitStreak(habit.id)
  const { habitLogs } = useAppStore()
  const today = new Date().toISOString().split("T")[0]
  const last7 = getLast7Days()

  const isCompletedOn = (date: string) =>
    habitLogs.some((l) => l.habitId === habit.id && l.date === date && l.completed)

  const todayDone = isCompletedOn(today)

  return (
    <div className="p-4 rounded-xl border bg-white/5 border-white/10">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: habit.color }}
          />
          <span className="text-sm font-medium">{habit.name}</span>
        </div>
        <div className="flex items-center gap-2">
          {streak > 0 && (
            <span className="flex items-center gap-1 text-xs text-orange-400">
              <Flame size={12} />
              {streak}
            </span>
          )}
          <button
            onClick={() => deleteHabit.mutate(habit.id)}
            className="text-white/20 hover:text-red-400 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-3">
        {last7.map((date) => (
          <div
            key={date}
            className={cn(
              "flex-1 h-5 rounded-md transition-all",
              isCompletedOn(date)
                ? "opacity-100"
                : date === today
                ? "bg-white/10"
                : "bg-white/5"
            )}
            style={isCompletedOn(date) ? { backgroundColor: habit.color + "99" } : undefined}
          />
        ))}
      </div>

      <button
        onClick={() => logHabit.mutate({ habitId: habit.id, date: today, completed: !todayDone })}
        className={cn(
          "w-full py-2 rounded-lg text-sm font-medium transition-all border",
          todayDone
            ? "border-transparent text-white/60 bg-white/5"
            : "border-transparent text-white"
        )}
        style={!todayDone ? { backgroundColor: habit.color } : undefined}
      >
        {todayDone ? "Feito hoje ✓" : "Marcar hoje"}
      </button>
    </div>
  )
}
