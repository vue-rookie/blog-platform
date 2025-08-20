import Link from "next/link"
import { CategoryService } from "@/lib/services/categories"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FolderOpen } from "lucide-react"

export default async function CategoriesPage() {
  const categories = await CategoryService.getAllCategories()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">文章分类</h1>
            <p className="text-xl text-muted-foreground">按分类浏览文章</p>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link key={category._id?.toString()} href={`/categories/${category.slug}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: category.color }}
                        />
                        <CardTitle className="group-hover:text-primary transition-colors">{category.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {category.description && <p className="text-muted-foreground mb-4">{category.description}</p>}
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <FolderOpen className="h-3 w-3" />
                          {category.postCount} 篇文章
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">暂无分类</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
