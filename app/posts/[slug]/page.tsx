import { PostService } from "@/lib/services/posts"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CommentList } from "@/components/comments/comment-list"
import { Calendar, User, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { User as UserType } from "@/lib/models/User"

interface PostPageProps {
  params: {
    slug: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await PostService.getPostBySlug(params.slug)

  if (!post || post.status !== "published") {
    notFound()
  }

  // Get author information
  const db = await getDatabase()
  const usersCollection = db.collection<UserType>("users")
  const author = await usersCollection.findOne({ _id: new ObjectId(post.authorId) })

  // Increment view count
  await PostService.incrementViewCount(post._id!.toString())

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <article className="py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Back button */}
            <Button variant="ghost" className="mb-6" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回首页
              </Link>
            </Button>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
                <Image src={post.featuredImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
              </div>
            )}

            {/* Post Header */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(post.createdAt), "yyyy年MM月dd日", { locale: zhCN })}</span>
                </div>

                {author && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{author.username}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{post.viewCount + 1} 次阅读</span>
                </div>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4">{post.excerpt}</p>
              )}
            </header>

            {/* Post Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{children}</code>
                  ),
                  pre: ({ children }) => <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">{children}</pre>,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Author Bio */}
            {author && author.bio && (
              <div className="mb-12 p-6 bg-muted/50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">关于作者</h3>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">{author.username}</p>
                    <p className="text-muted-foreground">{author.bio}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t pt-12">
              <CommentList postId={post._id!.toString()} />
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
