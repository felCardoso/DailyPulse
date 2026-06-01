"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { HabitList } from "@/components/Habits/HabitList"

export default function HabitosPage() {
  return (
    <div className="py-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hábitos</h1>
        <Link
          href="/habitos/new"
          className="w-9 h-9 rounded-xl bg-violet-500 hover:bg-violet-600 flex items-center justify-center transition-colors"
        >
          <Plus size={18} />
        </Link>
      </div>

      <p className="text-sm text-white/40">
        {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
      </p>

      <HabitList />
    </div>
  )
}
