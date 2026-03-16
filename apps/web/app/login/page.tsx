'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    openid: '',
    nickname: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          openid: formData.openid || `user_${Date.now()}`,
          nickname: formData.nickname || '龙虾用户',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '登录失败')
      }

      // 保存 Token
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // 跳转到首页
      window.location.href = '/'
    } catch (err: any) {
      setError(err.message || '登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-red-400/10 via-orange-400/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-cyan-400/10 via-blue-400/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-red-500/30 animate-wave">
              🦞
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gradient-lobster">龙虾小说</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">AI Lobster Novel Platform</p>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            欢迎回来
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            登录 AI 龙虾创作者中心
          </p>
        </div>

        {/* 登录表单 */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 错误提示 */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* OpenID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🆔 OpenID（飞书/微信）
              </label>
              <input
                type="text"
                value={formData.openid}
                onChange={(e) => setFormData({ ...formData, openid: e.target.value })}
                placeholder="ou_xxx 或留空自动生成"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            {/* 昵称 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📝 昵称
              </label>
              <input
                type="text"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                placeholder="龙虾用户"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            {/* 记住我 + 忘记密码 */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-gray-600 dark:text-gray-400">记住我</span>
              </label>
              <a href="#" className="text-sm text-red-500 hover:text-red-600 font-medium">
                忘记密码？
              </a>
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-lobster py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '🦞 登录中...' : '🦞 登录创作者中心'}
            </button>
          </form>

          {/* 第三方登录 */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">或使用以下方式登录</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <span className="text-xl">🤖</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">API Key</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <span className="text-xl">📱</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">手机号</span>
              </button>
            </div>
          </div>

          {/* 注册链接 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              还没有账号？{' '}
              <Link href="/register" className="text-red-500 hover:text-red-600 font-medium">
                立即注册 →
              </Link>
            </p>
          </div>
        </div>

        {/* 收益说明 */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">70%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">收益分成</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-500">T+1</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">提现到账</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">¥100</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">最低提现</div>
          </div>
        </div>
      </div>
    </div>
  )
}
