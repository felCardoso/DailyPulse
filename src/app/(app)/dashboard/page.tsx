"use client"

import Link from "next/link"
import { CheckSquare, Repeat2, CalendarCheck, Dumbbell, Salad, Timer, ChevronRight } from "lucide-react"
import { useRoutines } from "@/hooks/useRoutine"
import { useWorkouts } from "@/hooks/useWorkout"
import { useMeals } from "@/hooks/useDiet"
import { useTasks } from "@/hooks/useTask"
import { useHabits } from "@/hooks/useHabit"
import { useGoals } from "@/hooks/useGoal"
import { useAppStore } from "@/store/app-store"
import { getTodayDayOfWeek, isToday } from "@/utils/date"
import { sum } from "@/utils/numbers"

export default function DashboardPage() {
  const { user } = useAppStore()
  const today = getTodayDayOfWeek()
  const todayStr = new Date().toISOString().split("T")[0]

  const { data: routines = [] } = useRoutines()
  const { data: workouts = [] } = useWorkouts()
  const { data: meals = [] } = useMeals()
  const { data: tasks = [] } = useTasks()
  const { data: habits = [] } = useHabits()
  const { data: goals = [] } = useGoals()
  const { habitLogs } = useAppStore()

  const todayRoutines = routines.filter((r) => r.day === today)
  const completedRoutines = todayRoutines.filter((r) => r.completed)
  const todayWorkouts = workouts.filter((w) => isToday(w.date))
  const todayMeals = meals.filter((m) => isToday(m.date))
  const totalCal = sum(todayMeals.map((m) => m.calories))

  const pendingTasks = tasks.filter((t) => !t.completed).slice(0, 3)
  const todayHabits = habits.filter((h) => {
    if (h.frequency === "weekdays") return ["monday","tuesday","wednesday","thursday","friday"].includes(today)
    if (h.frequency === "weekend") return ["saturday","sunday"].includes(today)
    return true
  })
  const doneHabits = todayHabits.filter((h) =>
    habitLogs.some((l) => l.habitId === h.id && l.date === todayStr && l.completed)
  )

  const topGoal = goals.find((g) => !g.completed) ?? goals[0]

  return (
    <div className="py-6 space-y-6">
      <div>
        <p className="text-white/40 text-sm">Bem-vindo de volta,</p>
        <h1 className="text-2xl font-bold">{user?.name ?? user?.email?.split("@")[0] ?? "Usuário"}</h1>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={<CalendarCheck size={18} className="text-violet-400" />} value={`${completedRoutines.length}/${todayRoutines.length}`} label="Rotinas" />
        <StatCard icon={<Dumbbell size={18} className="text-blue-400" />} value={todayWorkouts.length} label="Treinos" />
        <StatCard icon={<Salad size={18} className="text-emerald-400" />} value={`${Math.round(totalCal)}`} label="kcal" />
      </div>

      {/* Productivity stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={<CheckSquare size={18} className="text-yellow-400" />} value={pendingTasks.length} label="Pendentes" />
        <StatCard icon={<Repeat2 size={18} className="text-pink-400" />} value={`${doneHabits.length}/${todayHabits.length}`} label="Hábitos" />
        <Link href="/pomodoro">
          <StatCard icon={<Timer size={18} className="text-orange-400" />} value="Focus" label="Pomodoro" clickable />
        </Link>
      </div>

      {/* Pending tasks preview */}
      {pendingTasks.length > 0 && (
        <Section title="Tarefas pendentes" href="/tarefas">
          <div className="space-y-2">
            {pendingTasks.map((t) => (
              <div key={t.id} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                <span className="truncate">{t.title}</span>
                <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full ${t.priority === "high" ? "bg-red-500/20 text-red-400" : t.priority === "medium" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}>
                  {t.priority === "high" ? "Alta" : t.priority === "medium" ? "Média" : "Baixa"}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Today's habits */}
      {todayHabits.length > 0 && (
        <Section title="Hábitos de hoje" href="/habitos">
          <div className="space-y-2">
            {todayHabits.slice(0, 3).map((h) => {
              const done = habitLogs.some((l) => l.habitId === h.id && l.date === todayStr && l.completed)
              return (
                <div key={h.id} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: h.color }} />
                  <span className={done ? "line-through text-white/40" : ""}>{h.name}</span>
                  {done && <span className="ml-auto text-[10px] text-green-400">✓</span>}
                </div>
              )
            })}
          </div>
        </Section>
      )}

      {/* Top weekly goal */}
      {topGoal && (
        <Section title="Meta da semana" href="/metas">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="truncate">{topGoal.title}</span>
              <span className="text-white/40 ml-2 flex-shrink-0">
                {topGoal.currentValue}/{topGoal.targetValue}{topGoal.unit ? ` ${topGoal.unit}` : ""}
              </span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-500 transition-all"
                style={{ width: `${Math.min((topGoal.currentValue / topGoal.targetValue) * 100, 100)}%` }}
              />
            </div>
          </div>
        </Section>
      )}
    </div>
  )
}

function StatCard({ icon, value, label, clickable }: { icon: React.ReactNode; value: string | number; label: string; clickable?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border bg-white/5 border-white/10 text-center space-y-1 ${clickable ? "hover:bg-white/8 transition-colors" : ""}`}>
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-[11px] text-white/40 leading-tight">{label}</p>
    </div>
  )
}

function Section({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider">{title}</h2>
        <Link href={href} className="text-[11px] text-violet-400 flex items-center gap-0.5">
          Ver tudo <ChevronRight size={12} />
        </Link>
      </div>
      <div className="p-4 rounded-xl border bg-white/3 border-white/8">{children}</div>
    </div>
  )
}
