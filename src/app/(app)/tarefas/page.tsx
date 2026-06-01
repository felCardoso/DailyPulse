"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { TaskList } from "@/components/Tasks/TaskList"

type Filter = "all" | "pending" | "completed"

export default function TarefasPage() {
  const [filter, setFilter] = useState<Filter>("pending")

  return (
    <div className="py-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tarefas</h1>
        <Link
          href="/tarefas/new"
          className="w-9 h-9 rounded-xl bg-violet-500 hover:bg-violet-600 flex items-center justify-center transition-colors"
        >
          <Plus size={18} />
        </Link>
      </div>

      <div className="flex gap-2">
        {(["pending", "all", "completed"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === f
                ? "bg-violet-500 text-white"
                : "bg-white/5 text-white/50 hover:text-white/80"
            }`}
          >
            {f === "pending" ? "Pendentes" : f === "all" ? "Todas" : "Concluídas"}
          </button>
        ))}
      </div>

      <TaskList filter={filter} />
    </div>
  )
}
