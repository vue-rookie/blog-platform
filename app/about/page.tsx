import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">关于我们</h1>
            <p className="text-xl text-muted-foreground">了解现代博客平台的故事和使命</p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>我们的使命</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  现代博客平台致力于为创作者和读者提供一个优质的内容分享空间。我们相信每个人都有独特的故事和见解值得分享，
                  通过技术的力量，我们希望让知识的传播变得更加简单和高效。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>平台特色</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">现代化设计</h3>
                    <p className="text-muted-foreground text-sm">采用最新的设计理念，提供简洁美观的用户界面</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">响应式布局</h3>
                    <p className="text-muted-foreground text-sm">完美适配各种设备，随时随地享受阅读体验</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">强大功能</h3>
                    <p className="text-muted-foreground text-sm">支持Markdown编辑、评论互动、搜索分类等丰富功能</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">安全可靠</h3>
                    <p className="text-muted-foreground text-sm">采用现代化的安全技术，保护用户数据和隐私</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>技术栈</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="font-semibold">Next.js</div>
                    <div className="text-sm text-muted-foreground">React框架</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="font-semibold">MongoDB</div>
                    <div className="text-sm text-muted-foreground">数据库</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="font-semibold">Tailwind CSS</div>
                    <div className="text-sm text-muted-foreground">样式框架</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="font-semibold">NextAuth.js</div>
                    <div className="text-sm text-muted-foreground">身份认证</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>联系我们</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">邮箱</h3>
                    <p className="text-muted-foreground">contact@blog.com</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">电话</h3>
                    <p className="text-muted-foreground">+86 123 4567 8900</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">地址</h3>
                    <p className="text-muted-foreground">北京市朝阳区科技园区</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
