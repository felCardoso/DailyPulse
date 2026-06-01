import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { v4 as uuid } from "uuid"

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId")
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 })

  const habits = await prisma.habit.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: { logs: { orderBy: { date: "desc" }, take: 30 } },
  })
  return NextResponse.json(habits)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { userId, name, description, color, icon, frequency, targetDays } = body
  if (!userId || !name) return NextResponse.json({ error: "userId, name required" }, { status: 400 })

  let user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    user = await prisma.user.create({
      data: { id: userId, email: body.email ?? `${userId}@local`, name: body.name },
    })
  }

  const habit = await prisma.habit.create({
    data: {
      id: uuid(),
      userId,
      name,
      description,
      color: color ?? "#8b5cf6",
      icon,
      frequency: frequency ?? "daily",
      targetDays: JSON.stringify(targetDays ?? []),
    },
    include: { logs: true },
  })
  return NextResponse.json(habit, { status: 201 })
}
