'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FileText, Users, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const NAV_ITEMS: NavItem[] = [
  { label: '대시보드', href: '/dashboard', icon: LayoutDashboard },
  { label: '게시글', href: '/posts', icon: FileText },
  { label: '회원', href: '/members', icon: Users },
]

interface AdminSidebarProps {
  nickname: string
  userId: string
}

export function AdminSidebar({ nickname, userId }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className={cn(
      'fixed inset-y-0 left-0 z-40 flex w-[220px] flex-col',
      'border-r border-white/[0.06] bg-[#0c0c0c]',
    )}>
      {/* 로고 */}
      <div className="flex h-14 items-center gap-2.5 border-b border-white/[0.06] px-5">
        <span className="relative h-6 w-6 rounded-[6px] bg-[hsl(var(--brand))] shadow-[0_0_0_1px_hsl(var(--brand)/0.4)]">
          <span className="absolute inset-1 rounded-[2px] bg-[#0c0c0c]" />
        </span>
        <span className="text-[14px] font-bold tracking-tight text-foreground">
          DBC <span className="text-foreground-muted font-normal">Admin</span>
        </span>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.08em] text-foreground-subtle">
          관리
        </p>
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2.5',
                    'text-[13.5px] font-medium transition-colors duration-150',
                    isActive
                      ? 'bg-white/[0.08] text-foreground'
                      : 'text-foreground-muted hover:bg-white/[0.04] hover:text-foreground',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* 유저 정보 */}
      <div className="border-t border-white/[0.06] p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-[11px] font-semibold text-foreground">
            {nickname.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-foreground">{nickname}</p>
          </div>
          <button
            onClick={handleLogout}
            className="shrink-0 rounded-md p-1.5 text-foreground-subtle transition-colors hover:bg-white/[0.06] hover:text-foreground"
            aria-label="로그아웃"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </aside>
  )
}
