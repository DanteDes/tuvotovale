import Link from 'next/link'

const navLinks = [
  { label: 'INICIO', href: '/' },
  { label: 'CLASIFICACIÓN', href: '/clasificacion' },
  { label: 'BATALLAS', href: '/batallas' },
  { label: 'MI CUENTA', href: '/cuenta' },
]

export default function Navbar() {
  return (
    <header className="relative z-30 bg-[#0a1628] border-b border-[#1a3060]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-center leading-none">
          <span
            className="text-xl font-bold text-white tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
          >
            TU VOTO
          </span>
          <span
            className="text-2xl font-bold text-[#FFD700] tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
          >
            VALE
          </span>
          <span className="text-[10px] text-gray-400 tracking-[0.3em] uppercase">
            Rey de la Cancha
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-gray-300 hover:text-[#FFD700] transition-colors tracking-wider"
              style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu placeholder */}
        <button className="md:hidden text-white p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  )
}
