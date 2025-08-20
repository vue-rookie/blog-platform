import Link from "next/link"
import { getDatabase } from "@/lib/mongodb"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Tag } from "lucide-react"

export default async function TagsPage() {
  const db = await getDatabase()
  const postsCollection = db.collection("posts")

  // Get all tags with their post counts
  const tagAggregation = await postsCollection
    .aggregate([
      { $match: { status: "published" } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])
    .toArray()

  const tags = tagAggregation.map((item) => ({
    name: item._id,
    count: item.count,
  }))

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">文章标签</h1>
            <p className="text-xl text-muted-foreground">按标签浏览文章</p>
          </div>

          {tags.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  所有标签
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {tags.map((tag) => (
                    <Link key={tag.name} href={`/tags/${encodeURIComponent(tag.name)}`}>
                      <Badge
                        variant="secondary"
                        className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer text-sm py-2 px-3"
                      >
                        {tag.name} ({tag.count})
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <Tag className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">暂无标签</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
