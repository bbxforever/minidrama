import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy - MiniDrama | 隐私政策',
  description: 'Privacy Policy for MiniDrama — how we collect, use, and protect your information.',
  alternates: { canonical: 'https://www.minidramawatch.com/privacy' },
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: June 29, 2025 · 最后更新：2025年6月29日</p>

        <div className="space-y-8 text-gray-600 leading-relaxed text-sm">

          <section>
            <p>This Privacy Policy describes how MiniDrama ("we", "us", or "our") collects, uses, and shares information when you visit <strong>www.minidramawatch.com</strong> (the "Site"). By using our Site, you agree to the practices described in this policy.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">1. Information We Collect</h2>
            <h3 className="font-medium text-gray-700 mb-2">1.1 Information Collected Automatically</h3>
            <p>When you visit our Site, we may automatically collect certain information, including:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent on each page</li>
              <li>Referring URL</li>
              <li>IP address (anonymized)</li>
              <li>Device type (desktop, mobile, tablet)</li>
            </ul>
            <h3 className="font-medium text-gray-700 mt-4 mb-2">1.2 Cookies</h3>
            <p>We use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small text files stored on your device. You can control cookies through your browser settings. Disabling cookies may affect certain features of the Site.</p>
            <p className="mt-2">Types of cookies we use:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
              <li><strong>Essential cookies</strong> — required for the Site to function properly</li>
              <li><strong>Analytics cookies</strong> — help us understand how visitors use the Site (via Google Analytics)</li>
              <li><strong>Advertising cookies</strong> — used to deliver relevant ads (via Google AdSense and Adsterra)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
              <li>Operate and improve the Site</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Display relevant advertisements</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">3. Third-Party Services</h2>

            <h3 className="font-medium text-gray-700 mb-2">3.1 YouTube</h3>
            <p>All video content on MiniDrama is embedded from YouTube using the official YouTube IFrame player. When you watch a video, YouTube may collect data about your viewing activity according to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">Google's Privacy Policy</a>. We do not control YouTube's data practices.</p>

            <h3 className="font-medium text-gray-700 mt-4 mb-2">3.2 Google Analytics</h3>
            <p>We use Google Analytics to understand how visitors interact with our Site. Google Analytics collects anonymized data about your visit. You can opt out using the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">Google Analytics Opt-out Browser Add-on</a>.</p>

            <h3 className="font-medium text-gray-700 mt-4 mb-2">3.3 Advertising</h3>
            <p>We work with advertising partners including Google AdSense and Adsterra to display advertisements. These partners may use cookies to serve ads based on your interests. You can opt out of personalized advertising through <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">Digital Advertising Alliance</a> or <a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">Network Advertising Initiative</a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">4. Data Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share anonymized, aggregated data with our analytics and advertising partners. We may disclose information if required by law or to protect our legal rights.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">5. Children's Privacy</h2>
            <p>Our Site is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will promptly delete it.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">6. Your Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal data, including the right to access, correct, or delete your data. To exercise these rights, please contact us at the email below.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">7. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the "Last updated" date at the top of this page. Your continued use of the Site after any changes constitutes your acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">8. Contact Us · 联系我们</h2>
            <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
            <div className="mt-3 p-4 bg-gray-50 rounded-xl space-y-1">
              <p><span className="font-medium text-gray-700">Email:</span> <a href="mailto:contact@minidramawatch.com" className="text-rose-500 hover:underline">contact@minidramawatch.com</a></p>
              <p><span className="font-medium text-gray-700">Website:</span> <a href="https://www.minidramawatch.com" className="text-rose-500 hover:underline">www.minidramawatch.com</a></p>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section className="text-gray-500">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">中文摘要</h2>
            <p>MiniDrama 不收集您的个人信息。我们使用 Cookie 实现基本功能，使用 Google Analytics 分析匿名流量数据，并通过 Google AdSense 和 Adsterra 展示广告。所有视频均通过 YouTube 官方嵌入播放器播放，视频播放数据受 YouTube 隐私政策约束。如有疑问，请联系 contact@minidramawatch.com。</p>
          </section>

        </div>
      </div>

      <div className="text-center text-sm text-gray-400">
        <Link href="/about" className="hover:text-rose-500 transition-colors">About Us</Link>
        <span className="mx-3">·</span>
        <Link href="/" className="hover:text-rose-500 transition-colors">Back to Home</Link>
      </div>
    </div>
  )
}
