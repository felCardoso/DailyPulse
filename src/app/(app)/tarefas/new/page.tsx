"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { TaskForm } from "@/components/Tasks/TaskForm"

export default function NewTaskPage() {
  return (
    <div className="py-6 space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/tarefas" className="text-white/50 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold">Nova Tarefa</h1>
      </div>
      <TaskForm />
    </div>
  )
}
