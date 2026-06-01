import type { Task, TaskFormData } from "@/types"

export async function createTask(userId: string, data: TaskFormData): Promise<Task> {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, ...data }),
  })
  if (!res.ok) throw new Error("Failed to create task")
  return res.json()
}

export async function updateTask(id: string, data: Partial<TaskFormData>): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update task")
  return res.json()
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete task")
}

export async function checkTask(id: string, completed: boolean): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed, completedAt: completed ? new Date() : null }),
  })
  if (!res.ok) throw new Error("Failed to update task")
  return res.json()
}

export async function getTasksByUser(userId: string): Promise<Task[]> {
  const res = await fetch(`/api/tasks?userId=${userId}`)
  if (!res.ok) throw new Error("Failed to fetch tasks")
  return res.json()
}
