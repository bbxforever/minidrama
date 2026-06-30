import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function DELETE(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = parseInt(req.nextUrl.searchParams.get('id') ?? '')
  if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  await prisma.drama.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
