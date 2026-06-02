import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { v4 as uuid } from "uuid"

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId")
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 })

  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: [{ completed: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
  })
  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { userId, title, description, priority, dueDate } = body
  if (!userId || !title) return NextResponse.json({ error: "userId, title required" }, { status: 400 })

  let user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    user = await prisma.user.create({
      data: { id: userId, email: body.email ?? `${userId}@local`, name: body.name },
    })
  }

  const task = await prisma.task.create({
    data: {
      id: uuid(),
      userId,
      title,
      description,
      priority: priority ?? "medium",
      dueDate: dueDate ? new Date(dueDate) : null,
      syncStatus: "synced",
    },
  })
  return NextResponse.json(task, { status: 201 })
}
