"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAppStore } from "@/store/app-store"
import {
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutsByUser,
  addExercise,
  updateExercise,
  deleteExercise,
} from "@/lib/services/workout-service"
import type { Workout, WorkoutFormData, ExerciseFormData } from "@/types"
import { v4 as uuid } from "uuid"

export function useWorkouts() {
  const { user, workouts: localWorkouts, setWorkouts } = useAppStore()

  return useQuery({
    queryKey: ["workouts", user?.id],
    queryFn: async () => {
      const data = await getWorkoutsByUser(user!.id)
      setWorkouts(data)
      return data
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
    initialData: localWorkouts.length > 0 ? localWorkouts : undefined,
  })
}

export function useCreateWorkout() {
  const qc = useQueryClient()
  const { user, addWorkout } = useAppStore()

  return useMutation({
    mutationFn: (data: WorkoutFormData) => createWorkout(user!.id, data),
    onMutate: (data) => {
      const optimistic: Workout = {
        id: uuid(),
        userId: user!.id,
        name: data.name,
        description: data.description ?? null,
        date: data.date ?? new Date(),
        completed: false,
        syncStatus: "pending",
        remoteId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        exercises: [],
      }
      addWorkout(optimistic)
      return { optimistic }
    },
    onSuccess: (workout, _vars, ctx) => {
      const { removeWorkout, addWorkout } = useAppStore.getState()
      removeWorkout(ctx!.optimistic.id)
      addWorkout(workout)
      qc.invalidateQueries({ queryKey: ["workouts"] })
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.optimistic) {
        useAppStore.getState().updateWorkout(ctx.optimistic.id, { syncStatus: "pending" })
      }
    },
  })
}

export function useUpdateWorkout() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WorkoutFormData> }) =>
      updateWorkout(id, data),
    onMutate: ({ id, data }) => {
      useAppStore.getState().updateWorkout(id, { ...data, syncStatus: "pending" })
    },
    onSuccess: (workout) => {
      useAppStore.getState().updateWorkout(workout.id, { ...workout, syncStatus: "synced" })
      qc.invalidateQueries({ queryKey: ["workouts"] })
    },
  })
}

export function useDeleteWorkout() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteWorkout(id),
    onMutate: (id) => {
      useAppStore.getState().removeWorkout(id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workouts"] }),
  })
}

export function useAddExercise(workoutId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ExerciseFormData) => addExercise(workoutId, data),
    onSuccess: (exercise) => {
      const { workouts, setWorkouts } = useAppStore.getState()
      setWorkouts(
        workouts.map((w) =>
          w.id === workoutId
            ? { ...w, exercises: [...(w.exercises ?? []), exercise] }
            : w
        )
      )
      qc.invalidateQueries({ queryKey: ["workouts"] })
    },
  })
}

export function useUpdateExercise(workoutId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      exerciseId,
      data,
    }: {
      exerciseId: string
      data: Partial<ExerciseFormData & { completed: boolean }>
    }) => updateExercise(workoutId, exerciseId, data),
    onMutate: ({ exerciseId, data }) => {
      const { workouts, setWorkouts } = useAppStore.getState()
      setWorkouts(
        workouts.map((w) =>
          w.id === workoutId
            ? {
                ...w,
                exercises: (w.exercises ?? []).map((e) =>
                  e.id === exerciseId ? { ...e, ...data } : e
                ),
              }
            : w
        )
      )
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workouts"] }),
  })
}

export function useDeleteExercise(workoutId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (exerciseId: string) => deleteExercise(workoutId, exerciseId),
    onMutate: (exerciseId) => {
      const { workouts, setWorkouts } = useAppStore.getState()
      setWorkouts(
        workouts.map((w) =>
          w.id === workoutId
            ? { ...w, exercises: (w.exercises ?? []).filter((e) => e.id !== exerciseId) }
            : w
        )
      )
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workouts"] }),
  })
}
