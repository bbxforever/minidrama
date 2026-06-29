interface Props {
  title: string
  category: string
  coverUrl?: string | null
  className?: string
}

const GRADIENTS: Record<string, string> = {
  romance:    'linear-gradient(160deg, #f43f5e 0%, #fb7185 100%)',
  historical: 'linear-gradient(160deg, #92400e 0%, #d97706 100%)',
  modern:     'linear-gradient(160deg, #7c3aed 0%, #a78bfa 100%)',
  suspense:   'linear-gradient(160deg, #1e3a5f 0%, #2563eb 100%)',
}

const CATEGORY_ZH: Record<string, string> = {
  romance: '爱情', historical: '古装', modern: '都市', suspense: '悬疑',
}

export default function CoverImage({ title, category, coverUrl, className = '' }: Props) {
  const bg = GRADIENTS[category] ?? GRADIENTS.romance
  const catLabel = CATEGORY_ZH[category] ?? category

  return (
    <div
      className={`w-full h-full relative overflow-hidden flex flex-col justify-end ${className}`}
      style={coverUrl ? undefined : { background: bg }}
    >
      {/* 真实封面图 */}
      {coverUrl && (
        <>
          <img
            src={coverUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* 渐变遮罩，让文字可读 */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)'
          }} />
        </>
      )}

      {/* 无封面时的装饰 */}
      {!coverUrl && (
        <>
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute top-20 -left-6 w-24 h-24 rounded-full bg-white/8" />
          <div className="absolute inset-0 flex items-center justify-center" style={{ top: '-20%' }}>
            <span style={{ fontSize: '3.5rem' }}>🎬</span>
          </div>
        </>
      )}

      {/* 底部信息 */}
      <div className="relative z-10 px-3 pb-3 pt-8">
        <span className="inline-block text-white/90 text-xs bg-white/20 px-2 py-0.5 rounded-full mb-1.5 backdrop-blur-sm">
          {catLabel}
        </span>
        <p className="text-white font-bold leading-tight" style={{
          fontSize: title.length > 7 ? '0.95rem' : title.length > 5 ? '1.1rem' : '1.25rem',
          textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          wordBreak: 'break-all',
        }}>
          {title}
        </p>
        <p className="text-white/50 text-xs mt-1">MiniDrama</p>
      </div>
    </div>
  )
}
