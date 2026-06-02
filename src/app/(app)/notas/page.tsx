"use client"

import { QuickNote } from "@/components/Notes/QuickNote"
import { NoteList } from "@/components/Notes/NoteList"

export default function NotasPage() {
  return (
    <div className="py-6 space-y-5">
      <h1 className="text-2xl font-bold">Notas</h1>
      <QuickNote />
      <NoteList />
    </div>
  )
}
