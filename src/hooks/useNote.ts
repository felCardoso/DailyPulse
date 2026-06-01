"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAppStore } from "@/store/app-store"
import {
  createNote, updateNote, deleteNote, pinNote, getNotesByUser,
} from "@/lib/services/note-service"
import type { Note, NoteFormData } from "@/types"
import { v4 as uuid } from "uuid"

export function useNotes() {
  const { user, notes: localNotes, setNotes } = useAppStore()

  return useQuery({
    queryKey: ["notes", user?.id],
    queryFn: async () => {
      const data = await getNotesByUser(user!.id)
      setNotes(data)
      return data
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
    initialData: localNotes.length > 0 ? localNotes : undefined,
  })
}

export function useCreateNote() {
  const qc = useQueryClient()
  const { user, addNote } = useAppStore()

  return useMutation({
    mutationFn: (data: NoteFormData) => createNote(user!.id, data),
    onMutate: (data) => {
      const optimistic: Note = {
        id: uuid(),
        userId: user!.id,
        title: data.title ?? null,
        content: data.content,
        pinned: data.pinned ?? false,
        syncStatus: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      addNote(optimistic)
      return { optimistic }
    },
    onSuccess: (note, _vars, ctx) => {
      const { removeNote, addNote: add } = useAppStore.getState()
      removeNote(ctx!.optimistic.id)
      add(note)
      qc.invalidateQueries({ queryKey: ["notes"] })
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.optimistic) {
        useAppStore.getState().updateNote(ctx.optimistic.id, { syncStatus: "pending" })
      }
    },
  })
}

export function useUpdateNote() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NoteFormData> }) => updateNote(id, data),
    onMutate: ({ id, data }) => {
      useAppStore.getState().updateNote(id, { ...data, syncStatus: "pending" })
    },
    onSuccess: (note) => {
      useAppStore.getState().updateNote(note.id, { ...note, syncStatus: "synced" })
      qc.invalidateQueries({ queryKey: ["notes"] })
    },
  })
}

export function useDeleteNote() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onMutate: (id) => {
      useAppStore.getState().removeNote(id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  })
}

export function usePinNote() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, pinned }: { id: string; pinned: boolean }) => pinNote(id, pinned),
    onMutate: ({ id, pinned }) => {
      useAppStore.getState().updateNote(id, { pinned })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  })
}
