const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始初始化种子数据...')

  // 创建测试用户
  const adminUser = await prisma.user.upsert({
    where: { openid: 'admin_openid' },
    update: {},
    create: {
      openid: 'admin_openid',
      nickname: '管理员',
      role: 'ADMIN',
      bio: '平台管理员',
    },
  })

  const testAuthor = await prisma.user.upsert({
    where: { openid: 'author_openid' },
    update: {},
    create: {
      openid: 'author_openid',
      nickname: '测试作者',
      role: 'AUTHOR',
      bio: '热爱创作的网文作者',
    },
  })

  console.log('✅ 用户创建完成')

  // 创建测试小说
  const novel1 = await prisma.novel.create({
    data: {
      title: '规则怪谈：我家小区有 108 条禁忌',
      description: '搬进新小区的第一天，物业给我一本规则手册。第一条：晚上 10 点后，无论谁敲门都不要开，即使是物业也不行...',
      category: 'HORROR',
      tags: JSON.stringify(['规则怪谈', '悬疑', '恐怖', '现代']),
      status: 'PUBLISHED',
      authorId: testAuthor.id,
      wordCount: 6500,
      chapterCount: 2,
    },
  })

  const novel2 = await prisma.novel.create({
    data: {
      title: '绑定国运：我花钱就能变强',
      description: '穿越平行世界，龙国国力衰退，我被绑定国运系统。只要花钱就能变强，还能提升国运！于是，我开启了疯狂消费模式...',
      category: 'URBAN',
      tags: JSON.stringify(['系统', '都市', '神豪', '国运']),
      status: 'PUBLISHED',
      authorId: testAuthor.id,
      wordCount: 6200,
      chapterCount: 2,
    },
  })

  const novel3 = await prisma.novel.create({
    data: {
      title: '末世前 7 天：我贷款百亿囤物资',
      description: '重生回到末世前 7 天，我果断贷款百亿，疯狂囤积物资。当别人在末世挣扎求生时，我已经在安全屋里吃火锅了...',
      category: 'SCI_FI',
      tags: JSON.stringify(['末世', '重生', '囤货', '系统']),
      status: 'PUBLISHED',
      authorId: testAuthor.id,
      wordCount: 6800,
      chapterCount: 2,
    },
  })

  const novel4 = await prisma.novel.create({
    data: {
      title: '重生 1990：从倒爷到首富',
      description: '一觉醒来，回到 1990 年。这个遍地是黄金的年代，我从倒爷做起，一步步成为商业帝国掌舵人...',
      category: 'HISTORICAL',
      tags: JSON.stringify(['重生', '年代', '商业', '致富']),
      status: 'PUBLISHED',
      authorId: testAuthor.id,
      wordCount: 6400,
      chapterCount: 2,
    },
  })

  const novel5 = await prisma.novel.create({
    data: {
      title: '闭关万年，出山即无敌',
      description: '穿越修仙界，我选择苟在宗门闭关。万年过去，灵气复苏，我出山之日，便是无敌之时...',
      category: 'FANTASY',
      tags: JSON.stringify(['玄幻', '无敌', '苟道', '修仙']),
      status: 'PUBLISHED',
      authorId: testAuthor.id,
      wordCount: 6100,
      chapterCount: 2,
    },
  })

  const novel6 = await prisma.novel.create({
    data: {
      title: '离婚后，前妻跪求复合',
      description: '结婚三年，她嫌我穷酸提出离婚。当我成为世界首富那天，她跪在我面前求复合...可惜，晚了！',
      category: 'ROMANCE',
      tags: JSON.stringify(['都市', '逆袭', '打脸', '言情']),
      status: 'PUBLISHED',
      authorId: testAuthor.id,
      wordCount: 6300,
      chapterCount: 2,
    },
  })

  console.log('✅ 小说创建完成')

  // 创建章节
  const createChapters = async (novelId, titles) => {
    for (let i = 0; i < titles.length; i++) {
      await prisma.chapter.create({
        data: {
          novelId: novelId,
          title: titles[i],
          content: `# ${titles[i]}\n\n这里是章节内容...\n\n（测试数据，实际内容待填充）\n\n---\n\n*本章完*`,
          order: i + 1,
          status: 'PUBLISHED',
          wordCount: 3000 + Math.floor(Math.random() * 500),
        },
      })
    }
  }

  await createChapters(novel1.id, ['第一章：规则手册', '第二章：第一个死者'])
  await createChapters(novel2.id, ['第一章：绑定国运', '第二章：花钱就变强'])
  await createChapters(novel3.id, ['第一章：重生末世前', '第二章：百亿贷款'])
  await createChapters(novel4.id, ['第一章：回到 1990', '第二章：第一桶金'])
  await createChapters(novel5.id, ['第一章：闭关万年', '第二章：出山'])
  await createChapters(novel6.id, ['第一章：离婚', '第二章：重逢'])

  console.log('✅ 章节创建完成')

  // 创建测试评论
  await prisma.comment.create({
    data: {
      content: '太好看了！规则怪谈题材一直是我的最爱，作者加油更新！',
      novelId: novel1.id,
      userId: adminUser.id,
      likes: 5,
    },
  })

  await prisma.comment.create({
    data: {
      content: '这个设定很有意思，花钱就能变强，想知道主角会怎么花这百亿贷款',
      novelId: novel3.id,
      userId: adminUser.id,
      likes: 3,
    },
  })

  console.log('✅ 评论创建完成')

  // 创建收藏和阅读历史
  await prisma.collection.create({
    data: {
      userId: adminUser.id,
      novelId: novel1.id,
    },
  })

  const firstChapter = await prisma.chapter.findFirst({ where: { novelId: novel1.id } })
  await prisma.readingHistory.create({
    data: {
      userId: adminUser.id,
      novelId: novel1.id,
      chapterId: firstChapter.id,
    },
  })

  console.log('✅ 收藏和阅读历史创建完成')

  console.log('\n🎉 种子数据初始化完成！')
  console.log('\n测试账号:')
  console.log('- 管理员：admin_openid')
  console.log('- 测试作者：author_openid')
  console.log('\n测试小说:')
  console.log('- 规则怪谈：我家小区有 108 条禁忌')
  console.log('- 绑定国运：我花钱就能变强')
  console.log('- 末世前 7 天：我贷款百亿囤物资')
  console.log('- 重生 1990：从倒爷到首富')
  console.log('- 闭关万年，出山即无敌')
  console.log('- 离婚后，前妻跪求复合')
}

main()
  .catch((e) => {
    console.error('❌ 种子数据初始化失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
