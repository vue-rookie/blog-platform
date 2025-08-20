import { PostService } from "@/lib/services/posts"
import { CategoryService } from "@/lib/services/categories"
import { PostCard } from "@/components/posts/post-card"
import { AdvancedSearch } from "@/components/search/advanced-search"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Search } from "lucide-react"
import Link from "next/link"

interface SearchPageProps {
  searchParams: {
    q?: string
    category?: string
    sort?: string
    page?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""
  const categorySlug = searchParams.category || ""
  const sortBy = searchParams.sort || "newest"
  const page = Number.parseInt(searchParams.page || "1")

  const categories = await CategoryService.getAllCategories()

  // Get category ID if category slug is provided
  let categoryId = ""
  if (categorySlug) {
    const category = categories.find((cat) => cat.slug === categorySlug)
    categoryId = category?._id?.toString() || ""
  }

  // Build search options
  const searchOptions: any = {
    page,
    limit: 12,
    status: "published",
  }

  if (query) {
    searchOptions.search = query
  }

  if (categoryId) {
    searchOptions.categoryId = categoryId
  }

  const { posts, total, totalPages } = await PostService.getPosts(searchOptions)

  // Build current search params for pagination
  const buildSearchParams = (newPage: number) => {
    const params = new URLSearchParams()
    if (query) params.append("q", query)
    if (categorySlug) params.append("category", categorySlug)
    if (sortBy !== "newest") params.append("sort", sortBy)
    params.append("page", newPage.toString())
    return params.toString()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">搜索文章</h1>
            {query && (
              <p className="text-xl text-muted-foreground">
                搜索 "{query}" 的结果，共找到 {total} 篇文章
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <AdvancedSearch categories={categories} />
            </div>

            <div className="lg:col-span-3">
              {posts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {posts.map((post) => (
                      <PostCard key={post._id?.toString()} post={post} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      {page > 1 && (
                        <Button variant="outline" asChild>
                          <Link href={`/search?${buildSearchParams(page - 1)}`}>上一页</Link>
                        </Button>
                      )}

                      <span className="text-sm text-muted-foreground px-4">
                        第 {page} 页，共 {totalPages} 页
                      </span>

                      {page < totalPages && (
                        <Button variant="outline" asChild>
                          <Link href={`/search?${buildSearchParams(page + 1)}`}>下一页</Link>
                        </Button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    {query ? `没有找到包含 "${query}" 的文章` : "请输入搜索关键词"}
                  </p>
                  {query && (
                    <Button variant="outline" asChild>
                      <Link href="/search">重新搜索</Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
