import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NAV } from '../data'
import logoBND from '../assets/logo/bnd-chuyen-trang.svg'

/* 2 nút vàng bên phải thanh đầu trang (menu chữ không lặp lại 2 mục này) */
const CTAS = [
  { href: '#de-cu', label: 'Đề cử', long: 'Đề cử nghệ sĩ' },
  { href: '#dang-ky', label: 'Đăng ký biểu diễn', long: 'Đăng ký biểu diễn' },
]

/* Thanh đầu trang: logo Báo Nhân Dân + "Chuyên trang của Báo Nhân Dân" (thiết kế gốc logo-header.svg) */
export function Logo({ className = '' }) {
  return (
    <a href="#top" className={`inline-flex items-center rounded-sm ${className}`} aria-label="Chuyên trang của Báo Nhân Dân — về đầu trang">
      <img src={logoBND} alt="" width="268" height="48" className="h-9 w-auto sm:h-10 lg:h-12" />
    </a>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? 'border-b border-line/70 bg-night/85 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav aria-label="Điều hướng chính" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <Logo />
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <a href={n.href} className="rounded-full px-4 py-2 text-sm text-muted transition-colors hover:text-amber">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          {CTAS.map((c) => (
            <a
              key={c.href}
              href={c.href}
              className="hidden min-h-11 items-center whitespace-nowrap rounded-full bg-amber px-5 text-sm font-semibold text-ink transition-colors hover:bg-[#F7C766] sm:inline-flex"
            >
              {c.label}
            </a>
          ))}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Đóng menu' : 'Mở menu'}
            className="grid h-11 w-11 place-items-center rounded-full border border-line text-cream lg:hidden"
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden px-4 lg:hidden"
          >
            {NAV.map((n) => (
              <li key={n.href} className="border-t border-line/60 first:border-t-0">
                <a href={n.href} onClick={() => setOpen(false)} className="block py-4 font-serif text-xl text-cream">
                  {n.label}
                </a>
              </li>
            ))}
            <li className="grid gap-2.5 pb-5 pt-2">
              {CTAS.map((c) => (
                <a
                  key={c.href}
                  href={c.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center justify-center rounded-full bg-amber font-semibold text-ink"
                >
                  {c.long}
                </a>
              ))}
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  )
}
