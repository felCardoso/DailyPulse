import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { v4 as uuid } from "uuid"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const { date, completed } = body
  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 })

  if (completed === false) {
    await prisma.habitLog.deleteMany({ where: { habitId: params.id, date } })
    return NextResponse.json({ ok: true })
  }

  const log = await prisma.habitLog.upsert({
    where: { habitId_date: { habitId: params.id, date } },
    create: { id: uuid(), habitId: params.id, date, completed: true },
    update: { completed: true },
  })
  return NextResponse.json(log, { status: 201 })
}
