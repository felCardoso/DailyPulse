"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateTask } from "@/hooks/useTask"
import type { TaskPriority } from "@/types"

export function TaskForm() {
  const router = useRouter()
  const createTask = useCreateTask()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<TaskPriority>("medium")
  const [dueDate, setDueDate] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    createTask.mutate(
      { title: title.trim(), description: description.trim() || undefined, priority, dueDate: dueDate ? new Date(dueDate) : undefined },
      { onSuccess: () => router.push("/tarefas") }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-white/60 mb-1">Título *</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Estudar TypeScript"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-1">Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalhes opcionais..."
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Prioridade</label>
        <div className="grid grid-cols-3 gap-2">
          {(["low", "medium", "high"] as TaskPriority[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`py-2 rounded-xl text-sm border transition-all ${
                priority === p
                  ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                  : "bg-white/3 border-white/10 text-white/50"
              }`}
            >
              {p === "low" ? "Baixa" : p === "medium" ? "Média" : "Alta"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-1">Data limite</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500/50 [color-scheme:dark]"
        />
      </div>

      <button
        type="submit"
        disabled={!title.trim() || createTask.isPending}
        className="w-full bg-violet-500 hover:bg-violet-600 disabled:opacity-40 text-white font-medium py-3 rounded-xl transition-colors"
      >
        {createTask.isPending ? "Criando..." : "Criar Tarefa"}
      </button>
    </form>
  )
}
