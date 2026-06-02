import type { Habit, HabitLog, HabitFormData } from "@/types"

export async function createHabit(userId: string, data: HabitFormData): Promise<Habit> {
  const res = await fetch("/api/habits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, ...data }),
  })
  if (!res.ok) throw new Error("Failed to create habit")
  return res.json()
}

export async function updateHabit(id: string, data: Partial<HabitFormData>): Promise<Habit> {
  const res = await fetch(`/api/habits/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update habit")
  return res.json()
}

export async function deleteHabit(id: string): Promise<void> {
  const res = await fetch(`/api/habits/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete habit")
}

export async function getHabitsByUser(userId: string): Promise<Habit[]> {
  const res = await fetch(`/api/habits?userId=${userId}`)
  if (!res.ok) throw new Error("Failed to fetch habits")
  const data = await res.json()
  return data.map((h: Habit & { targetDays: string }) => ({
    ...h,
    targetDays: typeof h.targetDays === "string" ? JSON.parse(h.targetDays) : h.targetDays,
  }))
}

export async function logHabit(habitId: string, date: string, completed: boolean): Promise<HabitLog | { ok: boolean }> {
  const res = await fetch(`/api/habits/${habitId}/logs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, completed }),
  })
  if (!res.ok) throw new Error("Failed to log habit")
  return res.json()
}
