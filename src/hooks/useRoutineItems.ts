"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getRoutineItems, createRoutineItem, updateRoutineItem, deleteRoutineItem,
} from "@/lib/services/routine-item-service"

export function useRoutineItems(routineId: string) {
  return useQuery({
    queryKey: ["routineItems", routineId],
    queryFn: () => getRoutineItems(routineId),
    enabled: !!routineId,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateRoutineItem(routineId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (title: string) => createRoutineItem(routineId, title),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["routineItems", routineId] }),
  })
}

export function useUpdateRoutineItem(routineId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: { completed?: boolean; title?: string } }) =>
      updateRoutineItem(routineId, itemId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["routineItems", routineId] }),
  })
}

export function useDeleteRoutineItem(routineId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => deleteRoutineItem(routineId, itemId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["routineItems", routineId] }),
  })
}
