"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Trash2, Check, X } from "lucide-react"
import type { Comment } from "@/lib/models/Comment"

export function CommentManagement() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchComments = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)

      const response = await fetch(`/api/admin/comments?${params}`)
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
  }, [statusFilter])

  const handleStatusChange = async (commentId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchComments()
      }
    } catch (error) {
      console.error("Failed to update comment:", error)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm("确定要删除这条评论吗？")) return

    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchComments()
      }
    } catch (error) {
      console.error("Failed to delete comment:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "default",
      pending: "secondary",
      rejected: "destructive",
    } as const

    const labels = {
      approved: "已批准",
      pending: "待审核",
      rejected: "已拒绝",
    }

    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const filteredComments = comments.filter(
    (comment) =>
      comment.content.toLowerCase().includes(search.toLowerCase()) ||
      comment.authorName.toLowerCase().includes(search.toLowerCase()),
  )

  if (loading) {
    return <div className="flex justify-center p-8">加载中...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>评论管理</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="搜索评论..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="approved">已批准</SelectItem>
              <SelectItem value="pending">待审核</SelectItem>
              <SelectItem value="rejected">已拒绝</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>作者</TableHead>
              <TableHead>内容</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComments.map((comment) => (
              <TableRow key={comment._id?.toString()}>
                <TableCell>
                  <div>
                    <div className="font-medium">{comment.authorName}</div>
                    <div className="text-sm text-muted-foreground">{comment.authorEmail}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate">{comment.content}</div>
                </TableCell>
                <TableCell>{getStatusBadge(comment.status)}</TableCell>
                <TableCell>{format(new Date(comment.createdAt), "yyyy年MM月dd日", { locale: zhCN })}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {comment.status !== "approved" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusChange(comment._id!.toString(), "approved")}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    {comment.status !== "rejected" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusChange(comment._id!.toString(), "rejected")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(comment._id!.toString())}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
