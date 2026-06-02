import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const { targetDays, ...rest } = body
  const habit = await prisma.habit.update({
    where: { id: params.id },
    data: {
      ...rest,
      ...(targetDays !== undefined ? { targetDays: JSON.stringify(targetDays) } : {}),
      updatedAt: new Date(),
    },
    include: { logs: { orderBy: { date: "desc" }, take: 30 } },
  })
  return NextResponse.json(habit)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.habit.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
