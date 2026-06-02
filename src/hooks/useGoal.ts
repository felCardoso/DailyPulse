"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAppStore } from "@/store/app-store"
import {
  createGoal, updateGoal, deleteGoal, getGoalsByUser, incrementGoal,
} from "@/lib/services/goal-service"
import type { Goal, GoalFormData } from "@/types"
import { v4 as uuid } from "uuid"

function getWeekStart(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(new Date().setDate(diff))
  return monday.toISOString().split("T")[0]
}

export function useGoals(weekStart?: string) {
  const { user, goals: localGoals, setGoals } = useAppStore()
  const ws = weekStart ?? getWeekStart()

  return useQuery({
    queryKey: ["goals", user?.id, ws],
    queryFn: async () => {
      const data = await getGoalsByUser(user!.id, ws)
      setGoals(data)
      return data
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
    initialData: localGoals.length > 0 ? localGoals : undefined,
  })
}

export function useCreateGoal() {
  const qc = useQueryClient()
  const { user, addGoal } = useAppStore()

  return useMutation({
    mutationFn: (data: GoalFormData) => createGoal(user!.id, data),
    onMutate: (data) => {
      const optimistic: Goal = {
        id: uuid(),
        userId: user!.id,
        title: data.title,
        targetValue: data.targetValue,
        currentValue: 0,
        unit: data.unit ?? null,
        weekStart: getWeekStart(),
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      addGoal(optimistic)
      return { optimistic }
    },
    onSuccess: (goal, _vars, ctx) => {
      const { removeGoal, addGoal: add } = useAppStore.getState()
      removeGoal(ctx!.optimistic.id)
      add(goal)
      qc.invalidateQueries({ queryKey: ["goals"] })
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.optimistic) {
        useAppStore.getState().removeGoal(ctx.optimistic.id)
      }
    },
  })
}

export function useUpdateGoal() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Goal> }) => updateGoal(id, data),
    onMutate: ({ id, data }) => {
      useAppStore.getState().updateGoal(id, data)
    },
    onSuccess: (goal) => {
      useAppStore.getState().updateGoal(goal.id, goal)
      qc.invalidateQueries({ queryKey: ["goals"] })
    },
  })
}

export function useDeleteGoal() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteGoal(id),
    onMutate: (id) => {
      useAppStore.getState().removeGoal(id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  })
}

export function useIncrementGoal() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, amount, current }: { id: string; amount: number; current: number }) =>
      incrementGoal(id, amount, current),
    onMutate: ({ id, amount, current }) => {
      const next = current + amount
      useAppStore.getState().updateGoal(id, { currentValue: next })
    },
    onSuccess: (goal) => {
      useAppStore.getState().updateGoal(goal.id, goal)
      qc.invalidateQueries({ queryKey: ["goals"] })
    },
  })
}
