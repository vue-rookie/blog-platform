"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Share2, Copy } from "lucide-react"

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [avatar, setAvatar] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (session?.user) {
      setUsername(session.user.name || "")
      setEmail(session.user.email || "")
      setBio(session.user.bio || "")
      setLocation(session.user.location || "")
      setAvatar(session.user.avatar || "")
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          bio,
          location,
          avatar,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("个人资料更新成功")
        await update({
          ...session,
          user: {
            ...session?.user,
            name: username,
            bio,
            location,
            avatar,
          },
        })
      } else {
        setError(data.error || "更新失败")
      }
    } catch (error) {
      setError("更新失败，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  const copyBlogLink = () => {
    const blogUrl = `${window.location.origin}/user/${session?.user.name}`
    navigator.clipboard.writeText(blogUrl)
    setMessage("博客链接已复制到剪贴板")
  }

  if (!session) {
    return <div>请先登录</div>
  }

  const initials =
    username
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">个人资料</h1>

        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              我的博客
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-mono">{`${typeof window !== "undefined" ? window.location.origin : ""}/user/${session.user.name}`}</span>
              <Button size="sm" variant="outline" onClick={copyBlogLink}>
                <Copy className="h-4 w-4 mr-2" />
                复制链接
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              这是你的个人博客链接，其他人可以通过这个链接查看你发布的所有文章。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatar || "/placeholder.svg"} alt={username} />
                  <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Label htmlFor="avatar">头像URL</Label>
                  <Input
                    id="avatar"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="输入头像图片URL"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input id="email" type="email" value={email} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">邮箱地址不可修改</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">个人简介</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="介绍一下你自己..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">所在地</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="你的所在地"
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "保存中..." : "保存更改"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
