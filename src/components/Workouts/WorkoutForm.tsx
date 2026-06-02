"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCreateWorkout } from "@/hooks/useWorkout"
import type { ExerciseFormData } from "@/types"

type BlockInput = ExerciseFormData & { _key: string }

function mkBlock(): BlockInput {
  return { _key: crypto.randomUUID(), name: "", sets: 4, reps: 12, weight: undefined }
}

export default function WorkoutForm() {
  const router = useRouter()
  const createMutation = useCreateWorkout()

  const [workoutName, setWorkoutName] = useState("")
  const [blocks, setBlocks] = useState<BlockInput[]>([mkBlock()])
  const [error, setError] = useState<string | null>(null)

  function addBlock() {
    setBlocks((bs) => [...bs, mkBlock()])
  }

  function removeBlock(key: string) {
    setBlocks((bs) => bs.filter((b) => b._key !== key))
  }

  function patchBlock(key: string, patch: Partial<ExerciseFormData>) {
    setBlocks((bs) => bs.map((b) => (b._key === key ? { ...b, ...patch } : b)))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!workoutName.trim()) return
    setError(null)
    try {
      const exercises = blocks
        .filter((b) => b.name.trim())
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(({ _key, ...ex }) => ex)

      const workout = await createMutation.mutateAsync({ name: workoutName.trim(), exercises })
      router.push(`/treinos/${workout.id}`)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const canSubmit = workoutName.trim().length > 0 && !createMutation.isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-8">
      {/* Workout name */}
      <input
        required
        placeholder="Nome do treino *"
        value={workoutName}
        onChange={(e) => setWorkoutName(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-base font-semibold outline-none focus:border-violet-500/50 placeholder:text-white/25"
        autoFocus
      />

      {/* Exercise blocks */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-white/35 uppercase tracking-wider px-1">
          Exercícios
        </p>

        {blocks.map((block, i) => (
          <ExerciseBlock
            key={block._key}
            index={i}
            block={block}
            canRemove={blocks.length > 1}
            onChange={(patch) => patchBlock(block._key, patch)}
            onRemove={() => removeBlock(block._key)}
          />
        ))}

        <button
          type="button"
          onClick={addBlock}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-dashed border-white/12 text-white/35 active:border-violet-500/40 active:text-violet-400 transition-colors text-sm"
        >
          <Plus size={15} />
          Adicionar exercício
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 rounded-xl px-4 py-3">{error}</p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="py-3.5 px-5 rounded-xl text-sm text-white/40 bg-white/4 active:bg-white/8 flex-shrink-0"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex-1 py-3.5 rounded-xl text-sm font-semibold text-white bg-violet-600 active:bg-violet-700 disabled:opacity-40 transition-opacity"
        >
          {createMutation.isPending
            ? "Criando…"
            : blocks.filter((b) => b.name.trim()).length > 0
            ? `Iniciar treino · ${blocks.filter((b) => b.name.trim()).length} exercício${blocks.filter((b) => b.name.trim()).length > 1 ? "s" : ""}`
            : "Iniciar treino"}
        </button>
      </div>
    </form>
  )
}

function ExerciseBlock({
  index,
  block,
  canRemove,
  onChange,
  onRemove,
}: {
  index: number
  block: BlockInput
  canRemove: boolean
  onChange: (patch: Partial<ExerciseFormData>) => void
  onRemove: () => void
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden">
      {/* Name row */}
      <div className="flex items-center gap-3 px-4 pt-3.5 pb-2">
        <span className="w-6 h-6 rounded-lg bg-violet-500/20 text-violet-400 text-[11px] font-bold flex items-center justify-center flex-shrink-0 tabular-nums">
          {index + 1}
        </span>
        <input
          placeholder="Nome do exercício"
          value={block.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-white/20 min-w-0"
        />
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="w-7 h-7 flex items-center justify-center text-white/20 active:text-red-400 transition-colors flex-shrink-0"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Sets / Reps / Weight */}
      <div className="grid grid-cols-3 divide-x divide-white/6 border-t border-white/6">
        <StatInput
          label="Séries"
          value={block.sets}
          min={1}
          max={20}
          onChange={(v) => onChange({ sets: v })}
        />
        <StatInput
          label="Reps"
          value={block.reps}
          min={1}
          max={100}
          onChange={(v) => onChange({ reps: v })}
        />
        <WeightInput value={block.weight} onChange={(v) => onChange({ weight: v })} />
      </div>
    </div>
  )
}

function StatInput({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value?: number
  min: number
  max: number
  onChange: (v: number) => void
}) {
  const val = value ?? min

  function decrement() {
    if (val > min) onChange(val - 1)
  }
  function increment() {
    if (val < max) onChange(val + 1)
  }

  return (
    <div className="flex flex-col items-center py-3 gap-1.5">
      <p className="text-[10px] text-white/30 uppercase tracking-wider">{label}</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={decrement}
          className={cn(
            "w-7 h-7 rounded-lg text-lg font-light flex items-center justify-center transition-colors",
            val <= min ? "text-white/15" : "text-white/40 active:text-white active:bg-white/10"
          )}
        >
          −
        </button>
        <span className="text-sm font-bold tabular-nums w-5 text-center">{val}</span>
        <button
          type="button"
          onClick={increment}
          className={cn(
            "w-7 h-7 rounded-lg text-lg font-light flex items-center justify-center transition-colors",
            val >= max ? "text-white/15" : "text-white/40 active:text-white active:bg-white/10"
          )}
        >
          +
        </button>
      </div>
    </div>
  )
}

function WeightInput({
  value,
  onChange,
}: {
  value?: number
  onChange: (v?: number) => void
}) {
  return (
    <div className="flex flex-col items-center py-3 gap-1.5">
      <p className="text-[10px] text-white/30 uppercase tracking-wider">Peso (kg)</p>
      <input
        type="number"
        min={0}
        step={0.5}
        inputMode="decimal"
        placeholder="—"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
        className="w-16 bg-transparent text-sm font-bold text-center outline-none placeholder:text-white/20 tabular-nums"
      />
    </div>
  )
}
