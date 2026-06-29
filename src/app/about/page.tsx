import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us - MiniDrama | 关于我们',
  description: 'Learn about MiniDrama, a free platform for watching Chinese short dramas online.',
  alternates: { canonical: 'https://www.minidramawatch.com/about' },
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">About MiniDrama</h1>
        <p className="text-gray-400 text-sm mb-8">关于我们</p>

        <div className="space-y-8 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Who We Are</h2>
            <p>MiniDrama is a free online platform dedicated to bringing Chinese short dramas to viewers around the world. We curate and organize short drama content from YouTube, making it easy for audiences to discover, browse, and enjoy their favorite stories — without any subscription or registration required.</p>
            <p className="mt-3">我们是 MiniDrama，一个专注于中文短剧聚合播放的免费平台。我们从 YouTube 精选优质短剧内容，按分类整理，让全球用户可以轻松发现和观看爱情、古装、都市、悬疑等各类短剧。</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">What We Offer</h2>
            <ul className="space-y-2">
              {[
                ['🎬', 'Free streaming of Chinese short dramas', '免费观看中文短剧'],
                ['📂', 'Content organized by category: Romance, Historical, Modern, Suspense', '按类型分类：爱情、古装、都市、悬疑'],
                ['🔍', 'Easy search to find your favorite dramas', '便捷搜索，快速找到喜欢的剧集'],
                ['▶️', 'Auto-play next episode for seamless viewing', '自动播下一集，连续观看不中断'],
                ['📱', 'Mobile-friendly design for watching on any device', '移动端友好，随时随地观看'],
              ].map(([emoji, en, zh]) => (
                <li key={en} className="flex gap-3">
                  <span className="text-xl shrink-0">{emoji}</span>
                  <span><span className="text-gray-800">{en}</span><span className="text-gray-400 mx-1">·</span><span className="text-gray-500 text-sm">{zh}</span></span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Our Mission</h2>
            <p>We believe great storytelling has no borders. Our mission is to make Chinese short dramas accessible to the global audience — whether you are a native speaker, a language learner, or simply someone who enjoys compelling short-form drama content.</p>
            <p className="mt-3 text-gray-500">我们相信好故事没有边界。MiniDrama 的使命是让中文短剧走向全球，无论你是母语观众还是对中文文化感兴趣的海外用户，都能在这里找到喜欢的内容。</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Content & Copyright</h2>
            <p>All video content on MiniDrama is embedded directly from YouTube using the official YouTube embed player. We do not host, store, or re-upload any video files. All content rights remain with the original creators and their respective YouTube channels. If you are a content creator and have any concerns, please contact us.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Advertising</h2>
            <p>MiniDrama is supported by advertising. We display ads to keep the platform free for all users. We work with trusted advertising partners to deliver relevant ads. We do not sell your personal data to advertisers.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Contact Us · 联系我们</h2>
            <p>Have questions, suggestions, or content concerns? We'd love to hear from you.</p>
            <div className="mt-3 p-4 bg-gray-50 rounded-xl space-y-1 text-sm">
              <p><span className="font-medium text-gray-700">Email:</span> <a href="mailto:contact@minidramawatch.com" className="text-rose-500 hover:underline">contact@minidramawatch.com</a></p>
              <p><span className="font-medium text-gray-700">Website:</span> <a href="https://www.minidramawatch.com" className="text-rose-500 hover:underline">www.minidramawatch.com</a></p>
            </div>
          </section>

        </div>
      </div>

      <div className="text-center text-sm text-gray-400">
        <Link href="/privacy" className="hover:text-rose-500 transition-colors">Privacy Policy</Link>
        <span className="mx-3">·</span>
        <Link href="/" className="hover:text-rose-500 transition-colors">Back to Home</Link>
      </div>
    </div>
  )
}
