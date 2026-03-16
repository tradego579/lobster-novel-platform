import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '../../node_modules/.prisma/client/index.js'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'lobster-novel-secret-key-2026'

const app = express()
const PORT = process.env.PORT || 4000

// 中间件
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// JWT 认证中间件
const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未授权', code: 'UNAUTHORIZED' })
  }
  
  try {
    const token = authHeader.split(' ')[1]
    const user = jwt.verify(token, JWT_SECRET) as any
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token 无效或已过期', code: 'INVALID_TOKEN' })
  }
}

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ==================== 认证相关 API ====================

// 用户登录/注册（自动创建账号）
app.post('/api/auth/login', async (req, res) => {
  try {
    const { openid, nickname, avatar } = req.body
    
    if (!openid) {
      return res.status(400).json({ error: '缺少 openid 参数', code: 'MISSING_PARAM' })
    }

    // 查找或创建用户
    let user = await prisma.user.findUnique({ where: { openid } })
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          openid,
          nickname: nickname || '龙虾用户',
          avatar,
          role: 'READER',
        },
      })
    } else {
      // 更新用户信息
      await prisma.user.update({
        where: { id: user.id },
        data: {
          nickname: nickname || user.nickname,
          avatar: avatar || user.avatar,
        },
      })
    }

    // 生成 JWT Token
    const token = jwt.sign(
      { userId: user.id, openid: user.openid, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        openid: user.openid,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('用户登录失败:', error)
    res.status(500).json({ error: '登录失败', code: 'LOGIN_FAILED' })
  }
})

// 获取当前用户信息
app.get('/api/auth/me', authMiddleware, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        openid: true,
        nickname: true,
        avatar: true,
        bio: true,
        role: true,
        createdAt: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: '用户不存在', code: 'USER_NOT_FOUND' })
    }

    res.json(user)
  } catch (error) {
    console.error('获取用户信息失败:', error)
    res.status(500).json({ error: '获取用户信息失败', code: 'FETCH_USER_FAILED' })
  }
})

// 更新用户信息
app.put('/api/auth/me', authMiddleware, async (req: any, res) => {
  try {
    const { nickname, avatar, bio } = req.body
    
    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        nickname: nickname || undefined,
        avatar: avatar || undefined,
        bio: bio || undefined,
      },
      select: {
        id: true,
        openid: true,
        nickname: true,
        avatar: true,
        bio: true,
        role: true,
      },
    })

    res.json(user)
  } catch (error) {
    console.error('更新用户信息失败:', error)
    res.status(500).json({ error: '更新用户信息失败', code: 'UPDATE_USER_FAILED' })
  }
})

// API 路由 - 小说列表
app.get('/api/novels', async (req, res) => {
  try {
    const { category, status, page = '1', limit = '20', search } = req.query
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string)
    const take = parseInt(limit as string)

    const where: any = { status: 'PUBLISHED' }
    
    if (category) {
      where.category = category
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { description: { contains: search as string } },
      ]
    }

    const [novels, total] = await Promise.all([
      prisma.novel.findMany({
        where,
        skip,
        take,
        include: {
          author: {
            select: { id: true, nickname: true, avatar: true },
          },
          _count: {
            select: { chapters: true, collections: true },
          },
        },
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.novel.count({ where }),
    ])

    res.json({
      data: novels,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    })
  } catch (error) {
    console.error('获取小说列表失败:', error)
    res.status(500).json({ error: '获取小说列表失败' })
  }
})

// API 路由 - 小说详情
app.get('/api/novels/:id', async (req, res) => {
  try {
    const novel = await prisma.novel.findUnique({
      where: { id: req.params.id },
      include: {
        author: {
          select: { id: true, nickname: true, avatar: true, bio: true },
        },
        chapters: {
          where: { status: 'PUBLISHED' },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            order: true,
            wordCount: true,
            publishedAt: true,
          },
        },
        _count: {
          select: { comments: true, collections: true, likes: true },
        },
      },
    })

    if (!novel) {
      return res.status(404).json({ error: '小说不存在' })
    }

    // 增加阅读量
    await prisma.novel.update({
      where: { id: novel.id },
      data: { viewCount: { increment: 1 } },
    })

    res.json(novel)
  } catch (error) {
    console.error('获取小说详情失败:', error)
    res.status(500).json({ error: '获取小说详情失败' })
  }
})

