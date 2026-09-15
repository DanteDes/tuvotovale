import Link from "next/link";

const navLinks = [
  { label: "INICIO", href: "/" },
  { label: "CLASIFICACIÓN", href: "/clasificacion" },
  { label: "BATALLAS", href: "/batallas" },
  { label: "MI CUENTA", href: "/cuenta" },
];

export default function Navbar() {
  return (
    <header className="relative z-30 border-[#1a3060] border-b bg-[#0a1628]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-center leading-none">
          <span
            className="font-bold text-white text-xl uppercase tracking-widest"
            style={{ fontFamily: "var(--font-oswald), Oswald, sans-serif" }}
          >
            TU VOTO
          </span>
          <span
            className="font-bold text-2xl text-[#FFD700] uppercase tracking-widest"
            style={{ fontFamily: "var(--font-oswald), Oswald, sans-serif" }}
          >
            VALE
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-semibold text-gray-300 text-sm tracking-wider transition-colors hover:text-[#FFD700]"
              style={{ fontFamily: "var(--font-oswald), Oswald, sans-serif" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu placeholder */}
        <button className="p-2 text-white md:hidden">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
