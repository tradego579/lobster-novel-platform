'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Chapter {
  id: string
  title: string
  order: number
  wordCount: number
  status: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

interface Novel {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  status: string
  wordCount: number
  chapterCount: number
}

export default function EditNovelPage() {
  const params = useParams()
  const router = useRouter()
  const [novel, setNovel] = useState<Novel | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewChapter, setShowNewChapter] = useState(false)
  const [newChapterTitle, setNewChapterTitle] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchNovelData(params.id as string)
    }
  }, [params.id])

  const fetchNovelData = async (novelId: string) => {
    try {
      const [novelRes, chaptersRes] = await Promise.all([
        fetch(`/api/novels/${novelId}`),
        fetch(`/api/novels/${novelId}/chapters`),
      ])

      const novelData = await novelRes.json()
      const chaptersData = await chaptersRes.json()

      setNovel(novelData)
      setChapters(chaptersData.chapters || [])
    } catch (error) {
      console.error('获取数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const createChapter = async () => {
    if (!newChapterTitle.trim()) return

    try {
      const res = await fetch(`/api/novels/${params.id}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newChapterTitle,
          content: '',
        }),
      })

      if (res.ok) {
        setNewChapterTitle('')
        setShowNewChapter(false)
        fetchNovelData(params.id as string)
      }
    } catch (error) {
      console.error('创建章节失败:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📝</div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    )
  }

  if (!novel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-xl text-gray-600 dark:text-gray-400">小说不存在</p>
          <Link href="/create" className="text-blue-600 hover:underline">
            创建新小说
          </Link>
        </div>
      </div>
    )
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
            {novel.title} - 创作后台
          </h1>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* 左侧：章节列表 */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  章节管理
                </h2>
                <button
                  onClick={() => setShowNewChapter(!showNewChapter)}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  + 新建章节
                </button>
              </div>

              {showNewChapter && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <input
                    type="text"
                    value={newChapterTitle}
                    onChange={(e) => setNewChapterTitle(e.target.value)}
                    placeholder="章节标题"
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm mb-2"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={createChapter}
                      className="flex-1 bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700"
                    >
                      创建
                    </button>
                    <button
                      onClick={() => {
                        setShowNewChapter(false)
                        setNewChapterTitle('')
                      }}
                      className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-1 px-3 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {chapters.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    暂无章节，点击上方按钮创建
                  </p>
                ) : (
                  chapters.map((chapter) => (
                    <Link
                      key={chapter.id}
                      href={`/chapter/${chapter.id}/edit`}
                      className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition"
                    >
                      <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                        {chapter.title}
                      </div>
                      <div className="flex items-center justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>{chapter.wordCount}字</span>
                        <span
                          className={`px-2 py-0.5 rounded ${
                            chapter.status === 'PUBLISHED'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}
                        >
                          {chapter.status === 'PUBLISHED' ? '已发布' : '草稿'}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {/* 统计信息 */}
              <div className="border-t dark:border-gray-700 mt-4 pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">章节数</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {chapters.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">总字数</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {(novel.wordCount / 10000).toFixed(1)}万
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：编辑区域 */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✍️</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  开始创作
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  从左侧章节列表中选择一个章节开始写作，或者创建新章节
                </p>
                <button
                  onClick={() => setShowNewChapter(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  创建新章节
                </button>
              </div>
            </div>

            {/* 小说信息 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mt-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                小说信息
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    标题
                  </label>
                  <p className="text-gray-900 dark:text-white">{novel.title}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    分类
                  </label>
                  <p className="text-gray-900 dark:text-white">{novel.category}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    简介
                  </label>
                  <p className="text-gray-900 dark:text-white">{novel.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
