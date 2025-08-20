"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/auth/user-nav"
import { Menu, X, PenTool } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">B</span>
              </div>
              <span className="font-bold text-xl">现代博客</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors">
                首页
              </Link>
              <Link href="/categories" className="text-foreground/80 hover:text-foreground transition-colors">
                分类
              </Link>
              <Link href="/tags" className="text-foreground/80 hover:text-foreground transition-colors">
                标签
              </Link>
              <Link href="/about" className="text-foreground/80 hover:text-foreground transition-colors">
                关于
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {session && (session.user.role === "admin" || session.user.role === "author") && (
              <Button asChild size="sm" className="hidden sm:flex">
                <Link href="/write">
                  <PenTool className="h-4 w-4 mr-2" />
                  开始写作
                </Link>
              </Button>
            )}

            <UserNav />

            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col gap-4">
              {session && (session.user.role === "admin" || session.user.role === "author") && (
                <Link
                  href="/write"
                  className="text-foreground/80 hover:text-foreground transition-colors flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <PenTool className="h-4 w-4 mr-2" />
                  开始写作
                </Link>
              )}
              <Link
                href="/"
                className="text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                首页
              </Link>
              <Link
                href="/categories"
                className="text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                分类
              </Link>
              <Link
                href="/tags"
                className="text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                标签
              </Link>
              <Link
                href="/about"
                className="text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                关于
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
