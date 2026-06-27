export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto prose prose-invert">
      <h1 className="text-2xl font-bold mb-6">Privacy Policy · 隐私政策</h1>
      <p className="text-gray-400 text-sm mb-4">Last updated: {new Date().getFullYear()}</p>
      <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
        <p>MiniDrama does not collect personal information. We use cookies for basic functionality and Google AdSense for advertising.</p>
        <p>All videos are embedded from YouTube. Video content and privacy related to playback are subject to YouTube&apos;s Privacy Policy.</p>
        <p>We use Google Analytics to understand website traffic. This data is anonymous and aggregated.</p>
        <hr className="border-gray-700 my-6" />
        <p>MiniDrama 不收集个人信息。我们使用 Cookie 实现基本功能，并使用 Google AdSense 展示广告。</p>
        <p>所有视频均通过 YouTube 嵌入播放。与视频播放相关的隐私受 YouTube 隐私政策约束。</p>
        <p>如有问题，请联系：contact@minidrama.tv</p>
      </div>
    </div>
  )
}
