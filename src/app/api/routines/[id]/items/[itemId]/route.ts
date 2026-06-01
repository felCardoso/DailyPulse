import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  const body = await req.json()
  const item = await prisma.routineItem.update({
    where: { id: params.itemId },
    data: { ...body, updatedAt: new Date() },
  })
  return NextResponse.json(item)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  await prisma.routineItem.delete({ where: { id: params.itemId } })
  return NextResponse.json({ ok: true })
}
