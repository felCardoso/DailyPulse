"use client"

import { useTasks } from "@/hooks/useTask"
import { TaskCard } from "./TaskCard"
import type { Task } from "@/types"

interface Props {
  filter?: "all" | "pending" | "completed"
  limit?: number
}

export function TaskList({ filter = "all", limit }: Props) {
  const { data: tasks = [], isLoading } = useTasks()

  const filtered = tasks.filter((t: Task) => {
    if (filter === "pending") return !t.completed
    if (filter === "completed") return t.completed
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    const order: Record<string, number> = { high: 0, medium: 1, low: 2 }
    return (order[a.priority] ?? 1) - (order[b.priority] ?? 1)
  })

  const displayed = limit ? sorted.slice(0, limit) : sorted

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    )
  }

  if (displayed.length === 0) {
    return (
      <div className="text-center py-8 text-white/30 text-sm">
        Nenhuma tarefa {filter === "pending" ? "pendente" : filter === "completed" ? "concluída" : ""}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {displayed.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}
