import type { Goal, GoalFormData } from "@/types"

function getWeekStart(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(new Date().setDate(diff))
  return monday.toISOString().split("T")[0]
}

export async function createGoal(userId: string, data: GoalFormData): Promise<Goal> {
  const res = await fetch("/api/goals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, weekStart: getWeekStart(), ...data }),
  })
  if (!res.ok) throw new Error("Failed to create goal")
  return res.json()
}

export async function updateGoal(id: string, data: Partial<Goal>): Promise<Goal> {
  const res = await fetch(`/api/goals/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update goal")
  return res.json()
}

export async function deleteGoal(id: string): Promise<void> {
  const res = await fetch(`/api/goals/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete goal")
}

export async function incrementGoal(id: string, amount: number, current: number): Promise<Goal> {
  const res = await fetch(`/api/goals/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentValue: current + amount }),
  })
  if (!res.ok) throw new Error("Failed to update goal")
  return res.json()
}

export async function getGoalsByUser(userId: string, weekStart?: string): Promise<Goal[]> {
  const params = new URLSearchParams({ userId })
  if (weekStart) params.set("weekStart", weekStart)
  const res = await fetch(`/api/goals?${params}`)
  if (!res.ok) throw new Error("Failed to fetch goals")
  return res.json()
}
