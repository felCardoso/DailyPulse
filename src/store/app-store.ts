import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  User, Routine, Workout, Meal,
  Task, Habit, HabitLog, Note, Goal,
  PomodoroState, PomodoroMode,
} from "@/types"

const DEFAULT_POMODORO: PomodoroState = {
  isRunning: false,
  mode: "work",
  timeLeft: 25 * 60,
  sessions: 0,
}

interface AppState {
  user: User | null
  routines: Routine[]
  workouts: Workout[]
  meals: Meal[]
  tasks: Task[]
  habits: Habit[]
  habitLogs: HabitLog[]
  notes: Note[]
  goals: Goal[]
  isOnline: boolean
  isSyncing: boolean
  pendingCount: number
  selectedRoutine: Routine | null
  selectedWorkout: Workout | null
  pomodoro: PomodoroState

  setUser: (user: User | null) => void

  setRoutines: (routines: Routine[]) => void
  addRoutine: (routine: Routine) => void
  updateRoutine: (id: string, data: Partial<Routine>) => void
  removeRoutine: (id: string) => void

  setWorkouts: (workouts: Workout[]) => void
  addWorkout: (workout: Workout) => void
  updateWorkout: (id: string, data: Partial<Workout>) => void
  removeWorkout: (id: string) => void

  setMeals: (meals: Meal[]) => void
  addMeal: (meal: Meal) => void
  updateMeal: (id: string, data: Partial<Meal>) => void
  removeMeal: (id: string) => void

  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, data: Partial<Task>) => void
  removeTask: (id: string) => void

  setHabits: (habits: Habit[]) => void
  addHabit: (habit: Habit) => void
  updateHabit: (id: string, data: Partial<Habit>) => void
  removeHabit: (id: string) => void
  setHabitLogs: (logs: HabitLog[]) => void
  upsertHabitLog: (log: HabitLog) => void
  removeHabitLog: (habitId: string, date: string) => void

  setNotes: (notes: Note[]) => void
  addNote: (note: Note) => void
  updateNote: (id: string, data: Partial<Note>) => void
  removeNote: (id: string) => void

  setGoals: (goals: Goal[]) => void
  addGoal: (goal: Goal) => void
  updateGoal: (id: string, data: Partial<Goal>) => void
  removeGoal: (id: string) => void

  setOnline: (online: boolean) => void
  setSyncing: (syncing: boolean) => void
  setPendingCount: (count: number) => void
  setSelectedRoutine: (routine: Routine | null) => void
  setSelectedWorkout: (workout: Workout | null) => void

  setPomodoroMode: (mode: PomodoroMode) => void
  setPomodoroRunning: (running: boolean) => void
  setPomodoroTimeLeft: (seconds: number) => void
  incrementPomodoroSessions: () => void
  resetPomodoro: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      routines: [],
      workouts: [],
      meals: [],
      tasks: [],
      habits: [],
      habitLogs: [],
      notes: [],
      goals: [],
      isOnline: true,
      isSyncing: false,
      pendingCount: 0,
      selectedRoutine: null,
      selectedWorkout: null,
      pomodoro: DEFAULT_POMODORO,

      setUser: (user) => set({ user }),

      setRoutines: (routines) => set({ routines }),
      addRoutine: (routine) => set((s) => ({ routines: [routine, ...s.routines] })),
      updateRoutine: (id, data) =>
        set((s) => ({ routines: s.routines.map((r) => (r.id === id ? { ...r, ...data } : r)) })),
      removeRoutine: (id) => set((s) => ({ routines: s.routines.filter((r) => r.id !== id) })),

      setWorkouts: (workouts) => set({ workouts }),
      addWorkout: (workout) => set((s) => ({ workouts: [workout, ...s.workouts] })),
      updateWorkout: (id, data) =>
        set((s) => ({ workouts: s.workouts.map((w) => (w.id === id ? { ...w, ...data } : w)) })),
      removeWorkout: (id) => set((s) => ({ workouts: s.workouts.filter((w) => w.id !== id) })),

      setMeals: (meals) => set({ meals }),
      addMeal: (meal) => set((s) => ({ meals: [meal, ...s.meals] })),
      updateMeal: (id, data) =>
        set((s) => ({ meals: s.meals.map((m) => (m.id === id ? { ...m, ...data } : m)) })),
      removeMeal: (id) => set((s) => ({ meals: s.meals.filter((m) => m.id !== id) })),

      setTasks: (tasks) => set({ tasks }),
      addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),
      updateTask: (id, data) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)) })),
      removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      setHabits: (habits) => set({ habits }),
      addHabit: (habit) => set((s) => ({ habits: [habit, ...s.habits] })),
      updateHabit: (id, data) =>
        set((s) => ({ habits: s.habits.map((h) => (h.id === id ? { ...h, ...data } : h)) })),
      removeHabit: (id) => set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),
      setHabitLogs: (habitLogs) => set({ habitLogs }),
      upsertHabitLog: (log) =>
        set((s) => {
          const exists = s.habitLogs.find((l) => l.habitId === log.habitId && l.date === log.date)
          return {
            habitLogs: exists
              ? s.habitLogs.map((l) => (l.habitId === log.habitId && l.date === log.date ? log : l))
              : [...s.habitLogs, log],
          }
        }),
      removeHabitLog: (habitId, date) =>
        set((s) => ({
          habitLogs: s.habitLogs.filter((l) => !(l.habitId === habitId && l.date === date)),
        })),

      setNotes: (notes) => set({ notes }),
      addNote: (note) => set((s) => ({ notes: [note, ...s.notes] })),
      updateNote: (id, data) =>
        set((s) => ({ notes: s.notes.map((n) => (n.id === id ? { ...n, ...data } : n)) })),
      removeNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      setGoals: (goals) => set({ goals }),
      addGoal: (goal) => set((s) => ({ goals: [goal, ...s.goals] })),
      updateGoal: (id, data) =>
        set((s) => ({ goals: s.goals.map((g) => (g.id === id ? { ...g, ...data } : g)) })),
      removeGoal: (id) => set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      setOnline: (isOnline) => set({ isOnline }),
      setSyncing: (isSyncing) => set({ isSyncing }),
      setPendingCount: (pendingCount) => set({ pendingCount }),
      setSelectedRoutine: (selectedRoutine) => set({ selectedRoutine }),
      setSelectedWorkout: (selectedWorkout) => set({ selectedWorkout }),

      setPomodoroMode: (mode) =>
        set((s) => ({ pomodoro: { ...s.pomodoro, mode, timeLeft: mode === "work" ? 25 * 60 : mode === "break" ? 5 * 60 : 15 * 60 } })),
      setPomodoroRunning: (isRunning) =>
        set((s) => ({ pomodoro: { ...s.pomodoro, isRunning } })),
      setPomodoroTimeLeft: (timeLeft) =>
        set((s) => ({ pomodoro: { ...s.pomodoro, timeLeft } })),
      incrementPomodoroSessions: () =>
        set((s) => ({ pomodoro: { ...s.pomodoro, sessions: s.pomodoro.sessions + 1 } })),
      resetPomodoro: () => set({ pomodoro: DEFAULT_POMODORO }),
    }),
    {
      name: "dailypulse-store",
      partialize: (s) => ({
        routines: s.routines,
        workouts: s.workouts,
        meals: s.meals,
        tasks: s.tasks,
        habits: s.habits,
        habitLogs: s.habitLogs,
        notes: s.notes,
        goals: s.goals,
        pomodoro: s.pomodoro,
      }),
    }
  )
)
