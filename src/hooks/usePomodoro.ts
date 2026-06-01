"use client"

import { useEffect, useRef } from "react"
import { useAppStore } from "@/store/app-store"

export function usePomodoro() {
  const {
    pomodoro,
    setPomodoroRunning,
    setPomodoroTimeLeft,
    setPomodoroMode,
    incrementPomodoroSessions,
    resetPomodoro,
  } = useAppStore()

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (pomodoro.isRunning) {
      intervalRef.current = setInterval(() => {
        const current = useAppStore.getState().pomodoro
        if (current.timeLeft <= 1) {
          clearInterval(intervalRef.current!)
          if (current.mode === "work") {
            const sessions = current.sessions + 1
            incrementPomodoroSessions()
            const nextMode = sessions % 4 === 0 ? "longBreak" : "break"
            setPomodoroMode(nextMode)
          } else {
            setPomodoroMode("work")
          }
          setPomodoroRunning(false)
        } else {
          setPomodoroTimeLeft(current.timeLeft - 1)
        }
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [pomodoro.isRunning]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => setPomodoroRunning(!pomodoro.isRunning)
  const reset = () => resetPomodoro()
  const setMode = (mode: "work" | "break" | "longBreak") => {
    setPomodoroRunning(false)
    setPomodoroMode(mode)
  }

  const minutes = Math.floor(pomodoro.timeLeft / 60)
  const seconds = pomodoro.timeLeft % 60
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`

  const totalTime = pomodoro.mode === "work" ? 25 * 60 : pomodoro.mode === "break" ? 5 * 60 : 15 * 60
  const progress = ((totalTime - pomodoro.timeLeft) / totalTime) * 100

  return { pomodoro, toggle, reset, setMode, formatted, progress }
}
