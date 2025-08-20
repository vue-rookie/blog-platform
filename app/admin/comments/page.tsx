import { CommentManagement } from "@/components/admin/comment-list"

export default function CommentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">评论管理</h1>
        <p className="text-muted-foreground">管理用户评论和互动</p>
      </div>

      <CommentManagement />
    </div>
  )
}
