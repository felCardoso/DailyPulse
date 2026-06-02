"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import {
  useRoutineItems,
  useCreateRoutineItem,
  useUpdateRoutineItem,
  useDeleteRoutineItem,
} from "@/hooks/useRoutineItems"
import { cn } from "@/lib/utils"

interface Props {
  routineId: string
}

export function RoutineChecklist({ routineId }: Props) {
  const { data: items = [], isLoading } = useRoutineItems(routineId)
  const createItem = useCreateRoutineItem(routineId)
  const updateItem = useUpdateRoutineItem(routineId)
  const deleteItem = useDeleteRoutineItem(routineId)
  const [newTitle, setNewTitle] = useState("")

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    createItem.mutate(newTitle.trim(), {
      onSuccess: () => setNewTitle(""),
    })
  }

  if (isLoading) return <div className="h-16 rounded-xl bg-white/5 animate-pulse" />

  return (
    <div className="space-y-2">
      <p className="text-xs text-white/40 uppercase tracking-wider">Checklist</p>

      {items.length > 0 && (
        <div className="space-y-1.5">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 group">
              <button
                onClick={() => updateItem.mutate({ itemId: item.id, data: { completed: !item.completed } })}
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all",
                  item.completed ? "bg-violet-500 border-violet-500" : "border-white/30"
                )}
              >
                {item.completed && (
                  <svg viewBox="0 0 12 12" className="w-full h-full p-0.5 text-white">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                )}
              </button>
              <span className={cn("flex-1 text-sm", item.completed && "line-through text-white/30")}>
                {item.title}
              </span>
              <button
                onClick={() => deleteItem.mutate(item.id)}
                className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Adicionar item..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/25"
        />
        <button
          type="submit"
          disabled={!newTitle.trim() || createItem.isPending}
          className="w-9 h-9 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 disabled:opacity-30 flex items-center justify-center transition-all text-violet-400"
        >
          <Plus size={16} />
        </button>
      </form>
    </div>
  )
}
