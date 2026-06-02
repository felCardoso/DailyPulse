"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAppStore } from "@/store/app-store"
import {
  createRoutine,
  updateRoutine,
  deleteRoutine,
  checkRoutine,
  getRoutinesByUser,
} from "@/lib/services/routine-service"
import type { Routine, RoutineFormData, DayOfWeek } from "@/types"
import { v4 as uuid } from "uuid"

export function useRoutines() {
  const { user, routines: localRoutines, setRoutines } = useAppStore()

  return useQuery({
    queryKey: ["routines", user?.id],
    queryFn: async () => {
      const data = await getRoutinesByUser(user!.id)
      setRoutines(data)
      return data
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
    initialData: localRoutines.length > 0 ? localRoutines : undefined,
  })
}

export function useRoutinesByDay(day: DayOfWeek) {
  const { routines } = useAppStore()
  const { data = routines } = useRoutines()
  return data.filter((r) => r.day === day)
}

export function useCreateRoutine() {
  const qc = useQueryClient()
  const { user, addRoutine } = useAppStore()

  return useMutation({
    mutationFn: (data: RoutineFormData) => createRoutine(user!.id, data),
    onMutate: (data) => {
      // Write to Zustand immediately so it works offline
      const optimistic: Routine = {
        id: uuid(),
        userId: user!.id,
        name: data.name,
        description: data.description ?? null,
        day: data.day,
        time: data.time ?? null,
        completed: false,
        completedAt: null,
        syncStatus: "pending",
        remoteId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      addRoutine(optimistic)
      return { optimistic }
    },
    onSuccess: (routine, _vars, ctx) => {
      const { removeRoutine } = useAppStore.getState()
      // Replace optimistic entry with real server data
      removeRoutine(ctx!.optimistic.id)
      addRoutine(routine)
      qc.invalidateQueries({ queryKey: ["routines"] })
    },
    onError: (_err, _vars, ctx) => {
      // Keep the optimistic entry as "pending" — it was already saved to Zustand
      if (ctx?.optimistic) {
        const { updateRoutine } = useAppStore.getState()
        updateRoutine(ctx.optimistic.id, { syncStatus: "pending" })
      }
    },
  })
}

export function useUpdateRoutine() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RoutineFormData> }) =>
      updateRoutine(id, data),
    onMutate: ({ id, data }) => {
      useAppStore.getState().updateRoutine(id, { ...data, syncStatus: "pending" })
    },
    onSuccess: (routine) => {
      useAppStore.getState().updateRoutine(routine.id, { ...routine, syncStatus: "synced" })
      qc.invalidateQueries({ queryKey: ["routines"] })
    },
  })
}

export function useDeleteRoutine() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteRoutine(id),
    onMutate: (id) => {
      useAppStore.getState().removeRoutine(id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["routines"] }),
  })
}

export function useCheckRoutine() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      checkRoutine(id, completed),
    onMutate: ({ id, completed }) => {
      useAppStore.getState().updateRoutine(id, {
        completed,
        completedAt: completed ? new Date() : null,
      })
    },
    onSuccess: (routine) => {
      useAppStore.getState().updateRoutine(routine.id, routine)
      qc.invalidateQueries({ queryKey: ["routines"] })
    },
  })
}