// API 路由 - 章节内容
app.get('/api/novels/:novelId/chapters/:chapterId', async (req, res) => {
  try {
    const chapter = await prisma.chapter.findFirst({
      where: {
        id: req.params.chapterId,
        novelId: req.params.novelId,
        status: 'PUBLISHED',
      },
      include: {
        novel: {
          select: {
            id: true,
            title: true,
            authorId: true,
          },
        },
      },
    })

    if (!chapter) {
      return res.status(404).json({ error: '章节不存在' })
    }

    // 增加章节阅读量
    await prisma.chapter.update({
      where: { id: chapter.id },
      data: { viewCount: { increment: 1 } },
    })

    res.json(chapter)
  } catch (error) {
    console.error('获取章节内容失败:', error)
    res.status(500).json({ error: '获取章节内容失败' })
  }
})

// ==================== 小说管理 API ====================

// 创建小说
app.post('/api/novels', authMiddleware, async (req: any, res) => {
  try {
    const { title, description, category, tags, cover } = req.body
    
    if (!title || !category) {
      return res.status(400).json({ error: '缺少必填参数', code: 'MISSING_PARAM' })
    }

    const novel = await prisma.novel.create({
      data: {
        authorId: req.user.userId,
        title,
        description,
        category,
        tags: tags || [],
        cover,
        status: 'DRAFT',
      },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
      },
    })

    res.json(novel)
  } catch (error) {
    console.error('创建小说失败:', error)
    res.status(500).json({ error: '创建小说失败', code: 'CREATE_NOVEL_FAILED' })
  }
})

// 更新小说
app.put('/api/novels/:id', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params
    const { title, description, category, tags, cover, status } = req.body

    // 检查权限
    const existingNovel = await prisma.novel.findUnique({ where: { id } })
    if (!existingNovel) {
      return res.status(404).json({ error: '小说不存在', code: 'NOVEL_NOT_FOUND' })
    }
    if (existingNovel.authorId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: '无权限操作', code: 'FORBIDDEN' })
    }

    const novel = await prisma.novel.update({
      where: { id },
      data: {
        title: title || undefined,
        description: description || undefined,
        category: category || undefined,
        tags: tags || undefined,
        cover: cover || undefined,
        status: status || undefined,
      },
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
      },
    })

    res.json(novel)
  } catch (error) {
    console.error('更新小说失败:', error)
    res.status(500).json({ error: '更新小说失败', code: 'UPDATE_NOVEL_FAILED' })
  }
})

// 删除小说
app.delete('/api/novels/:id', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params

    // 检查权限
    const novel = await prisma.novel.findUnique({ where: { id } })
    if (!novel) {
      return res.status(404).json({ error: '小说不存在', code: 'NOVEL_NOT_FOUND' })
    }
    if (novel.authorId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: '无权限操作', code: 'FORBIDDEN' })
    }

    await prisma.novel.delete({ where: { id } })

    res.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('删除小说失败:', error)
    res.status(500).json({ error: '删除小说失败', code: 'DELETE_NOVEL_FAILED' })
  }
})

// API 路由 - 小说分类
app.get('/api/categories', async (req, res) => {
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
  res.json(categories)
})

// API 路由 - 排行榜
app.get('/api/rankings', async (req, res) => {
  try {
    const { type = 'views', limit = '10' } = req.query
    
    const orderByMap: any = {
      views: { viewCount: 'desc' },
      collects: { collectCount: 'desc' },
      likes: { likeCount: 'desc' },
      newest: { publishedAt: 'desc' },
    }

    const novels = await prisma.novel.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: orderByMap[type as string] || orderByMap.views,
      take: parseInt(limit as string),
      include: {
        author: {
          select: { id: true, nickname: true },
        },
      },
    })

    res.json(novels)
  } catch (error) {
    console.error('获取排行榜失败:', error)
    res.status(500).json({ error: '获取排行榜失败' })
  }
})

// ==================== 章节管理 API ====================

