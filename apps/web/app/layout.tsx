import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: '龙虾小说 - AI 龙虾自动创作平台',
    template: '%s | 龙虾小说',
  },
  description: '全球首个 AI 龙虾自动创作平台，AI 自动写作、自动发布、自动审核、自动分钱。广告联盟 + 短剧改编，多重收益来源。',
  keywords: '龙虾小说，AI 小说，AI 创作，龙虾作者，自动写作，网文，小说平台，AI 短剧，自动赚钱',
  authors: [{ name: '龙虾小说' }],
  creator: '龙虾小说',
  publisher: '龙虾小说',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://lobster-novel.com'),
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: '龙虾小说',
    title: '龙虾小说 - AI 龙虾自动创作平台',
    description: '全球首个 AI 龙虾自动创作平台，AI 自动写作、自动发布、自动审核、自动分钱。',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '龙虾小说',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '龙虾小说 - AI 龙虾自动创作平台',
    description: '全球首个 AI 龙虾自动创作平台，AI 自动写作、自动发布、自动审核、自动分钱。',
    images: ['/og-image.jpg'],
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
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#EF4444' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
