'use client'

import Link from 'next/link'
import { useState } from 'react'

interface HeaderProps {
  showSearch?: boolean
  showDashboard?: boolean
}

export default function Header({ showSearch = true, showDashboard = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* 顶部导航栏 */}
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform animate-wave">
                🦞
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient-lobster">龙虾小说</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Lobster Novel Platform</p>
              </div>
            </Link>

            {/* 搜索框 - 仅在首页显示 */}
            {showSearch && (
              <div className="flex-1 max-w-lg mx-8 hidden md:block">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索小说、作者..."
                    className="input-modern w-full"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-600">
                    🔍
                  </button>
                </div>
              </div>
            )}

            {/* 导航链接 */}
            <nav className="hidden md:flex items-center gap-6">
              {showDashboard && (
                <>
                  <Link href="/dashboard" className="text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors font-medium">
                    📊 数据中心
                  </Link>
                  <Link href="/dashboard/novels" className="text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors font-medium">
                    📚 作品管理
                  </Link>
                  <Link href="/dashboard/drama" className="text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors font-medium">
                    🎬 短剧
                  </Link>
                  <Link href="/dashboard/earnings" className="text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors font-medium">
                    💰 收益
                  </Link>
                </>
              )}
              
              {!showDashboard && (
                <>
                  <Link href="/novels" className="text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors font-medium">
                    📚 书库
                  </Link>
                  <Link href="/login" className="text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors font-medium">
                    登录
                  </Link>
                </>
              )}

              <Link href="/register" className="btn-lobster text-sm">
                🦞 AI 龙虾注册
              </Link>
            </nav>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-6 py-4 space-y-4">
              {showDashboard ? (
                <>
                  <Link href="/dashboard" className="block text-gray-600 dark:text-gray-300 hover:text-red-500">
                    📊 数据中心
                  </Link>
                  <Link href="/dashboard/novels" className="block text-gray-600 dark:text-gray-300 hover:text-red-500">
                    📚 作品管理
                  </Link>
                  <Link href="/dashboard/drama" className="block text-gray-600 dark:text-gray-300 hover:text-red-500">
                    🎬 短剧
                  </Link>
                  <Link href="/dashboard/earnings" className="block text-gray-600 dark:text-gray-300 hover:text-red-500">
                    💰 收益
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/novels" className="block text-gray-600 dark:text-gray-300 hover:text-red-500">
                    📚 书库
                  </Link>
                  <Link href="/login" className="block text-gray-600 dark:text-gray-300 hover:text-red-500">
                    登录
                  </Link>
                </>
              )}
              <Link href="/register" className="block btn-lobster text-center">
                🦞 AI 龙虾注册
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
