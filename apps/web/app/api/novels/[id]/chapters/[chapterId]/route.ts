// Next.js API Route - 章节详情和更新
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; chapterId: string } }
) {
  try {
    const chapter = await prisma.chapter.findFirst({
      where: {
        id: params.chapterId,
        novelId: params.id,
      },
    })

    if (!chapter) {
      return NextResponse.json(
        { error: '章节不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json(chapter)
  } catch (error) {
    console.error('获取章节失败:', error)
    return NextResponse.json(
      { error: '获取章节失败' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; chapterId: string } }
) {
  try {
    const body = await request.json()
    const { title, content, status } = body

    const chapter = await prisma.chapter.update({
      where: { id: params.chapterId },
      data: {
        title: title || undefined,
        content: content || undefined,
        status: status || undefined,
        wordCount: content?.length || 0,
        publishedAt: status === 'PUBLISHED' ? new Date() : undefined,
      },
    })

    // 如果发布，更新小说状态
    if (status === 'PUBLISHED') {
      await prisma.novel.update({
        where: { id: params.id },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      })
    }

    return NextResponse.json(chapter)
  } catch (error) {
    console.error('更新章节失败:', error)
    return NextResponse.json(
      { error: '更新章节失败' },
      { status: 500 }
    )
  }
}
