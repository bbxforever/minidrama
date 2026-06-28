'use client'

interface Props {
  title: string
  category: string
  className?: string
}

const GRADIENTS: Record<string, [string, string]> = {
  romance:    ['#f43f5e', '#fb7185'],
  historical: ['#92400e', '#d97706'],
  modern:     ['#7c3aed', '#a78bfa'],
  suspense:   ['#1e3a5f', '#2563eb'],
}

const CATEGORY_ZH: Record<string, string> = {
  romance: '爱情', historical: '古装', modern: '都市', suspense: '悬疑',
}

export default function CoverImage({ title, category, className = '' }: Props) {
  const [from, to] = GRADIENTS[category] ?? GRADIENTS.romance
  const catLabel = CATEGORY_ZH[category] ?? category
  const fontSize = title.length > 7 ? 28 : title.length > 5 ? 32 : 36

  return (
    <svg
      viewBox="0 0 180 320"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full ${className}`}
    >
      <defs>
        <linearGradient id={`g-${category}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>

      {/* 背景 */}
      <rect width="180" height="320" fill={`url(#g-${category})`} rx="8" />

      {/* 装饰圆 */}
      <circle cx="160" cy="40" r="70" fill="white" fillOpacity="0.08" />
      <circle cx="20" cy="140" r="50" fill="white" fillOpacity="0.06" />

      {/* 图标 */}
      <text x="90" y="130" textAnchor="middle" fontSize="52" dominantBaseline="middle">🎬</text>

      {/* 底部渐变遮罩 */}
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="black" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.65" />
        </linearGradient>
      </defs>
      <rect x="0" y="200" width="180" height="120" fill="url(#fade)" rx="8" />

      {/* 分类标签 */}
      <rect x="12" y="218" width={catLabel.length * 16 + 16} height="22" rx="11" fill="white" fillOpacity="0.25" />
      <text x="20" y="233" fontSize="12" fill="white" fontWeight="600" fontFamily='"Microsoft YaHei", "PingFang SC", "Noto Sans SC", system-ui, sans-serif'>{catLabel}</text>

      {/* 剧名 */}
      <text
        x="12" y="270"
        fontSize={fontSize}
        fill="white"
        fontWeight="700"
        fontFamily='"Microsoft YaHei", "PingFang SC", "Noto Sans SC", system-ui, sans-serif'
        style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.4))' }}
      >
        {title}
      </text>

      {/* 品牌 */}
      <text x="12" y="305" fontSize="11" fill="white" fillOpacity="0.55" fontFamily='"Microsoft YaHei", "PingFang SC", "Noto Sans SC", system-ui, sans-serif'>MiniDrama</text>
    </svg>
  )
}
