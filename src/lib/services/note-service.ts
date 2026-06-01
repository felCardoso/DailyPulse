import type { Note, NoteFormData } from "@/types"

export async function createNote(userId: string, data: NoteFormData): Promise<Note> {
  const res = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, ...data }),
  })
  if (!res.ok) throw new Error("Failed to create note")
  return res.json()
}

export async function updateNote(id: string, data: Partial<NoteFormData>): Promise<Note> {
  const res = await fetch(`/api/notes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update note")
  return res.json()
}

export async function deleteNote(id: string): Promise<void> {
  const res = await fetch(`/api/notes/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete note")
}

export async function pinNote(id: string, pinned: boolean): Promise<Note> {
  const res = await fetch(`/api/notes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pinned }),
  })
  if (!res.ok) throw new Error("Failed to pin note")
  return res.json()
}

export async function getNotesByUser(userId: string): Promise<Note[]> {
  const res = await fetch(`/api/notes?userId=${userId}`)
  if (!res.ok) throw new Error("Failed to fetch notes")
  return res.json()
}