// 获取章节列表
app.get('/api/novels/:novelId/chapters', async (req, res) => {
  try {
    const { novelId } = req.params
    const { status } = req.query

    const where: any = { novelId }
    if (status) {
      where.status = status
    }

    const chapters = await prisma.chapter.findMany({
      where,
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        order: true,
        wordCount: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    res.json({ chapters })
  } catch (error) {
    console.error('获取章节列表失败:', error)
    res.status(500).json({ error: '获取章节列表失败', code: 'FETCH_CHAPTERS_FAILED' })
  }
})

// 创建章节
app.post('/api/novels/:novelId/chapters', authMiddleware, async (req: any, res) => {
  try {
    const { novelId } = req.params
    const { title, content } = req.body

    if (!title || !content) {
      return res.status(400).json({ error: '缺少必填参数', code: 'MISSING_PARAM' })
    }

    // 检查小说权限
    const novel = await prisma.novel.findUnique({ where: { id: novelId } })
    if (!novel) {
      return res.status(404).json({ error: '小说不存在', code: 'NOVEL_NOT_FOUND' })
    }
    if (novel.authorId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: '无权限操作', code: 'FORBIDDEN' })
    }

    // 获取最大 order
    const maxOrder = await prisma.chapter.aggregate({
      where: { novelId },
      _max: { order: true },
    })

    const chapter = await prisma.chapter.create({
      data: {
        novelId,
        title,
        content,
        order: (maxOrder._max.order || 0) + 1,
        wordCount: content.length,
        status: 'DRAFT',
      },
      select: {
        id: true,
        title: true,
        order: true,
        status: true,
        createdAt: true,
      },
    })

    res.json(chapter)
  } catch (error) {
    console.error('创建章节失败:', error)
    res.status(500).json({ error: '创建章节失败', code: 'CREATE_CHAPTER_FAILED' })
  }
})

// 更新章节
app.put('/api/novels/:novelId/chapters/:chapterId', authMiddleware, async (req: any, res) => {
  try {
    const { novelId, chapterId } = req.params
    const { title, content, status } = req.body

    // 检查章节和权限
    const chapter = await prisma.chapter.findFirst({
      where: { id: chapterId, novelId },
    })
    if (!chapter) {
      return res.status(404).json({ error: '章节不存在', code: 'CHAPTER_NOT_FOUND' })
    }

    const novel = await prisma.novel.findUnique({ where: { id: novelId } })
    if (!novel || (novel.authorId !== req.user.userId && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: '无权限操作', code: 'FORBIDDEN' })
    }

    const updatedChapter = await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        title: title || undefined,
        content: content || undefined,
        status: status || undefined,
        wordCount: content ? content.length : undefined,
        publishedAt: status === 'PUBLISHED' && chapter.status !== 'PUBLISHED' ? new Date() : undefined,
      },
      select: {
        id: true,
        title: true,
        order: true,
        status: true,
        updatedAt: true,
      },
    })

    res.json(updatedChapter)
  } catch (error) {
    console.error('更新章节失败:', error)
    res.status(500).json({ error: '更新章节失败', code: 'UPDATE_CHAPTER_FAILED' })
  }
})

// 删除章节
app.delete('/api/novels/:novelId/chapters/:chapterId', authMiddleware, async (req: any, res) => {
  try {
    const { novelId, chapterId } = req.params

    // 检查章节和权限
    const chapter = await prisma.chapter.findFirst({
      where: { id: chapterId, novelId },
    })
    if (!chapter) {
      return res.status(404).json({ error: '章节不存在', code: 'CHAPTER_NOT_FOUND' })
    }

    const novel = await prisma.novel.findUnique({ where: { id: novelId } })
    if (!novel || (novel.authorId !== req.user.userId && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: '无权限操作', code: 'FORBIDDEN' })
    }

    await prisma.chapter.delete({ where: { id: chapterId } })

    res.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('删除章节失败:', error)
    res.status(500).json({ error: '删除章节失败', code: 'DELETE_CHAPTER_FAILED' })
  }
})

// ==================== 互动相关 API ====================

// 收藏小说
app.post('/api/novels/:novelId/collect', authMiddleware, async (req: any, res) => {
  try {
    const { novelId } = req.params
    const userId = req.user.userId

    // 检查是否已收藏
    const existing = await prisma.collection.findFirst({
      where: { userId, novelId },
    })
    if (existing) {
      return res.status(400).json({ error: '已收藏', code: 'ALREADY_COLLECTED' })
    }

    await prisma.collection.create({
      data: { userId, novelId },
    })

    // 更新收藏数
    await prisma.novel.update({
      where: { id: novelId },
      data: { collectCount: { increment: 1 } },
    })

    res.json({ success: true, message: '收藏成功' })
  } catch (error) {
    console.error('收藏小说失败:', error)
    res.status(500).json({ error: '收藏失败', code: 'COLLECT_FAILED' })
  }
})

// 取消收藏
app.delete('/api/novels/:novelId/collect', authMiddleware, async (req: any, res) => {
  try {
    const { novelId } = req.params
    const userId = req.user.userId

    await prisma.collection.deleteMany({
      where: { userId, novelId },
    })

    // 更新收藏数
    await prisma.novel.update({
      where: { id: novelId },
      data: { collectCount: { decrement: 1 } },
    })

    res.json({ success: true, message: '取消收藏成功' })
  } catch (error) {
    console.error('取消收藏失败:', error)
    res.status(500).json({ error: '取消收藏失败', code: 'UNCOLLECT_FAILED' })
  }
})

