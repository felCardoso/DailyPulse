"use client"

import { useState } from "react"
import { Pin, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import type { Note } from "@/types"
import { useDeleteNote, useUpdateNote, usePinNote } from "@/hooks/useNote"
import { cn } from "@/lib/utils"

interface Props {
  note: Note
}

export function NoteCard({ note }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(note.content)
  const [title, setTitle] = useState(note.title ?? "")
  const deleteNote = useDeleteNote()
  const updateNote = useUpdateNote()
  const pinNote = usePinNote()

  const preview = note.content.slice(0, 120)
  const needsExpand = note.content.length > 120

  const handleSave = () => {
    if (content.trim()) {
      updateNote.mutate({ id: note.id, data: { content: content.trim(), title: title.trim() || undefined } })
    }
    setEditing(false)
  }

  return (
    <div
      className={cn(
        "p-4 rounded-xl border transition-all",
        note.pinned ? "bg-violet-500/10 border-violet-500/20" : "bg-white/5 border-white/10"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título (opcional)"
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-white/30"
            />
          ) : (
            note.title && <p className="text-sm font-medium text-white/80">{note.title}</p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => pinNote.mutate({ id: note.id, pinned: !note.pinned })}
            className={cn("transition-colors", note.pinned ? "text-violet-400" : "text-white/20 hover:text-white/50")}
          >
            <Pin size={14} />
          </button>
          <button
            onClick={() => deleteNote.mutate(note.id)}
            className="text-white/20 hover:text-red-400 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {editing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-transparent text-sm text-white/70 outline-none resize-none min-h-[80px]"
          onBlur={handleSave}
          autoFocus
        />
      ) : (
        <p
          className="text-sm text-white/60 cursor-pointer whitespace-pre-wrap"
          onClick={() => setEditing(true)}
        >
          {expanded || !needsExpand ? note.content : preview + "..."}
        </p>
      )}

      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-white/25">
          {new Date(note.updatedAt).toLocaleDateString("pt-BR")}
        </span>
        {needsExpand && !editing && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-white/30 hover:text-white/60 transition-colors"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>
    </div>
  )
}
