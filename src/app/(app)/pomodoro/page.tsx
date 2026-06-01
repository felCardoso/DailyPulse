"use client"

import { PomodoroTimer } from "@/components/Pomodoro/PomodoroTimer"

export default function PomodoroPage() {
  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-8 text-center">Pomodoro</h1>
      <PomodoroTimer />
    </div>
  )
}
