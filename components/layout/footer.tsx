import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">B</span>
              </div>
              <span className="font-bold text-xl">现代博客</span>
            </div>
            <p className="text-muted-foreground text-sm">
              一个功能完整的现代化博客平台，支持文章发布、用户管理和评论系统。
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">快速链接</h3>
            <div className="space-y-2 text-sm">
              <Link href="/" className="block text-muted-foreground hover:text-foreground transition-colors">
                首页
              </Link>
              <Link href="/categories" className="block text-muted-foreground hover:text-foreground transition-colors">
                分类
              </Link>
              <Link href="/tags" className="block text-muted-foreground hover:text-foreground transition-colors">
                标签
              </Link>
              <Link href="/about" className="block text-muted-foreground hover:text-foreground transition-colors">
                关于我们
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">用户中心</h3>
            <div className="space-y-2 text-sm">
              <Link href="/auth/signin" className="block text-muted-foreground hover:text-foreground transition-colors">
                登录
              </Link>
              <Link href="/auth/signup" className="block text-muted-foreground hover:text-foreground transition-colors">
                注册
              </Link>
              <Link href="/profile" className="block text-muted-foreground hover:text-foreground transition-colors">
                个人资料
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">联系我们</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>邮箱: contact@blog.com</p>
              <p>电话: +86 123 4567 8900</p>
              <p>地址: 北京市朝阳区</p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 现代博客平台. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  )
}
