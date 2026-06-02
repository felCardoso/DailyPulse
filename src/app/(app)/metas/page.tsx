"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { GoalList } from "@/components/Goals/GoalList"
import { GoalForm } from "@/components/Goals/GoalForm"

export default function MetasPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="py-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Metas da Semana</h1>
          <p className="text-sm text-white/40">
            Semana de {getWeekRange()}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-9 h-9 rounded-xl bg-violet-500 hover:bg-violet-600 flex items-center justify-center transition-colors"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
        </button>
      </div>

      {showForm && (
        <div className="p-4 rounded-xl border border-white/10 bg-white/3">
          <GoalForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      <GoalList />
    </div>
  )
}

function getWeekRange(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(new Date().setDate(diff))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return `${monday.toLocaleDateString("pt-BR", { day: "numeric", month: "short" })} – ${sunday.toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}`
}
