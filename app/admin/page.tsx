import { getDatabase } from "@/lib/mongodb"
import { StatsCard } from "@/components/admin/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PostList } from "@/components/posts/post-list"
import { FileText, Users, MessageSquare, Eye } from "lucide-react"

export default async function AdminDashboard() {
  const db = await getDatabase()

  // Get statistics
  const [postsCount, usersCount, commentsCount] = await Promise.all([
    db.collection("posts").countDocuments(),
    db.collection("users").countDocuments(),
    db.collection("comments").countDocuments(),
  ])

  // Get total views
  const viewsResult = await db
    .collection("posts")
    .aggregate([{ $group: { _id: null, totalViews: { $sum: "$viewCount" } } }])
    .toArray()

  const totalViews = viewsResult[0]?.totalViews || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">仪表板</h1>
        <p className="text-muted-foreground">欢迎回到管理后台</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="总文章数" value={postsCount} icon={FileText} description="已发布和草稿" />
        <StatsCard title="总用户数" value={usersCount} icon={Users} description="注册用户" />
        <StatsCard title="总评论数" value={commentsCount} icon={MessageSquare} description="用户评论" />
        <StatsCard title="总浏览量" value={totalViews} icon={Eye} description="文章浏览次数" />
      </div>

      {/* Recent Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>最新文章</CardTitle>
          </CardHeader>
          <CardContent>
            <PostList showActions={false} limit={5} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <h3 className="font-medium">创建新文章</h3>
                  <p className="text-sm text-muted-foreground">开始写作新的内容</p>
                </div>
                <a href="/admin/posts/new" className="text-primary hover:text-primary/80 text-sm font-medium">
                  创建
                </a>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <h3 className="font-medium">管理用户</h3>
                  <p className="text-sm text-muted-foreground">查看和管理用户账户</p>
                </div>
                <a href="/admin/users" className="text-primary hover:text-primary/80 text-sm font-medium">
                  管理
                </a>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <h3 className="font-medium">查看统计</h3>
                  <p className="text-sm text-muted-foreground">分析网站数据和趋势</p>
                </div>
                <a href="/admin/analytics" className="text-primary hover:text-primary/80 text-sm font-medium">
                  查看
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
