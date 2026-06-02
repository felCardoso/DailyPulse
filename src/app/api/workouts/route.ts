import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { v4 as uuid } from "uuid"
import type { ExerciseFormData } from "@/types"

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId")
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 })

  try {
    const workouts = await prisma.workout.findMany({
      where: { userId },
      include: { exercises: { orderBy: { order: "asc" } } },
      orderBy: { date: "desc" },
    })
    return NextResponse.json(workouts)
  } catch (err) {
    console.error("GET /api/workouts:", err)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { userId, name, description, date, exercises = [] } = body
  if (!userId || !name) return NextResponse.json({ error: "userId and name required" }, { status: 400 })

  try {
    let user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      user = await prisma.user.create({
        data: { id: userId, email: body.email ?? `${userId}@local` },
      })
    }

    const workoutId = uuid()

    const workout = await prisma.$transaction(async (tx) => {
      await tx.workout.create({
        data: {
          id: workoutId,
          userId,
          name,
          description: description || null,
          date: date ? new Date(date) : new Date(),
          syncStatus: "synced",
        },
      })

      if (exercises.length > 0) {
        await tx.exercise.createMany({
          data: (exercises as ExerciseFormData[]).map((ex, i) => ({
            id: uuid(),
            workoutId,
            name: ex.name,
            sets: ex.sets ?? null,
            reps: ex.reps ?? null,
            weight: ex.weight ?? null,
            setsLog: ex.sets
              ? JSON.stringify(
                  Array.from({ length: ex.sets }, () => ({
                    weight: ex.weight ?? 0,
                    reps: ex.reps ?? 0,
                    done: false,
                  }))
                )
              : "[]",
            order: i,
          })),
        })
      }

      return tx.workout.findUnique({
        where: { id: workoutId },
        include: { exercises: { orderBy: { order: "asc" } } },
      })
    })

    return NextResponse.json(workout, { status: 201 })
  } catch (err) {
    console.error("POST /api/workouts:", err)
    return NextResponse.json({ error: "Database error — check DATABASE_URL and migrations" }, { status: 500 })
  }
}
