"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "服务器配置错误，请联系管理员"
      case "AccessDenied":
        return "访问被拒绝，您没有权限访问此资源"
      case "Verification":
        return "验证失败，请重新尝试"
      case "Default":
        return "认证过程中发生错误"
      default:
        return "登录时发生未知错误，请重新尝试"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">登录失败</CardTitle>
          <CardDescription>认证过程中遇到问题</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              {getErrorMessage(error)}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/auth/signin">重新登录</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">返回首页</Link>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            如果问题持续存在，请联系管理员
          </div>
        </CardContent>
      </Card>
    </div>
  )
}