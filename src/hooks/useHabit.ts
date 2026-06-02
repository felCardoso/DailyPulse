"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAppStore } from "@/store/app-store"
import {
  createHabit, updateHabit, deleteHabit, getHabitsByUser, logHabit,
} from "@/lib/services/habit-service"
import type { Habit, HabitFormData, HabitLog } from "@/types"
import { v4 as uuid } from "uuid"

export function useHabits() {
  const { user, habits: localHabits, setHabits } = useAppStore()

  return useQuery({
    queryKey: ["habits", user?.id],
    queryFn: async () => {
      const data = await getHabitsByUser(user!.id)
      setHabits(data)
      return data
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
    initialData: localHabits.length > 0 ? localHabits : undefined,
  })
}

export function useCreateHabit() {
  const qc = useQueryClient()
  const { user, addHabit } = useAppStore()

  return useMutation({
    mutationFn: (data: HabitFormData) => createHabit(user!.id, data),
    onMutate: (data) => {
      const optimistic: Habit = {
        id: uuid(),
        userId: user!.id,
        name: data.name,
        description: data.description ?? null,
        color: data.color ?? "#8b5cf6",
        icon: data.icon ?? null,
        frequency: data.frequency,
        targetDays: data.targetDays ?? [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      addHabit(optimistic)
      return { optimistic }
    },
    onSuccess: (habit, _vars, ctx) => {
      const { removeHabit, addHabit: add } = useAppStore.getState()
      removeHabit(ctx!.optimistic.id)
      add(habit)
      qc.invalidateQueries({ queryKey: ["habits"] })
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.optimistic) {
        useAppStore.getState().removeHabit(ctx.optimistic.id)
      }
    },
  })
}

export function useUpdateHabit() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HabitFormData> }) => updateHabit(id, data),
    onMutate: ({ id, data }) => {
      useAppStore.getState().updateHabit(id, data)
    },
    onSuccess: (habit) => {
      useAppStore.getState().updateHabit(habit.id, habit)
      qc.invalidateQueries({ queryKey: ["habits"] })
    },
  })
}

export function useDeleteHabit() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteHabit(id),
    onMutate: (id) => {
      useAppStore.getState().removeHabit(id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habits"] }),
  })
}

export function useLogHabit() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ habitId, date, completed }: { habitId: string; date: string; completed: boolean }) =>
      logHabit(habitId, date, completed),
    onMutate: ({ habitId, date, completed }) => {
      if (completed) {
        const log: HabitLog = {
          id: uuid(),
          habitId,
          date,
          completed: true,
          createdAt: new Date(),
        }
        useAppStore.getState().upsertHabitLog(log)
      } else {
        useAppStore.getState().removeHabitLog(habitId, date)
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habits"] }),
  })
}

export function useHabitStreak(habitId: string): number {
  const { habitLogs } = useAppStore()
  const logs = habitLogs
    .filter((l) => l.habitId === habitId && l.completed)
    .map((l) => l.date)
    .sort()
    .reverse()

  if (logs.length === 0) return 0

  const today = new Date().toISOString().split("T")[0]
  let streak = 0
  let current = today

  for (const date of logs) {
    if (date === current) {
      streak++
      const d = new Date(current)
      d.setDate(d.getDate() - 1)
      current = d.toISOString().split("T")[0]
    } else if (date < current) {
      break
    }
  }
  return streak
}
