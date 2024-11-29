import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

function isProfileComplete(profile) {
  return profile.full_name && profile.phone_number && profile.city && profile.occupation && profile.education && profile.birthdate && profile.bio
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  try {
    const { data: { session } } = await supabase.auth.getSession()

    // Permitir acceso a la ruta de callback de autenticación
    if (request.nextUrl.pathname === '/auth/callback') {
      return response
    }

    if (session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      // Si no hay perfil o el perfil está incompleto, redirigir a la página de completar perfil
      if ((!profile || !isProfileComplete(profile)) && request.nextUrl.pathname !== '/complete-profile') {
        return NextResponse.redirect(new URL('/complete-profile', request.url))
      }

      // Si el usuario ya tiene un perfil completo, no dejarlo ir a /register, /login o /complete-profile
      if (profile && isProfileComplete(profile) && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register' || request.nextUrl.pathname === '/complete-profile')) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } else {
      // Si no hay sesión, redirigir a login
      if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname === '/complete-profile') {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }

    return response
  } catch (error) {
    console.error('Error in middleware:', error)
    return response
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

