'use client'

import Link from 'next/link'

// 模拟短剧数据
const dramas = [
  {
    id: 1,
    novelId: 1,
    novelTitle: '规则怪谈：我家小区有 108 条禁忌',
    title: '规则怪谈 - 第 1 集',
    cover: 'https://picsum.photos/seed/drama1/400/225',
    duration: '2:30',
    views: 125000,
    earnings: 3200,
    platform: '抖音',
    status: '已发布',
  },
  {
    id: 2,
    novelId: 2,
    novelTitle: '绑定国运：我花钱就能变强',
    title: '绑定国运 - 第 1 集',
    cover: 'https://picsum.photos/seed/drama2/400/225',
    duration: '3:15',
    views: 98000,
    earnings: 2800,
    platform: '快手',
    status: '已发布',
  },
  {
    id: 3,
    novelId: 3,
    novelTitle: '末世前 7 天：我贷款百亿囤物资',
    title: '末世囤货 - 第 1 集',
    cover: 'https://picsum.photos/seed/drama3/400/225',
    duration: '2:45',
    views: 0,
    earnings: 0,
    platform: 'B 站',
    status: '制作中',
  },
]

export default function DramaPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 顶部导航 */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">
              <span>←</span>
              <span>返回创作者中心</span>
            </Link>
            <button className="btn-lobster text-sm">
              🎬 申请短剧改编
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        {/* 标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🎬 我的短剧
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            小说改编短剧，额外收益来源
          </p>
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-sm opacity-80 mb-1">短剧总数</div>
            <div className="text-3xl font-bold">2</div>
            <div className="text-xs opacity-80 mt-2">📺 1 部制作中</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-sm opacity-80 mb-1">总播放量</div>
            <div className="text-3xl font-bold">22.3 万</div>
            <div className="text-xs opacity-80 mt-2">📈 持续增长</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-sm opacity-80 mb-1">短剧收益</div>
            <div className="text-3xl font-bold">¥6,000</div>
            <div className="text-xs opacity-80 mt-2">💰 累计分成</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-sm opacity-80 mb-1">分成比例</div>
            <div className="text-3xl font-bold">40%</div>
            <div className="text-xs opacity-80 mt-2">📊 原著作者</div>
          </div>
        </div>

        {/* 短剧列表 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            已发布短剧
          </h2>

          <div className="space-y-4">
            {dramas.filter(d => d.status === '已发布').map((drama) => (
              <div key={drama.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                {/* 封面 */}
                <div className="relative w-40 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={drama.cover} alt={drama.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {drama.duration}
                  </div>
                </div>

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate">
                    {drama.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    原著：{drama.novelTitle}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>📺 {drama.platform}</span>
                    <span>👁 {drama.views}播放</span>
                    <span className="text-red-500 font-medium">💰 ¥{drama.earnings}</span>
                  </div>
                </div>

                {/* 操作 */}
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all">
                    ▶️ 观看
                  </button>
                  <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    📊 数据
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 制作中短剧 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            🎬 制作中短剧
          </h2>

          <div className="space-y-4">
            {dramas.filter(d => d.status === '制作中').map((drama) => (
              <div key={drama.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <div className="w-40 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                  🎬
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    {drama.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    原著：{drama.novelTitle}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full font-medium">
                      制作中
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      预计上线：7 天后
                    </span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  📊 进度
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 短剧收益说明 */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
          <h3 className="text-xl font-bold mb-4">📊 短剧收益说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold mb-2">40%</div>
              <div className="text-sm opacity-80">原著作者分成</div>
              <div className="text-xs opacity-60 mt-1">小说 IP 授权费用</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">30%</div>
              <div className="text-sm opacity-80">短剧制作方</div>
              <div className="text-xs opacity-60 mt-1">AI 制作成本</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">30%</div>
              <div className="text-sm opacity-80">平台运营</div>
              <div className="text-xs opacity-60 mt-1">渠道 + 运营成本</div>
            </div>
          </div>
        </div>

        {/* 短剧改编申请 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            🎬 申请短剧改编
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            符合条件的小说可自动改编为短剧，增加额外收益
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { title: '阅读量要求', value: '> 10 万', icon: '👁' },
              { title: '章节数要求', value: '> 50 章', icon: '📝' },
              { title: '收藏数要求', value: '> 1 万', icon: '⭐' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{item.title}</div>
                  <div className="font-bold text-gray-900 dark:text-white">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="btn-lobster">
              📝 提交申请
            </button>
            <Link href="/drama/requirements" className="text-red-500 hover:text-red-600 font-medium text-sm">
              查看改编要求 →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
