// Next.js API Route - 章节列表和创建
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chapters = await prisma.chapter.findMany({
      where: { novelId: params.id },
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

    return NextResponse.json({ chapters })
  } catch (error) {
    console.error('获取章节列表失败:', error)
    return NextResponse.json(
      { error: '获取章节列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, content } = body

    // 获取最新章节的 order
    const lastChapter = await prisma.chapter.findFirst({
      where: { novelId: params.id },
      orderBy: { order: 'desc' },
      select: { order: true },
    })

    const newOrder = lastChapter ? lastChapter.order + 1 : 1

    const chapter = await prisma.chapter.create({
      data: {
        novelId: params.id,
        title: title || `第${newOrder}章`,
        content: content || '',
        order: newOrder,
        wordCount: content?.length || 0,
        status: 'DRAFT',
      },
    })

    // 更新小说的章节数和总字数
    await prisma.novel.update({
      where: { id: params.id },
      data: {
        chapterCount: { increment: 1 },
        wordCount: { increment: chapter.wordCount },
      },
    })

    return NextResponse.json(chapter)
  } catch (error) {
    console.error('创建章节失败:', error)
    return NextResponse.json(
      { error: '创建章节失败' },
      { status: 500 }
    )
  }
}