// 点赞小说
app.post('/api/novels/:novelId/like', authMiddleware, async (req: any, res) => {
  try {
    const { novelId } = req.params
    const userId = req.user.userId

    // 检查是否已点赞
    const existing = await prisma.novelLike.findFirst({
      where: { userId, novelId },
    })
    if (existing) {
      return res.status(400).json({ error: '已点赞', code: 'ALREADY_LIKED' })
    }

    await prisma.novelLike.create({
      data: { userId, novelId },
    })

    // 更新点赞数
    await prisma.novel.update({
      where: { id: novelId },
      data: { likeCount: { increment: 1 } },
    })

    res.json({ success: true, message: '点赞成功' })
  } catch (error) {
    console.error('点赞小说失败:', error)
    res.status(500).json({ error: '点赞失败', code: 'LIKE_FAILED' })
  }
})

// 取消点赞
app.delete('/api/novels/:novelId/like', authMiddleware, async (req: any, res) => {
  try {
    const { novelId } = req.params
    const userId = req.user.userId

    await prisma.novelLike.deleteMany({
      where: { userId, novelId },
    })

    // 更新点赞数
    await prisma.novel.update({
      where: { id: novelId },
      data: { likeCount: { decrement: 1 } },
    })

    res.json({ success: true, message: '取消点赞成功' })
  } catch (error) {
    console.error('取消点赞失败:', error)
    res.status(500).json({ error: '取消点赞失败', code: 'UNLIKE_FAILED' })
  }
})

// 添加评论
app.post('/api/novels/:novelId/comments', authMiddleware, async (req: any, res) => {
  try {
    const { novelId } = req.params
    const { content, chapterId, parentId } = req.body

    if (!content) {
      return res.status(400).json({ error: '评论内容不能为空', code: 'MISSING_PARAM' })
    }

    const comment = await prisma.comment.create({
      data: {
        novelId,
        chapterId,
        parentId,
        userId: req.user.userId,
        content,
      },
      select: {
        id: true,
        content: true,
        likes: true,
        createdAt: true,
        user: {
          select: { id: true, nickname: true, avatar: true },
        },
      },
    })

    res.json(comment)
  } catch (error) {
    console.error('添加评论失败:', error)
    res.status(500).json({ error: '添加评论失败', code: 'CREATE_COMMENT_FAILED' })
  }
})

// 获取评论列表
app.get('/api/novels/:novelId/comments', async (req, res) => {
  try {
    const { novelId } = req.params
    const { chapterId, page = '1', limit = '20' } = req.query

    const where: any = { novelId }
    if (chapterId) {
      where.chapterId = chapterId
    }
    // 只获取顶级评论
    where.parentId = null

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string)
    const take = parseInt(limit as string)

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: { id: true, nickname: true, avatar: true },
          },
          replies: {
            take: 5,
            include: {
              user: {
                select: { id: true, nickname: true, avatar: true },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.comment.count({ where }),
    ])

    res.json({
      data: comments,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
      },
    })
  } catch (error) {
    console.error('获取评论列表失败:', error)
    res.status(500).json({ error: '获取评论失败', code: 'FETCH_COMMENTS_FAILED' })
  }
})

// 点赞评论
app.post('/api/comments/:commentId/like', authMiddleware, async (req: any, res) => {
  try {
    const { commentId } = req.params
    const userId = req.user.userId

    // 检查是否已点赞
    const existing = await prisma.commentLike.findFirst({
      where: { userId, commentId },
    })
    if (existing) {
      return res.status(400).json({ error: '已点赞', code: 'ALREADY_LIKED' })
    }

    await prisma.commentLike.create({
      data: { userId, commentId },
    })

    // 更新点赞数
    await prisma.comment.update({
      where: { id: commentId },
      data: { likes: { increment: 1 } },
    })

    res.json({ success: true, message: '点赞成功' })
  } catch (error) {
    console.error('点赞评论失败:', error)
    res.status(500).json({ error: '点赞失败', code: 'LIKE_COMMENT_FAILED' })
  }
})

// ==================== 书架相关 API ====================

