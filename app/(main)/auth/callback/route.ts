import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)

    // Verificar si el perfil está completo
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profile) {
        // Si el perfil no está completo, redirigir a la página de completar perfil
        return NextResponse.redirect(new URL('/complete-profile', request.url))
      } else {
        // Si el perfil está completo, redirigir al dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  // Si algo falla, redirigir a la página de inicio
  return NextResponse.redirect(new URL('/', request.url))
}
