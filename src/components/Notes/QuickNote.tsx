"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { useCreateNote } from "@/hooks/useNote"

export function QuickNote() {
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [open, setOpen] = useState(false)
  const createNote = useCreateNote()

  const handleCreate = () => {
    if (!content.trim()) return
    createNote.mutate(
      { content: content.trim(), title: title.trim() || undefined },
      {
        onSuccess: () => {
          setContent("")
          setTitle("")
          setOpen(false)
        },
      }
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2 p-4 rounded-xl border border-dashed border-white/15 text-white/40 hover:border-violet-500/40 hover:text-white/60 transition-all text-sm"
      >
        <Plus size={16} />
        Nova nota...
      </button>
    )
  }

  return (
    <div className="p-4 rounded-xl border border-violet-500/30 bg-violet-500/5">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título (opcional)"
        className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-white/30 mb-2"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escreva aqui..."
        rows={4}
        className="w-full bg-transparent text-sm text-white/70 outline-none resize-none placeholder:text-white/30"
        autoFocus
      />
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleCreate}
          disabled={!content.trim() || createNote.isPending}
          className="flex-1 bg-violet-500 hover:bg-violet-600 disabled:opacity-40 text-white text-sm font-medium py-2 rounded-lg transition-colors"
        >
          {createNote.isPending ? "Salvando..." : "Salvar"}
        </button>
        <button
          onClick={() => { setOpen(false); setContent(""); setTitle("") }}
          className="px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white/80 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
