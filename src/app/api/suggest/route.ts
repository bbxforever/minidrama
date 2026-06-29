import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 1) return NextResponse.json([])

  const dramas = await prisma.drama.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { titleEn: { contains: q, mode: 'insensitive' } },
      ],
    },
    select: { id: true, title: true, category: true },
    take: 6,
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(dramas)
}
