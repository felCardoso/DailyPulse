"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateHabit } from "@/hooks/useHabit"
import type { HabitFrequency } from "@/types"

const COLORS = ["#8b5cf6", "#ec4899", "#f97316", "#22c55e", "#3b82f6", "#eab308", "#14b8a6"]

export function HabitForm() {
  const router = useRouter()
  const createHabit = useCreateHabit()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState("#8b5cf6")
  const [frequency, setFrequency] = useState<HabitFrequency>("daily")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    createHabit.mutate(
      { name: name.trim(), description: description.trim() || undefined, color, frequency },
      { onSuccess: () => router.push("/habitos") }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-white/60 mb-1">Nome *</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Meditação"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-1">Descrição</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Opcional..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500/50 placeholder:text-white/20"
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Cor</label>
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className="w-8 h-8 rounded-full border-2 transition-all"
              style={{
                backgroundColor: c,
                borderColor: color === c ? "white" : "transparent",
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-2">Frequência</label>
        <div className="grid grid-cols-3 gap-2">
          {([
            ["daily", "Diário"],
            ["weekdays", "Dias úteis"],
            ["weekend", "Fins de semana"],
          ] as [HabitFrequency, string][]).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFrequency(value)}
              className={`py-2 rounded-xl text-xs border transition-all ${
                frequency === value
                  ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                  : "bg-white/3 border-white/10 text-white/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!name.trim() || createHabit.isPending}
        className="w-full bg-violet-500 hover:bg-violet-600 disabled:opacity-40 text-white font-medium py-3 rounded-xl transition-colors"
      >
        {createHabit.isPending ? "Criando..." : "Criar Hábito"}
      </button>
    </form>
  )
}
