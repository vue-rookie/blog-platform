import { PostCard } from "@/components/posts/post-card"
import { PostService } from "@/lib/services/posts"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface PostsPageProps {
  searchParams: {
    page?: string
    search?: string
  }
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const page = Number.parseInt(searchParams.page || "1")
  const search = searchParams.search || ""

  const { posts, total, totalPages } = await PostService.getPosts({
    page,
    limit: 12,
    status: "published",
    search,
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">所有文章</h1>
            <p className="text-muted-foreground">探索我们的文章库</p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <form method="GET" className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input name="search" placeholder="搜索文章..." defaultValue={search} className="pl-10" />
            </form>
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
                      <a href={`/posts?page=${page - 1}${search ? `&search=${search}` : ""}`}>上一页</a>
                    </Button>
                  )}

                  <span className="text-sm text-muted-foreground px-4">
                    第 {page} 页，共 {totalPages} 页
                  </span>

                  {page < totalPages && (
                    <Button variant="outline" asChild>
                      <a href={`/posts?page=${page + 1}${search ? `&search=${search}` : ""}`}>下一页</a>
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">{search ? `没有找到包含 "${search}" 的文章` : "暂无文章"}</p>
              {search && (
                <Button variant="outline" asChild>
                  <a href="/posts">查看所有文章</a>
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
