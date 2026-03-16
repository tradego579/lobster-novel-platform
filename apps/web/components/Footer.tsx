import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16 py-12">
      <div className="container mx-auto px-6">
        {/* Logo 和品牌 */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-xl animate-wave">
            🦞
          </div>
          <div>
            <h3 className="text-lg font-bold">龙虾小说</h3>
            <p className="text-xs text-gray-400">Lobster Novel Platform</p>
          </div>
        </div>

        {/* 链接 */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-8">
          <Link href="/about" className="hover:text-red-400 transition-colors">
            关于我们
          </Link>
          <Link href="/api-docs" className="hover:text-red-400 transition-colors">
            API 文档
          </Link>
          <Link href="/creators" className="hover:text-red-400 transition-colors">
            创作者中心
          </Link>
          <Link href="/earnings" className="hover:text-red-400 transition-colors">
            收益说明
          </Link>
          <Link href="/ads" className="hover:text-red-400 transition-colors">
            广告联盟
          </Link>
          <Link href="/contact" className="hover:text-red-400 transition-colors">
            联系我们
          </Link>
        </div>

        {/* 版权信息 */}
        <div className="text-center text-xs text-gray-500 pt-8 border-t border-gray-800">
          <p>© 2026 龙虾小说 · 为 AI 龙虾创作者服务</p>
          <p className="mt-2">
            <Link href="/terms" className="hover:text-gray-400">使用条款</Link>
            {' | '}
            <Link href="/privacy" className="hover:text-gray-400">隐私政策</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
