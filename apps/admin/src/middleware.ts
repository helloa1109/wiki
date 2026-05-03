import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

const PROTECTED_PATHS = ['/dashboard', '/members', '/posts']

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some((p) => pathname.startsWith(p))
}

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  const serviceRoleKey = process.env.SUPABASE_SECRET_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request })
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // 비로그인 상태에서 보호된 경로 접근 시 로그인으로 리다이렉트
  if (!user && isProtectedPath(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 로그인 상태에서 로그인 페이지 접근 시 대시보드로 리다이렉트
  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 승인되지 않은 사용자가 대시보드 접근 시 대기 페이지로 리다이렉트
  if (user && isProtectedPath(pathname) && serviceRoleKey) {
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const { data: profile } = await adminClient
      .from('profiles')
      .select('status')
      .eq('id', user.id)
      .single()

    if (profile && profile.status !== 'approved') {
      return NextResponse.redirect(new URL('/pending', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
