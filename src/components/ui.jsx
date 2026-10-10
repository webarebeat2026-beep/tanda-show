import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

/* ───────── Button ───────── */
const VARIANTS = {
  primary:
    'bg-amber text-ink font-semibold shadow-[0_0_32px_-6px_rgba(242,181,68,0.7)] hover:bg-[#F7C766] hover:shadow-[0_0_44px_-4px_rgba(242,181,68,0.85)]',
  ghost:
    'border border-amber/60 text-amber bg-amber/5 shadow-[0_0_22px_-10px_rgba(242,181,68,0.9)] hover:bg-amber/12 hover:border-amber',
  subtle: 'border border-line text-cream bg-night-2/70 hover:border-amber/60 hover:text-amber',
  brick: 'bg-brick text-cream font-semibold hover:bg-[#B8432F]',
}

export function Button({ as: Tag = 'button', variant = 'primary', className = '', children, ...props }) {
  return (
    <Tag
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] transition-all duration-200 ease-out active:scale-[0.97] disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}

/* ───────── Section heading ───────── */
export function Eyebrow({ children, className = '' }) {
  return (
    <p className={`font-mono text-xs uppercase tracking-[0.22em] text-amber ${className}`}>
      <span aria-hidden="true" className="mr-2 inline-block h-px w-8 translate-y-[-3px] bg-amber/70" />
      {children}
    </p>
  )
}

/* ───────── Reveal on scroll (IntersectionObserver + CSS transition) ───────── */
export function Reveal({ children, delay = 0, y = 24, className = '', as: Tag = 'div' }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return setInView(true)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -60px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} className={`reveal ${inView ? 'is-in' : ''} ${className}`} style={{ '--reveal-delay': `${delay}s`, '--reveal-y': `${y}px` }}>
      {children}
    </Tag>
  )
}

/* ───────── Toast ───────── */
const ToastCtx = createContext(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timer = useRef()
  const show = useCallback((message) => {
    clearTimeout(timer.current)
    setToast({ message, key: Date.now() })
    timer.current = setTimeout(() => setToast(null), 3600)
  }, [])
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.key}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.22 }}
              className="pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl border border-amber/40 bg-card/95 px-5 py-3.5 text-sm text-cream shadow-2xl backdrop-blur"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber text-ink">
                <Check size={16} strokeWidth={2.5} aria-hidden="true" />
              </span>
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}

/* ───────── Modal ───────── */
export function Modal({ open, onClose, title, children }) {
  const panelRef = useRef(null)
  const lastFocus = useRef(null)

  useEffect(() => {
    if (!open) return
    lastFocus.current = document.activeElement
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])')
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => panelRef.current?.querySelector('input, textarea, button')?.focus(), 60)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      lastFocus.current?.focus?.()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[65] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button aria-label="Đóng" tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-night/80 backdrop-blur-sm" />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="organic-a relative w-full max-w-lg border border-line bg-card p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <h3 id="modal-title" className="font-serif text-2xl font-bold text-cream">{title}</h3>
              <button
                onClick={onClose}
                aria-label="Đóng hộp thoại"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:border-amber hover:text-amber"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ───────── Form field ───────── */
export function Field({ id, label, hint, error, textarea = false, className = '', ...props }) {
  const Tag = textarea ? 'textarea' : 'input'
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(' ') || undefined
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-cream">{label}</label>
      <Tag
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={`w-full rounded-xl border bg-night/70 px-4 py-3 text-[16px] text-cream placeholder:text-muted/60 transition-colors focus:border-amber focus:outline-none ${
          error ? 'border-brick-text' : 'border-line'
        } ${textarea ? 'min-h-28 resize-y' : 'min-h-12'}`}
        {...props}
      />
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">{hint}</p>}
      {error && <p id={`${id}-err`} className="mt-1.5 text-xs text-brick-text">{error}</p>}
    </div>
  )
}
