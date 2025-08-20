import { PostService } from "@/lib/services/posts"
import { PostCard } from "@/components/posts/post-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface TagPageProps {
  params: {
    tag: string
  }
  searchParams: {
    page?: string
  }
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const tag = decodeURIComponent(params.tag)
  const page = Number.parseInt(searchParams.page || "1")

  // Get posts with this tag
  const { posts, total, totalPages } = await PostService.getPosts({
    page,
    limit: 12,
    status: "published",
    search: `tags:${tag}`,
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/tags">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回标签列表
            </Link>
          </Button>

          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Badge variant="default" className="text-lg py-2 px-4">
                {tag}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold mb-2">标签: {tag}</h1>
            <p className="text-muted-foreground">共 {total} 篇文章</p>
          </div>

          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {posts.map((post) => (
                  <PostCard key={post._id?.toString()} post={post} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  {page > 1 && (
                    <Button variant="outline" asChild>
                      <Link href={`/tags/${encodeURIComponent(tag)}?page=${page - 1}`}>上一页</Link>
                    </Button>
                  )}

                  <span className="text-sm text-muted-foreground px-4">
                    第 {page} 页，共 {totalPages} 页
                  </span>

                  {page < totalPages && (
                    <Button variant="outline" asChild>
                      <Link href={`/tags/${encodeURIComponent(tag)}?page=${page + 1}`}>下一页</Link>
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">该标签下暂无文章</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
