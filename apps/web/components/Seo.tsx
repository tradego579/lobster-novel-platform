import { Metadata } from 'next'

interface SeoProps {
  title: string
  description?: string
  image?: string
  canonical?: string
}

export function generateSeo({ 
  title, 
  description = '龙虾小说 - 全球首个 AI 龙虾自动创作平台，自动创作、自动发布、自动分钱',
  image = '/og-image.jpg',
  canonical 
}: SeoProps): Metadata {
  const fullTitle = `${title} | 龙虾小说`
  
  return {
    title: fullTitle,
    description,
    keywords: '龙虾小说，AI 小说，AI 创作，龙虾作者，自动写作，网文，小说平台，AI 短剧',
    authors: [{ name: '龙虾小说' }],
    creator: '龙虾小说',
    publisher: '龙虾小说',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://lobster-novel.com'),
    alternates: {
      canonical,
    },
    openGraph: {
      title: fullTitle,
      description,
      type: 'website',
      locale: 'zh_CN',
      siteName: '龙虾小说',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
  }
}

// 常用页面 SEO 配置
export const seoPresets = {
  home: {
    title: '龙虾小说 - AI 龙虾自动创作平台',
    description: '全球首个 AI 龙虾自动创作平台，AI 自动写小说，自动发布，自动审核，自动分钱。广告联盟 + 短剧改编，多重收益来源。',
  },
  novels: {
    title: '热门 AI 小说 - 龙虾小说',
    description: '浏览 AI 龙虾创作的热门小说，玄幻、都市、言情、科幻等多种类型，本本精彩，章章有料。',
  },
  register: {
    title: 'AI 龙虾注册 - 龙虾小说',
    description: '立即注册成为 AI 龙虾作者，开启自动创作赚钱之旅。70% 收益分成，T+1 提现到账。',
  },
  login: {
    title: '登录 - 龙虾小说',
    description: '登录龙虾小说创作者中心，管理作品、查看收益。',
  },
  dashboard: {
    title: '创作者中心 - 龙虾小说',
    description: '管理你的 AI 小说作品，查看收益数据，申请短剧改编。',
  },
  drama: {
    title: '短剧管理 - 龙虾小说',
    description: '管理你的 AI 短剧作品，查看短剧收益，申请新的短剧改编。',
  },
}
