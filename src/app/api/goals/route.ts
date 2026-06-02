import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { v4 as uuid } from "uuid"

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId")
  const weekStart = req.nextUrl.searchParams.get("weekStart")
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 })

  const goals = await prisma.goal.findMany({
    where: { userId, ...(weekStart ? { weekStart } : {}) },
    orderBy: { createdAt: "asc" },
  })
  return NextResponse.json(goals)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { userId, title, targetValue, unit, weekStart } = body
  if (!userId || !title || targetValue == null)
    return NextResponse.json({ error: "userId, title, targetValue required" }, { status: 400 })

  let user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    user = await prisma.user.create({
      data: { id: userId, email: body.email ?? `${userId}@local`, name: body.name },
    })
  }

  const goal = await prisma.goal.create({
    data: {
      id: uuid(),
      userId,
      title,
      targetValue,
      currentValue: 0,
      unit,
      weekStart: weekStart ?? getWeekStart(),
    },
  })
  return NextResponse.json(goal, { status: 201 })
}

function getWeekStart(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  return monday.toISOString().split("T")[0]
}
