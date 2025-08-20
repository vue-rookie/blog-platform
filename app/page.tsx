import { PostCard } from "@/components/posts/post-card"
import { PostService } from "@/lib/services/posts"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default async function HomePage() {
  const { posts } = await PostService.getPosts({
    status: "published",
    limit: 6,
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              现代博客平台
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              探索知识的海洋，分享思想的火花。在这里，每一篇文章都是一次心灵的旅程。
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/auth/signup">开始写作</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#latest-posts">浏览文章</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Latest Posts */}
        <section id="latest-posts" className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">最新文章</h2>
              <p className="text-muted-foreground">发现最新的精彩内容</p>
            </div>

            {posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {posts.map((post) => (
                    <PostCard key={post._id?.toString()} post={post} />
                  ))}
                </div>

                <div className="text-center">
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/posts">查看更多文章</Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">暂无文章</p>
                <Button asChild>
                  <Link href="/auth/signin">登录后开始写作</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">平台特色</h2>
              <p className="text-muted-foreground">为创作者和读者提供最佳体验</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✍️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">简洁编辑</h3>
                <p className="text-muted-foreground">支持Markdown语法，让写作变得简单而优雅</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">互动交流</h3>
                <p className="text-muted-foreground">评论系统让读者与作者之间建立深度连接</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">智能搜索</h3>
                <p className="text-muted-foreground">强大的搜索功能帮助您快速找到感兴趣的内容</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
