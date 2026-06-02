"use client"

import { useNotes } from "@/hooks/useNote"
import { NoteCard } from "./NoteCard"

export function NoteList() {
  const { data: notes = [], isLoading } = useNotes()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-white/30 text-sm">
        Nenhuma nota ainda
      </div>
    )
  }

  const pinned = notes.filter((n) => n.pinned)
  const rest = notes.filter((n) => !n.pinned)

  return (
    <div className="space-y-3">
      {pinned.length > 0 && (
        <>
          <p className="text-xs text-white/30 uppercase tracking-wider px-1">Fixadas</p>
          {pinned.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
          {rest.length > 0 && <p className="text-xs text-white/30 uppercase tracking-wider px-1">Outras</p>}
        </>
      )}
      {rest.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  )
}
