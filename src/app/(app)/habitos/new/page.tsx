"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { HabitForm } from "@/components/Habits/HabitForm"

export default function NewHabitoPage() {
  return (
    <div className="py-6 space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/habitos" className="text-white/50 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold">Novo Hábito</h1>
      </div>
      <HabitForm />
    </div>
  )
}
