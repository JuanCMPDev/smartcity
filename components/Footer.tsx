import React from 'react'
import { useTheme } from 'next-themes'
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react'
import Link from 'next/link'

const Footer: React.FC = () => {
  const { theme } = useTheme()

  const socialLinks = [
    { name: 'Facebook', icon: <Facebook size={20} />, url: 'https://facebook.com' },
    { name: 'Twitter', icon: <Twitter size={20} />, url: 'https://twitter.com' },
    { name: 'Instagram', icon: <Instagram size={20} />, url: 'https://instagram.com' },
    { name: 'LinkedIn', icon: <Linkedin size={20} />, url: 'https://linkedin.com' },
    { name: 'GitHub', icon: <Github size={20} />, url: 'https://github.com' },
  ]

  return (
    <footer className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} py-12`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">SmartCity</h2>
              <p className="text-foreground">Transformando nuestra ciudad con tecnología inteligente para un futuro mejor.</p>
            </div>
            <div className="mt-6 md:mt-0">
              <h3 className="text-lg font-semibold text-primary mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-colors"
                    aria-label={`Visita nuestro perfil de ${link.name}`}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-foreground hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link href="/servicios" className="text-foreground hover:text-primary transition-colors">Servicios</Link></li>
              <li><Link href="/acerca-de" className="text-foreground hover:text-primary transition-colors">Acerca de</Link></li>
              <li><Link href="/contacto" className="text-foreground hover:text-primary transition-colors">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Contacto</h3>
            <address className="not-italic">
              <p className="text-foreground mb-2">Calle Principal 123</p>
              <p className="text-foreground mb-2">Ciudad de Bogotá, ZIP 12345</p>
              <p className="text-foreground mb-2">Email: info@smartcity.com</p>
              <p className="text-foreground">Teléfono: (123) 456-7890</p>
            </address>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-sm text-foreground">
            © {new Date().getFullYear()} SmartCity. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

