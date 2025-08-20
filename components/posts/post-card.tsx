import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Calendar, User } from "lucide-react"
import type { Post } from "@/lib/models/Post"

interface PostCardProps {
  post: Post
  showAuthor?: boolean
}

export function PostCard({ post, showAuthor = true }: PostCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      {post.featuredImage && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.featuredImage || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(post.createdAt), "yyyy年MM月dd日", { locale: zhCN })}</span>
          {showAuthor && (
            <>
              <User className="h-4 w-4 ml-2" />
              <span>作者</span>
            </>
          )}
        </div>

        <Link href={`/posts/${post.slug}`} className="group">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
        </Link>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{post.viewCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
