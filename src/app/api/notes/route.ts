import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { v4 as uuid } from "uuid"

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId")
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 })

  const notes = await prisma.note.findMany({
    where: { userId },
    orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
  })
  return NextResponse.json(notes)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { userId, title, content, pinned } = body
  if (!userId || !content) return NextResponse.json({ error: "userId, content required" }, { status: 400 })

  let user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    user = await prisma.user.create({
      data: { id: userId, email: body.email ?? `${userId}@local`, name: body.name },
    })
  }

  const note = await prisma.note.create({
    data: { id: uuid(), userId, title, content, pinned: pinned ?? false, syncStatus: "synced" },
  })
  return NextResponse.json(note, { status: 201 })
}
