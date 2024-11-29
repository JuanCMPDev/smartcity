"use client"

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from "next/navigation"
import { createClient } from '@/lib/supabase/client'
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutDashboard, User, Settings, ChevronLeft, ChevronRight, Moon, Sun, LogOut, AlertTriangle, FileText } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setUser({ 
          id: user.id, 
          full_name: profile?.full_name || null,
          avatar_url: profile?.avatar_url || null,
          email: user.email
        })
      }
    }
    fetchUser()
  }, [supabase])

  const toggleCollapse = () => setIsCollapsed(!isCollapsed)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleNavigation = (href: string) => {
    if (href === '/dashboard/incidents' || href === '/dashboard/my-incidents') {
      window.location.href = href // Forzar recarga completa
    } else {
      router.push(href)
    }
  }

  interface SidebarItemProps {
    href: string;
    icon: LucideIcon;
    title: string;
  }

  const SidebarItem = ({ href, icon: Icon, title }: SidebarItemProps) => (
    <Button
      variant={pathname === href ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start",
        isCollapsed ? "px-2" : "px-4"
      )}
      onClick={() => handleNavigation(href)}
    >
      <Icon className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-2")} />
      {!isCollapsed && <span>{title}</span>}
    </Button>
  )

  return (
    <div className={cn(
      "flex flex-col border-r bg-background",
      isCollapsed ? "w-[60px]" : "w-64"
    )}>
      <div className="flex flex-col space-y-4 py-4">
        <div className={cn(
          "flex items-center justify-center",
          isCollapsed ? "px-2" : "px-4"
        )}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar_url || undefined} alt={user?.full_name || undefined} />
            <AvatarFallback>{user?.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}</AvatarFallback>
          </Avatar>
          {!isCollapsed && user && (
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{user.full_name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          )}
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-2 px-2">
            <SidebarItem href="/dashboard" icon={LayoutDashboard} title="Dashboard" />
            <SidebarItem href="/dashboard/profile" icon={User} title="Perfil" />
            <SidebarItem href="/dashboard/settings" icon={Settings} title="Configuración" />
            <SidebarItem href="/dashboard/incidents" icon={AlertTriangle} title="Reporte de Incidentes" />
            <SidebarItem href="/dashboard/my-incidents" icon={FileText} title="Mis reportes" />
          </div>
        </ScrollArea>
      </div>
      <div className="mt-auto border-t p-4">
        <div className={cn(
          "flex",
          isCollapsed ? "flex-col items-center" : "flex-row justify-between"
        )}>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleCollapse}>
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

