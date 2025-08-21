"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Eye, Save, Send } from "lucide-react"
import type { Post } from "@/lib/models/Post"

interface PostEditorProps {
  post?: Post
  onSave?: (post: Post) => void
}

export function PostEditor({ post, onSave }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title || "")
  const [content, setContent] = useState(post?.content || "")
  const [excerpt, setExcerpt] = useState(post?.excerpt || "")
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage || "")
  const [tags, setTags] = useState<string[]>(post?.tags || [])
  const [tagInput, setTagInput] = useState("")
  const [status, setStatus] = useState(post?.status || "draft")
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle || "")
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>()
  const router = useRouter()

  useEffect(() => {
    if (title || content) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        handleAutoSave()
      }, 30000) // 30秒后自动保存
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [title, content, excerpt])

  const handleAutoSave = async () => {
    if (!title && !content) return

    setAutoSaveStatus("自动保存中...")
    try {
      await handleSave("draft", true)
      setAutoSaveStatus("已自动保存")
      setTimeout(() => setAutoSaveStatus(""), 3000)
    } catch (error) {
      setAutoSaveStatus("自动保存失败")
      setTimeout(() => setAutoSaveStatus(""), 3000)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        // 插入图片到内容中
        const imageUrl = data.data?.url || data.url
        const imageMarkdown = `![${file.name}](${imageUrl})\n\n`
        setContent((prev) => prev + imageMarkdown)
        setSuccess(data.message || "图片上传成功")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.error || "上传失败")
      }
    } catch (error) {
      setError("上传失败，请重试")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleSave = async (saveStatus: string = status, isAutoSave = false) => {
    if (!isAutoSave) {
      setIsLoading(true)
      setError("")
      setSuccess("")
    }

    try {
      const postData = {
        title,
        content,
        excerpt: excerpt || content.substring(0, 200),
        featuredImage,
        tags,
        status: saveStatus,
        seoTitle,
        seoDescription,
      }

      const url = post ? `/api/posts/${post._id}` : "/api/posts"
      const method = post ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      const data = await response.json()

      if (response.ok) {
        if (!isAutoSave) {
          setSuccess(data.message || (post ? "文章更新成功" : "文章创建成功"))
          if (onSave) {
            onSave({ ...post, ...postData } as Post)
          }
          if (!post) {
            router.push("/admin/posts")
          }
        }
      } else {
        if (!isAutoSave) {
          setError(data.error || "保存失败")
        }
      }
    } catch (error) {
      if (!isAutoSave) {
        setError("保存失败，请重试")
      }
    } finally {
      if (!isAutoSave) {
        setIsLoading(false)
      }
    }
  }

  const renderMarkdownPreview = (text: string) => {
    return text
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/!\[([^\]]*)\]$$([^$$]*)\)/gim, '<img alt="$1" src="$2" class="max-w-full h-auto rounded-lg" />')
      .replace(/\[([^\]]*)\]$$([^$$]*)\)/gim, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
      .replace(/\n/gim, "<br>")
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{post ? "编辑文章" : "创建文章"}</h1>
          {autoSaveStatus && <p className="text-sm text-muted-foreground mt-1">{autoSaveStatus}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleSave("draft")} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            保存草稿
          </Button>
          <Button onClick={() => handleSave("published")} disabled={isLoading}>
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? "发布中..." : "发布"}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">内容</TabsTrigger>
          <TabsTrigger value="settings">设置</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>文章内容</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">标题</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="输入文章标题"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">内容</Label>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? "上传中..." : "上传图片"}
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                      <Eye className="w-4 h-4 mr-2" />
                      {showPreview ? "编辑" : "预览"}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className={showPreview ? "lg:block" : "col-span-2"}>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="输入文章内容（支持Markdown）"
                      className="min-h-[400px] font-mono"
                      required
                    />
                  </div>

                  {showPreview && (
                    <div className="border rounded-md p-4 bg-muted/50 min-h-[400px] overflow-auto">
                      <div className="prose prose-sm max-w-none">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: renderMarkdownPreview(content),
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">摘要</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="输入文章摘要（可选，留空将自动生成）"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>文章设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="featuredImage">特色图片URL</Label>
                <Input
                  id="featuredImage"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="输入图片URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">状态</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="published">已发布</SelectItem>
                    <SelectItem value="archived">已归档</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>标签</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="输入标签"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" onClick={handleAddTag}>
                    添加
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO标题</Label>
                <Input
                  id="seoTitle"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="输入SEO标题（可选）"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO描述</Label>
                <Textarea
                  id="seoDescription"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="输入SEO描述（可选）"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
