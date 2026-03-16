// Next.js API Route - 小说列表
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where: any = { status: 'PUBLISHED' }

    if (category && category !== 'all') {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const [novels, total] = await Promise.all([
      prisma.novel.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: {
            select: { id: true, nickname: true, avatar: true },
          },
          _count: {
            select: { chapters: true },
          },
        },
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.novel.count({ where }),
    ])

    return NextResponse.json({
      data: novels,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('获取小说列表失败:', error)
    return NextResponse.json(
      { error: '获取小说列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, category, tags } = body

    // 获取或创建测试作者（实际应该从认证信息获取）
    let author = await prisma.user.findFirst({
      where: { openid: 'current_user_openid' },
    })

    if (!author) {
      author = await prisma.user.create({
        data: {
          openid: 'current_user_openid',
          nickname: '新作者',
          role: 'AUTHOR',
        },
      })
    }

    const novel = await prisma.novel.create({
      data: {
        title,
        description,
        category,
        tags: tags || [],
        status: 'DRAFT',
        authorId: author.id,
      },
    })

    return NextResponse.json(novel)
  } catch (error) {
    console.error('创建小说失败:', error)
    return NextResponse.json(
      { error: '创建小说失败' },
      { status: 500 }
    )
  }
}
