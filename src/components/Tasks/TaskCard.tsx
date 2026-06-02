"use client"

import { Trash2, Calendar } from "lucide-react"
import type { Task } from "@/types"
import { useCheckTask, useDeleteTask } from "@/hooks/useTask"
import { cn } from "@/lib/utils"

const priorityColors: Record<string, string> = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-green-500/20 text-green-400 border-green-500/30",
}

const priorityLabels: Record<string, string> = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
}

interface Props {
  task: Task
}

export function TaskCard({ task }: Props) {
  const checkTask = useCheckTask()
  const deleteTask = useDeleteTask()

  const isOverdue =
    !task.completed && task.dueDate && new Date(task.dueDate) < new Date()

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border transition-all",
        task.completed
          ? "bg-white/3 border-white/8 opacity-60"
          : "bg-white/5 border-white/10 hover:bg-white/8"
      )}
    >
      <button
        onClick={() => checkTask.mutate({ id: task.id, completed: !task.completed })}
        className={cn(
          "mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all",
          task.completed
            ? "bg-violet-500 border-violet-500"
            : "border-white/30 hover:border-violet-400"
        )}
      >
        {task.completed && (
          <svg viewBox="0 0 12 12" className="w-full h-full p-0.5 text-white">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", task.completed && "line-through text-white/40")}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-white/50 mt-0.5 truncate">{task.description}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span
            className={cn(
              "text-[10px] px-2 py-0.5 rounded-full border font-medium",
              priorityColors[task.priority]
            )}
          >
            {priorityLabels[task.priority]}
          </span>
          {task.dueDate && (
            <span className={cn("flex items-center gap-1 text-[10px]", isOverdue ? "text-red-400" : "text-white/40")}>
              <Calendar size={10} />
              {new Date(task.dueDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => deleteTask.mutate(task.id)}
        className="text-white/20 hover:text-red-400 transition-colors flex-shrink-0"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
