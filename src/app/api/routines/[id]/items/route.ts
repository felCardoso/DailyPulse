import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { v4 as uuid } from "uuid"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const items = await prisma.routineItem.findMany({
    where: { routineId: params.id },
    orderBy: { order: "asc" },
  })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const { title } = body
  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 })

  const count = await prisma.routineItem.count({ where: { routineId: params.id } })
  const item = await prisma.routineItem.create({
    data: { id: uuid(), routineId: params.id, title, order: count },
  })
  return NextResponse.json(item, { status: 201 })
}
