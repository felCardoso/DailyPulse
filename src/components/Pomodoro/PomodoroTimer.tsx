"use client"

import { Play, Pause, RotateCcw } from "lucide-react"
import { usePomodoro } from "@/hooks/usePomodoro"
import { cn } from "@/lib/utils"

const modeLabels: Record<string, string> = {
  work: "Foco",
  break: "Pausa",
  longBreak: "Pausa longa",
}

export function PomodoroTimer() {
  const { pomodoro, toggle, reset, setMode, formatted, progress } = usePomodoro()

  const radius = 90
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-2">
        {(["work", "break", "longBreak"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-medium transition-all",
              pomodoro.mode === m
                ? "bg-violet-500 text-white"
                : "bg-white/5 text-white/50 hover:text-white/80"
            )}
          >
            {modeLabels[m]}
          </button>
        ))}
      </div>

      <div className="relative w-56 h-56">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-mono font-bold tabular-nums">{formatted}</span>
          <span className="text-sm text-white/40 mt-1">{modeLabels[pomodoro.mode]}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={reset}
          className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
        >
          <RotateCcw size={18} className="text-white/50" />
        </button>
        <button
          onClick={toggle}
          className="w-16 h-16 rounded-full bg-violet-500 hover:bg-violet-600 flex items-center justify-center transition-all shadow-lg shadow-violet-500/20"
        >
          {pomodoro.isRunning ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
          <span className="text-sm font-mono text-white/50">{pomodoro.sessions}</span>
        </div>
      </div>

      <p className="text-xs text-white/30">
        {pomodoro.sessions === 0
          ? "Nenhuma sessão hoje"
          : `${pomodoro.sessions} sessão${pomodoro.sessions > 1 ? "ões" : ""} completa${pomodoro.sessions > 1 ? "s" : ""}`}
      </p>
    </div>
  )
}