// 获取我的书架
app.get('/api/shelf', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user.userId

    const collections = await prisma.collection.findMany({
      where: { userId },
      include: {
        novel: {
          select: {
            id: true,
            title: true,
            cover: true,
            chapterCount: true,
          },
        },
        lastReadChapter: {
          select: {
            id: true,
            title: true,
            order: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json({ collections })
  } catch (error) {
    console.error('获取书架失败:', error)
    res.status(500).json({ error: '获取书架失败', code: 'FETCH_SHELF_FAILED' })
  }
})

// 添加到书架
app.post('/api/shelf/:novelId', authMiddleware, async (req: any, res) => {
  try {
    const { novelId } = req.params
    const userId = req.user.userId

    // 检查是否已收藏
    const existing = await prisma.collection.findFirst({
      where: { userId, novelId },
    })
    if (existing) {
      return res.status(400).json({ error: '已在书架中', code: 'ALREADY_IN_SHELF' })
    }

    await prisma.collection.create({
      data: { userId, novelId },
    })

    res.json({ success: true, message: '添加到书架成功' })
  } catch (error) {
    console.error('添加到书架失败:', error)
    res.status(500).json({ error: '添加到书架失败', code: 'ADD_TO_SHELF_FAILED' })
  }
})

// 移除书架
app.delete('/api/shelf/:novelId', authMiddleware, async (req: any, res) => {
  try {
    const { novelId } = req.params
    const userId = req.user.userId

    await prisma.collection.deleteMany({
      where: { userId, novelId },
    })

    res.json({ success: true, message: '从书架移除成功' })
  } catch (error) {
    console.error('移除书架失败:', error)
    res.status(500).json({ error: '移除书架失败', code: 'REMOVE_FROM_SHELF_FAILED' })
  }
})

// ==================== 阅读历史 API ====================

// 获取阅读历史
app.get('/api/history', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user.userId

    const collections = await prisma.collection.findMany({
      where: { userId, lastReadChapterId: { not: null } },
      include: {
        novel: {
          select: {
            id: true,
            title: true,
            cover: true,
          },
        },
        lastReadChapter: {
          select: {
            id: true,
            title: true,
            order: true,
          },
        },
      },
      orderBy: { lastReadAt: 'desc' },
    })

    const history = collections.map((c) => ({
      novel: c.novel,
      lastChapter: c.lastReadChapter,
      lastReadAt: c.lastReadAt,
    }))

    res.json({ history })
  } catch (error) {
    console.error('获取阅读历史失败:', error)
    res.status(500).json({ error: '获取阅读历史失败', code: 'FETCH_HISTORY_FAILED' })
  }
})

// 记录阅读进度
app.post('/api/history/:novelId', authMiddleware, async (req: any, res) => {
  try {
    const { novelId } = req.params
    const { chapterId } = req.body
    const userId = req.user.userId

    if (!chapterId) {
      return res.status(400).json({ error: '缺少章节 ID', code: 'MISSING_PARAM' })
    }

    // 更新或创建收藏记录
    await prisma.collection.upsert({
      where: {
        userId_novelId: {
          userId,
          novelId,
        },
      },
      create: {
        userId,
        novelId,
        lastReadChapterId: chapterId,
        lastReadAt: new Date(),
      },
      update: {
        lastReadChapterId: chapterId,
        lastReadAt: new Date(),
      },
    })

    res.json({ success: true, message: '阅读进度已保存' })
  } catch (error) {
    console.error('记录阅读进度失败:', error)
    res.status(500).json({ error: '记录阅读进度失败', code: 'SAVE_HISTORY_FAILED' })
  }
})

// ==================== 搜索 API ====================

// 搜索小说
app.get('/api/search', async (req, res) => {
  try {
    const { q, type = 'all', category, page = '1', limit = '20' } = req.query

    if (!q) {
      return res.status(400).json({ error: '缺少搜索关键词', code: 'MISSING_PARAM' })
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string)
    const take = parseInt(limit as string)

    const where: any = { status: 'PUBLISHED' }
    
    if (category) {
      where.category = category
    }

    if (type === 'novel' || type === 'all') {
      where.OR = [
        { title: { contains: q as string } },
        { description: { contains: q as string } },
      ]
    }

    const [novels, total] = await Promise.all([
      prisma.novel.findMany({
        where,
        skip,
        take,
        include: {
          author: {
            select: { id: true, nickname: true },
          },
        },
      }),
      prisma.novel.count({ where }),
    ])

    res.json({
      data: novels.map((n) => ({
        type: 'novel',
        id: n.id,
        title: n.title,
        description: n.description,
        author: n.author,
      })),
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
      },
    })
  } catch (error) {
    console.error('搜索失败:', error)
    res.status(500).json({ error: '搜索失败', code: 'SEARCH_FAILED' })
  }
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 API 服务器运行在 http://localhost:${PORT}`)
  console.log(`📖 API 文档：http://localhost:${PORT}/api`)
  console.log(`💡 健康检查：http://localhost:${PORT}/health`)
})
