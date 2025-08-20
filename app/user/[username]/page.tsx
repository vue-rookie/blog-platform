import { notFound } from "next/navigation"
import { getDatabase } from "@/lib/mongodb"
import { PostService } from "@/lib/services/posts"
import { PostCard } from "@/components/posts/post-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin } from "lucide-react"

interface UserProfilePageProps {
  params: {
    username: string
  }
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  try {
    const db = await getDatabase()
    const usersCollection = db.collection("users")

    const user = await usersCollection.findOne({
      username: params.username,
      isActive: true,
    })

    if (!user) {
      notFound()
    }

    const { posts } = await PostService.getPosts({
      page: 1,
      limit: 20,
      status: "published",
      authorId: user._id.toString(),
    })

    const initials =
      user.username
        ?.split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase() || "U"

    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <CardHeader className="text-center">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                    <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-bold">{user.username}</h1>
                    <p className="text-muted-foreground mt-2">{user.bio || "这个人很懒，什么都没有留下..."}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      加入于 {new Date(user.createdAt).toLocaleDateString("zh-CN")}
                    </div>
                    {user.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {user.location}
                      </div>
                    )}
                  </div>
                  <Badge variant="secondary">
                    {user.role === "admin" ? "管理员" : user.role === "author" ? "作者" : "读者"}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            <div>
              <h2 className="text-2xl font-bold mb-6">发布的文章 ({posts.length})</h2>
              {posts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <PostCard key={post._id.toString()} post={post} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">该用户还没有发布任何文章</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading user profile:", error)
    notFound()
  }
}
