import { ImageResponse } from 'next/og'
import { prisma } from '@/lib/db'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const runtime = 'nodejs'

let fontCache: ArrayBuffer | null = null
async function loadFont(): Promise<ArrayBuffer> {
  if (fontCache) return fontCache
  // public/ 目录在 Vercel 上通过 process.cwd() + /public 访问
  const fontPath = join(process.cwd(), 'public', 'fonts', 'NotoSansSC-Bold.ttf')
  const buf = await readFile(fontPath)
  fontCache = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
  return fontCache
}

const GRADIENTS: Record<string, [string, string]> = {
  romance:   ['#f43f5e', '#fb7185'],
  historical:['#92400e', '#d97706'],
  modern:    ['#7c3aed', '#a78bfa'],
  suspense:  ['#1e3a5f', '#2563eb'],
}

const CATEGORY_ZH: Record<string, string> = {
  romance: '爱情', historical: '古装', modern: '都市', suspense: '悬疑',
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const drama = await prisma.drama.findUnique({
    where: { id: parseInt(id) },
    select: { title: true, category: true, status: true },
  })

  const title = drama?.title ?? 'MiniDrama'
  const category = drama?.category ?? 'romance'
  const [from, to] = GRADIENTS[category] ?? GRADIENTS.romance
  const catLabel = CATEGORY_ZH[category] ?? category
  const fontData = await loadFont()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          background: `linear-gradient(160deg, ${from} 0%, ${to} 100%)`,
          padding: '0',
          position: 'relative',
          fontFamily: 'NotoSansSC',
        }}
      >
        {/* 装饰圆 */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '280px', height: '280px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', top: '80px', left: '-40px',
          width: '160px', height: '160px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
          display: 'flex',
        }} />

        {/* 大图标 */}
        <div style={{
          position: 'absolute', top: '50px',
          fontSize: '100px',
          display: 'flex',
        }}>
          🎬
        </div>

        {/* 底部信息区 */}
        <div style={{
          width: '100%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
          padding: '40px 28px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          {/* 分类标签 */}
          <div style={{
            background: 'rgba(255,255,255,0.25)',
            color: 'white',
            fontSize: '20px',
            fontWeight: '600',
            padding: '4px 14px',
            borderRadius: '999px',
            width: 'fit-content',
            display: 'flex',
          }}>
            {catLabel}
          </div>

          {/* 标题 */}
          <div style={{
            color: 'white',
            fontSize: title.length > 6 ? '38px' : '46px',
            fontWeight: '800',
            lineHeight: '1.25',
            textShadow: '0 2px 8px rgba(0,0,0,0.4)',
            display: 'flex',
            flexWrap: 'wrap',
          }}>
            {title}
          </div>

          {/* 品牌 */}
          <div style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '18px',
            display: 'flex',
          }}>
            MiniDrama
          </div>
        </div>
      </div>
    ),
    {
      width: 360,
      height: 640,
      fonts: [{ name: 'NotoSansSC', data: fontData, weight: 700 }],
    }
  )
}
