"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CommentForm } from "./comment-form"
import { MessageSquare, Reply, Trash2 } from "lucide-react"
import type { Comment } from "@/lib/models/Comment"

interface CommentListProps {
  postId: string
}

export function CommentList({ postId }: CommentListProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const fetchComments = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/comments?postId=${postId}`)
      const data = await response.json()

      if (response.ok) {
        setComments(data.comments)
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  const handleCommentAdded = () => {
    fetchComments()
    setReplyingTo(null)
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm("确定要删除这条评论吗？")) return

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchComments()
      }
    } catch (error) {
      console.error("Failed to delete comment:", error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Separate parent comments and replies
  const parentComments = comments.filter((comment) => !comment.parentId)
  const getReplies = (parentId: string) => comments.filter((comment) => comment.parentId?.toString() === parentId)

  if (loading) {
    return <div className="flex justify-center p-8">加载评论中...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-xl font-semibold">评论 ({comments.length})</h3>
      </div>

      <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />

      {parentComments.length > 0 ? (
        <div className="space-y-4">
          {parentComments.map((comment) => {
            const replies = getReplies(comment._id!.toString())

            return (
              <Card key={comment._id?.toString()}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{getInitials(comment.authorName)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.authorName}</span>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(comment.createdAt), "yyyy年MM月dd日 HH:mm", { locale: zhCN })}
                        </span>
                      </div>

                      <p className="text-foreground leading-relaxed">{comment.content}</p>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setReplyingTo(replyingTo === comment._id?.toString() ? null : comment._id!.toString())
                          }
                        >
                          <Reply className="h-4 w-4 mr-1" />
                          回复
                        </Button>

                        {session?.user.role === "admin" && (
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(comment._id!.toString())}>
                            <Trash2 className="h-4 w-4 mr-1" />
                            删除
                          </Button>
                        )}
                      </div>

                      {replyingTo === comment._id?.toString() && (
                        <div className="mt-4">
                          <CommentForm
                            postId={postId}
                            parentId={comment._id!.toString()}
                            onCommentAdded={handleCommentAdded}
                            onCancel={() => setReplyingTo(null)}
                          />
                        </div>
                      )}

                      {/* Replies */}
                      {replies.length > 0 && (
                        <div className="mt-4 space-y-4 border-l-2 border-muted pl-4">
                          {replies.map((reply) => (
                            <div key={reply._id?.toString()} className="flex items-start gap-4">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">{getInitials(reply.authorName)}</AvatarFallback>
                              </Avatar>

                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{reply.authorName}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {format(new Date(reply.createdAt), "yyyy年MM月dd日 HH:mm", { locale: zhCN })}
                                  </span>
                                </div>

                                <p className="text-sm text-foreground leading-relaxed">{reply.content}</p>

                                {session?.user.role === "admin" && (
                                  <Button variant="ghost" size="sm" onClick={() => handleDelete(reply._id!.toString())}>
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    删除
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>还没有评论，来发表第一条评论吧！</p>
        </div>
      )}
    </div>
  )
}
