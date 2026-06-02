import type { RoutineItem } from "@/types"

export async function getRoutineItems(routineId: string): Promise<RoutineItem[]> {
  const res = await fetch(`/api/routines/${routineId}/items`)
  if (!res.ok) throw new Error("Failed to fetch items")
  return res.json()
}

export async function createRoutineItem(routineId: string, title: string): Promise<RoutineItem> {
  const res = await fetch(`/api/routines/${routineId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  })
  if (!res.ok) throw new Error("Failed to create item")
  return res.json()
}

export async function updateRoutineItem(
  routineId: string,
  itemId: string,
  data: Partial<RoutineItem>
): Promise<RoutineItem> {
  const res = await fetch(`/api/routines/${routineId}/items/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update item")
  return res.json()
}

export async function deleteRoutineItem(routineId: string, itemId: string): Promise<void> {
  const res = await fetch(`/api/routines/${routineId}/items/${itemId}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete item")
}
