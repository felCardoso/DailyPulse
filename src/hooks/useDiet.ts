"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAppStore } from "@/store/app-store"
import {
  createMeal,
  updateMeal,
  deleteMeal,
  getMealsByUser,
} from "@/lib/services/diet-service"
import type { Meal, MealFormData } from "@/types"
import { v4 as uuid } from "uuid"

export function useMeals() {
  const { user, meals: localMeals, setMeals } = useAppStore()

  return useQuery({
    queryKey: ["meals", user?.id],
    queryFn: async () => {
      const data = await getMealsByUser(user!.id)
      setMeals(data)
      return data
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
    initialData: localMeals.length > 0 ? localMeals : undefined,
  })
}

export function useCreateMeal() {
  const qc = useQueryClient()
  const { user, addMeal } = useAppStore()

  return useMutation({
    mutationFn: (data: MealFormData) => createMeal(user!.id, data),
    onMutate: (data) => {
      const optimistic: Meal = {
        id: uuid(),
        userId: user!.id,
        name: data.name,
        description: data.description ?? null,
        date: data.date ?? new Date(),
        mealType: data.mealType,
        calories: data.calories ?? null,
        protein: data.protein ?? null,
        carbs: data.carbs ?? null,
        fat: data.fat ?? null,
        syncStatus: "pending",
        remoteId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      addMeal(optimistic)
      return { optimistic }
    },
    onSuccess: (meal, _vars, ctx) => {
      const { removeMeal, addMeal } = useAppStore.getState()
      removeMeal(ctx!.optimistic.id)
      addMeal(meal)
      qc.invalidateQueries({ queryKey: ["meals"] })
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.optimistic) {
        useAppStore.getState().updateMeal(ctx.optimistic.id, { syncStatus: "pending" })
      }
    },
  })
}

export function useUpdateMeal() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MealFormData> }) =>
      updateMeal(id, data),
    onMutate: ({ id, data }) => {
      useAppStore.getState().updateMeal(id, { ...data, syncStatus: "pending" })
    },
    onSuccess: (meal) => {
      useAppStore.getState().updateMeal(meal.id, { ...meal, syncStatus: "synced" })
      qc.invalidateQueries({ queryKey: ["meals"] })
    },
  })
}

export function useDeleteMeal() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteMeal(id),
    onMutate: (id) => {
      useAppStore.getState().removeMeal(id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["meals"] }),
  })
}
