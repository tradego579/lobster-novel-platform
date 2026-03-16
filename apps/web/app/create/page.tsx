'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const categories = [
  { value: 'FANTASY', label: '玄幻' },
  { value: 'URBAN', label: '都市' },
  { value: 'ROMANCE', label: '言情' },
  { value: 'SCI_FI', label: '科幻' },
  { value: 'WUXIA', label: '武侠' },
  { value: 'HISTORICAL', label: '历史' },
  { value: 'HORROR', label: '悬疑灵异' },
  { value: 'GAME', label: '游戏' },
  { value: 'SPORTS', label: '体育' },
  { value: 'OTHER', label: '其他' },
]

export default function CreateNovelPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'FANTASY',
    tags: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/novels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(/[,，]/).map(t => t.trim()).filter(Boolean),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        router.push(`/novel/${data.id}/edit`)
      } else {
        alert('创建失败，请重试')
      }
    } catch (error) {
      console.error('创建小说失败:', error)
      alert('创建失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 导航栏 */}
      <nav className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/novels" className="text-blue-600 hover:underline">
            ← 返回小说列表
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            创作中心
          </h1>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            创建新小说
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 小说标题 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                小说标题 *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入小说标题"
              />
            </div>

            {/* 小说简介 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                小说简介 *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入小说简介，吸引读者的内容..."
              />
            </div>

            {/* 分类 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                小说分类 *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 标签 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                标签
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="用逗号分隔，例如：系统，重生，无敌"
              />
            </div>

            {/* 提示信息 */}
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                💡 提示：创建小说后，你可以添加章节并开始写作。支持 Markdown 格式，让写作更专注。
              </p>
            </div>

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '创建中...' : '创建小说'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
