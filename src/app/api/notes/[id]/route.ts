import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const note = await prisma.note.update({
    where: { id: params.id },
    data: { ...body, updatedAt: new Date() },
  })
  return NextResponse.json(note)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.note.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
