"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAppStore } from "@/store/app-store"
import {
  createTask, updateTask, deleteTask, checkTask, getTasksByUser,
} from "@/lib/services/task-service"
import type { Task, TaskFormData } from "@/types"
import { v4 as uuid } from "uuid"

export function useTasks() {
  const { user, tasks: localTasks, setTasks } = useAppStore()

  return useQuery({
    queryKey: ["tasks", user?.id],
    queryFn: async () => {
      const data = await getTasksByUser(user!.id)
      setTasks(data)
      return data
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
    initialData: localTasks.length > 0 ? localTasks : undefined,
  })
}

export function useCreateTask() {
  const qc = useQueryClient()
  const { user, addTask } = useAppStore()

  return useMutation({
    mutationFn: (data: TaskFormData) => createTask(user!.id, data),
    onMutate: (data) => {
      const optimistic: Task = {
        id: uuid(),
        userId: user!.id,
        title: data.title,
        description: data.description ?? null,
        priority: data.priority,
        dueDate: data.dueDate ?? null,
        completed: false,
        completedAt: null,
        syncStatus: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      addTask(optimistic)
      return { optimistic }
    },
    onSuccess: (task, _vars, ctx) => {
      const { removeTask, addTask: add } = useAppStore.getState()
      removeTask(ctx!.optimistic.id)
      add(task)
      qc.invalidateQueries({ queryKey: ["tasks"] })
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.optimistic) {
        useAppStore.getState().updateTask(ctx.optimistic.id, { syncStatus: "pending" })
      }
    },
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaskFormData> }) => updateTask(id, data),
    onMutate: ({ id, data }) => {
      useAppStore.getState().updateTask(id, { ...data, syncStatus: "pending" })
    },
    onSuccess: (task) => {
      useAppStore.getState().updateTask(task.id, { ...task, syncStatus: "synced" })
      qc.invalidateQueries({ queryKey: ["tasks"] })
    },
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onMutate: (id) => {
      useAppStore.getState().removeTask(id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  })
}

export function useCheckTask() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => checkTask(id, completed),
    onMutate: ({ id, completed }) => {
      useAppStore.getState().updateTask(id, {
        completed,
        completedAt: completed ? new Date() : null,
      })
    },
    onSuccess: (task) => {
      useAppStore.getState().updateTask(task.id, task)
      qc.invalidateQueries({ queryKey: ["tasks"] })
    },
  })
}
