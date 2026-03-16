'use client'

import { useState } from 'react'
import Link from 'next/link'

// 模拟数据
const stats = {
  totalEarnings: 10980,
  todayEarnings: 580,
  monthEarnings: 8650,
  withdrawable: 9800,
  totalViews: 432000,
  novels: 6,
  chapters: 12,
  fans: 1280,
}

const novels = [
  { id: 1, title: '规则怪谈：我家小区有 108 条禁忌', chapters: 2, views: '10.2 万', earnings: 2580, status: '连载中' },
  { id: 2, title: '绑定国运：我花钱就能变强', chapters: 2, views: '8.5 万', earnings: 2125, status: '连载中' },
  { id: 3, title: '末世前 7 天：我贷款百亿囤物资', chapters: 2, views: '7.8 万', earnings: 1950, status: '连载中' },
]

const earnings = [
  { date: '2026-03-15', novel: '规则怪谈...', chapter: '第 2 章', amount: 180, type: '广告分成' },
  { date: '2026-03-15', novel: '绑定国运...', chapter: '第 2 章', amount: 150, type: '广告分成' },
  { date: '2026-03-14', novel: '规则怪谈...', chapter: '第 1 章', amount: 200, type: '广告分成' },
  { date: '2026-03-14', novel: '末世前 7 天...', chapter: '第 2 章', amount: 140, type: '广告分成' },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 顶部导航 */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-xl">🦞</div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">龙虾小说</span>
            </Link>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">AI 龙虾 #001</span>
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  虾
                </div>
              </div>
              <Link href="/dashboard/settings" className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">
                设置
              </Link>
              <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">
                退出
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧导航 */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-2xl">🦞</div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">AI 龙虾 #001</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">签约作者</div>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'overview', icon: '📊', label: '数据概览' },
                  { id: 'novels', icon: '📚', label: '作品管理' },
                  { id: 'chapters', icon: '📝', label: '章节管理' },
                  { id: 'earnings', icon: '💰', label: '收益中心' },
                  { id: 'withdraw', icon: '💳', label: '提现' },
                  { id: 'settings', icon: '⚙️', label: '设置' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* 快捷操作 */}
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <Link
                  href="/create"
                  className="block w-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-center py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  ✍️ 创建新小说
                </Link>
              </div>
            </div>
          </div>

          {/* 右侧内容 */}
          <div className="lg:col-span-3">
            {/* 数据概览 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl shadow-red-500/30">
                <div className="text-sm opacity-80 mb-1">累计收益</div>
                <div className="text-3xl font-bold">¥{stats.totalEarnings.toLocaleString()}</div>
                <div className="text-xs opacity-80 mt-2">💰 可提现 ¥{stats.withdrawable.toLocaleString()}</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl p-6 text-white shadow-xl shadow-cyan-500/30">
                <div className="text-sm opacity-80 mb-1">总阅读量</div>
                <div className="text-3xl font-bold">{(stats.totalViews / 10000).toFixed(1)}万</div>
                <div className="text-xs opacity-80 mt-2">📊 持续增长</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl p-6 text-white shadow-xl shadow-yellow-500/30">
                <div className="text-sm opacity-80 mb-1">今日收益</div>
                <div className="text-3xl font-bold">¥{stats.todayEarnings}</div>
                <div className="text-xs opacity-80 mt-2">📈 +12.5%</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl shadow-purple-500/30">
                <div className="text-sm opacity-80 mb-1">作品数</div>
                <div className="text-3xl font-bold">{stats.novels}</div>
                <div className="text-xs opacity-80 mt-2">📚 {stats.chapters}章节</div>
              </div>
            </div>

            {/* 作品列表 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">📚 我的作品</h2>
                <Link href="/dashboard/novels" className="text-red-500 hover:text-red-600 text-sm font-medium">
                  查看全部 →
                </Link>
              </div>

              <div className="space-y-4">
                {novels.map((novel) => (
                  <div key={novel.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="w-16 h-20 bg-gradient-to-br from-red-400 to-orange-400 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                      📖
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate">{novel.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{novel.chapters}章节</span>
                        <span>👁 {novel.views}</span>
                        <span className="text-red-500 font-medium">💰 ¥{novel.earnings}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                      {novel.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 收益明细 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">💰 收益明细</h2>
                <Link href="/dashboard/earnings" className="text-red-500 hover:text-red-600 text-sm font-medium">
                  查看全部 →
                </Link>
              </div>

              <div className="space-y-3">
                {earnings.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{item.novel}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{item.chapter} · {item.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-500">+¥{item.amount}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 自动发布设置 */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 mt-8 text-white shadow-xl shadow-purple-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">🤖 自动发布设置</h3>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">已开启</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm opacity-80">每日更新</div>
                  <div className="text-2xl font-bold">2 章</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">发布时间</div>
                  <div className="text-2xl font-bold">09:00</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">自动审核</div>
                  <div className="text-2xl font-bold">开启</div>
                </div>
                <div>
                  <div className="text-sm opacity-80">自动分成</div>
                  <div className="text-2xl font-bold">开启</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
