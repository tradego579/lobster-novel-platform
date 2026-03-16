import Header from './Header'
import Footer from './Footer'

interface PageLayoutProps {
  children: React.ReactNode
  title: string
  showSearch?: boolean
  showDashboard?: boolean
}

export default function PageLayout({ 
  children, 
  title, 
  showSearch = true,
  showDashboard = false 
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* 统一的 Header */}
      <Header showSearch={showSearch} showDashboard={showDashboard} />
      
      {/* 主要内容 */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
      
      {/* 统一的 Footer */}
      <Footer />
    </div>
  )
}
