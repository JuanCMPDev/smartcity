/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Button } from './ui/button'
import ThemeToggle from './ThemeToggle'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "./ui/sheet"
import { Menu, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const { theme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const navItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Servicios', href: '/servicios' },
    { name: 'Acerca de', href: '/acerca' },
    { name: 'Precios', href: '/precios' },
  ]

  if (!mounted) {
    return null
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/80 backdrop-blur-md shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary rounded-full"></div>
              <img
                src="/logo.png"
                alt="Logo de Ciudad Inteligente"
                width={100}
                height={100}
                className="relative z-10 w-16 h-16 object-contain"
              />
            </div>
            <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-primary'}`}>SmartCity</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? 'text-primary font-semibold'
                    : theme === 'dark'
                    ? 'text-white'
                    : 'text-foreground'
                } hover:text-primary transition-colors`}
              >
                {item.name}
              </Link>
            ))}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">{session.user.email}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => router.push('/dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="outline">Iniciar Sesión</Button>
              </Link>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile menu */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                <motion.nav
                  className="flex flex-col h-full"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={slideIn}
                >
                  <motion.div className="flex-1 py-6" variants={staggerChildren}>
                    <ul className="space-y-2">
                      {navItems.map((item) => (
                        <motion.li key={item.name} variants={fadeIn}>
                          <SheetClose asChild>
                            <Link
                              href={item.href}
                              className={`flex items-center p-4 text-lg font-semibold rounded-lg hover:bg-accent ${
                                pathname === item.href
                                  ? 'text-primary'
                                  : 'text-foreground'
                              }`}
                            >
                              {item.name}
                            </Link>
                          </SheetClose>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                  <motion.div className="border-t" variants={fadeIn}>
                    <div className="flex flex-col gap-4 py-6 px-4">
                      {session ? (
                        <>
                          <p className="text-sm text-muted-foreground">{session.user.email}</p>
                          <SheetClose asChild>
                            <Button variant="outline" onClick={() => router.push('/dashboard')}>
                              Dashboard
                            </Button>
                          </SheetClose>
                          <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Cerrar Sesión</span>
                          </Button>
                        </>
                      ) : (
                        <SheetClose asChild>
                          <Link href="/login">
                            <Button variant="outline" className="w-full">
                              Iniciar Sesión
                            </Button>
                          </Link>
                        </SheetClose>
                      )}
                      <ThemeToggle />
                    </div>
                  </motion.div>
                </motion.nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Animation variants
const slideIn = {
  hidden: { x: "100%" },
  visible: { 
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  exit: { 
    x: "100%",
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

export default Navbar

