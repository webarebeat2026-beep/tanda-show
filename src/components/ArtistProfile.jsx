import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ChevronLeft, ChevronRight, Images, Mic2, Music2, Newspaper, Play, Users, X } from 'lucide-react'
import { siFacebook, siInstagram, siSoundcloud, siSpotify, siTiktok, siYoutube } from 'simple-icons'
import { ARTISTS, SHOWS } from '../data'
import { PROFILES } from '../artistProfiles'

/* ───────── Biểu tượng thương hiệu (Simple Icons, CC0) ───────── */
const BRANDS = {
  facebook: { icon: siFacebook, label: 'Facebook' },
  instagram: { icon: siInstagram, label: 'Instagram' },
  tiktok: { icon: siTiktok, label: 'TikTok' },
  youtube: { icon: siYoutube, label: 'YouTube' },
  spotify: { icon: siSpotify, label: 'Spotify' },
  soundcloud: { icon: siSoundcloud, label: 'SoundCloud' },
}

function BrandIcon({ type, size = 18 }) {
  const b = BRANDS[type]
  if (!b) return null
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={b.icon.path} />
    </svg>
  )
}

const platformOf = (url) => (url.includes('spotify.com') ? 'spotify' : url.includes('youtu') ? 'youtube' : null)
const fmtDate = (iso) => iso.split('-').reverse().join('.')

/* ───────── Hash #nghe-si/<id>: mở thẳng hồ sơ từ link chia sẻ, nút Back của trình duyệt đóng hồ sơ ───────── */
const HASH = /^#nghe-si\/([\w-]+)$/
const idFromHash = () => {
  const m = typeof location !== 'undefined' && location.hash.match(HASH)
  return m && PROFILES[m[1]] ? m[1] : null
}

export function useProfileRoute() {
  const [openId, setOpenId] = useState(null)

  useEffect(() => {
    const first = idFromHash()
    if (first) {
      history.replaceState({ profile: first, entry: true }, '', `#nghe-si/${first}`)
      document.getElementById('nghe-si')?.scrollIntoView()
      setOpenId(first)
    }
    const onPop = () => setOpenId(idFromHash())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const open = useCallback((id) => {
    history.pushState({ profile: id }, '', `#nghe-si/${id}`)
    setOpenId(id)
  }, [])

  const close = useCallback(() => {
    if (history.state?.profile && !history.state.entry) history.back()
    else {
      history.replaceState(null, '', '#nghe-si')
      setOpenId(null)
    }
  }, [])

  return { openId, open, close }
}

export const hasProfile = (id) => !!PROFILES[id]

/* ───────── Các tab ───────── */
function AboutTab({ p }) {
  return (
    <div className="space-y-7">
      {p.intro && <p className="text-[16px] leading-relaxed text-cream/90">{p.intro}</p>}
      {p.facts?.map((f) => (
        <div key={f.label}>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted">{f.label}</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-cream">{f.value}</p>
        </div>
      ))}
      {p.members?.length > 0 && (
        <div>
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted">
            <Users size={14} aria-hidden="true" /> Thành viên
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {p.members.map((m) => (
              <li key={m.name} className="rounded-xl border border-line bg-night/60 px-4 py-3">
                <span className="block font-semibold text-cream">{m.name}</span>
                <span className="block text-sm text-muted">{m.role}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function SongsTab({ p }) {
  const liveCount = p.songs.filter((s) => s.live).length
  return (
    <div>
      {liveCount > 0 && (
        <p className="mb-4 text-sm text-muted">
          <span aria-hidden="true" className="mr-2 inline-block h-2 w-2 rounded-full bg-amber align-middle" />
          Bài có nhãn <span className="font-semibold text-amber">Tại Tán Đa</span> là tiết mục nghệ sĩ đã trình diễn dưới gốc đa.
        </p>
      )}
      <ol className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
        {p.songs.map((s, i) => {
          const platform = s.url && platformOf(s.url)
          const body = (
            <>
              <span className="w-6 shrink-0 font-mono text-sm text-muted">{String(i + 1).padStart(2, '0')}</span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-semibold text-cream">{s.title}</span>
                  {s.live && (
                    <span className="rounded-full bg-amber/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber">Tại Tán Đa</span>
                  )}
                </span>
                {(s.note || !s.url) && (
                  <span className="mt-0.5 block text-sm text-muted">{s.url ? s.note : 'Chưa có link nghe chính thức'}</span>
                )}
              </span>
              {s.url && (
                <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-cream transition-colors group-hover:border-amber group-hover:text-amber">
                  {platform ? <BrandIcon type={platform} size={15} /> : <Play size={15} aria-hidden="true" />}
                  Nghe
                </span>
              )}
            </>
          )
          return (
            <li key={s.title}>
              {s.url ? (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Nghe “${s.title}” trên ${platform === 'spotify' ? 'Spotify' : 'YouTube'} (mở tab mới)`}
                  className="group flex min-h-14 items-center gap-3 bg-card px-4 py-3 transition-colors hover:bg-night/60"
                >
                  {body}
                </a>
              ) : (
                <div className="flex min-h-14 items-center gap-3 bg-card px-4 py-3">{body}</div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function PhotosTab({ p, name }) {
  const [view, setView] = useState(null) // index ảnh đang phóng to
  const photos = p.photos
  const step = (d) => setView((v) => (v + d + photos.length) % photos.length)

  useEffect(() => {
    if (view == null) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  if (view != null) {
    const ph = photos[view]
    return (
      <figure>
        <div className="relative overflow-hidden rounded-2xl bg-night">
          <img src={`./${ph.src}`} alt={ph.caption} width={ph.w} height={ph.h} className="h-auto w-full" />
          {photos.length > 1 && (
            <>
              <button onClick={() => step(-1)} aria-label="Ảnh trước" className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-night/80 text-cream backdrop-blur transition-colors hover:text-amber">
                <ChevronLeft size={22} aria-hidden="true" />
              </button>
              <button onClick={() => step(1)} aria-label="Ảnh sau" className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-night/80 text-cream backdrop-blur transition-colors hover:text-amber">
                <ChevronRight size={22} aria-hidden="true" />
              </button>
            </>
          )}
        </div>
        <figcaption className="mt-3 text-[15px] leading-relaxed text-cream/90">
          {ph.caption}
          <span className="mt-1 block text-sm text-muted">
            Ảnh: {ph.credit} ·{' '}
            <a href={ph.source} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4 hover:text-amber">
              xem bài gốc
            </a>
            <span className="ml-2 font-mono text-xs">{view + 1}/{photos.length}</span>
          </span>
        </figcaption>
        <button onClick={() => setView(null)} className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line px-4 text-sm text-cream transition-colors hover:border-amber hover:text-amber">
          <Images size={16} aria-hidden="true" /> Xem tất cả ảnh
        </button>
      </figure>
    )
  }

  return (
    <div>
      <ul className="grid grid-cols-2 gap-2.5">
        {photos.map((ph, i) => (
          <li key={ph.src} className={i === 0 && photos.length !== 2 ? 'col-span-2' : ''}>
            <button
              onClick={() => setView(i)}
              aria-label={`Phóng to ảnh: ${ph.caption}`}
              className="group relative block w-full overflow-hidden rounded-xl bg-night"
            >
              <img
                src={`./${ph.src}`}
                alt=""
                width={ph.w}
                height={ph.h}
                loading="lazy"
                decoding="async"
                className={`w-full object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.03] ${i === 0 && photos.length !== 2 ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}
              />
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-muted">
        Ảnh {name} biểu diễn tại Tán Đa · nguồn: {[...new Set(photos.map((ph) => ph.credit))].join(', ')}
      </p>
    </div>
  )
}

function PressTab({ p }) {
  const items = [...p.press].sort((a, b) => b.date.localeCompare(a.date))
  return (
    <ul className="space-y-2.5">
      {items.map((a) => (
        <li key={a.url}>
          <a
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 rounded-2xl border border-line bg-card p-4 transition-colors hover:border-amber/60"
          >
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-2 font-mono text-[11px] uppercase tracking-[0.14em]">
                <span className="text-amber">{a.outlet}</span>
                <span aria-hidden="true" className="h-px w-3 bg-line" />
                <span className="text-muted">{fmtDate(a.date)}</span>
              </span>
              <span className="mt-1.5 block font-serif text-[17px] font-semibold leading-snug text-cream group-hover:text-amber">{a.title}</span>
            </span>
            <ArrowUpRight size={18} className="mt-1 shrink-0 text-muted transition-colors group-hover:text-amber" aria-hidden="true" />
            <span className="sr-only">(mở tab mới)</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

/* ───────── Ngăn hồ sơ nghệ sĩ ───────── */
export default function ArtistProfile({ id, onClose }) {
  const artist = ARTISTS.find((a) => a.id === id)
  const p = PROFILES[id]
  const show = artist && SHOWS.find((s) => s.id === artist.showId)
  const panelRef = useRef(null)
  const [tab, setTab] = useState('about')
  const tabRefs = useRef({})

  const tabs = p
    ? [
        { key: 'about', label: 'Giới thiệu', icon: Mic2, show: !!(p.intro || p.members?.length) },
        { key: 'songs', label: 'Bài hát', icon: Music2, count: p.songs?.length, show: p.songs?.length > 0 },
        { key: 'photos', label: 'Ảnh', icon: Images, count: p.photos?.length, show: p.photos?.length > 0 },
        { key: 'press', label: 'Báo chí', icon: Newspaper, count: p.press?.length, show: p.press?.length > 0 },
      ].filter((t) => t.show)
    : []

  useEffect(() => setTab('about'), [id])

  useEffect(() => {
    if (!id) return
    const last = document.activeElement
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')
        if (!f.length) return
        const first = f[0]
        const lastEl = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus() }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => panelRef.current?.querySelector('[data-autofocus]')?.focus(), 60)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      last?.focus?.()
    }
  }, [id, onClose])

  /* phím mũi tên trái/phải chuyển tab (chuẩn WAI-ARIA tabs) */
  const onTabKey = (e) => {
    const i = tabs.findIndex((t) => t.key === tab)
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const next = tabs[(i + d + tabs.length) % tabs.length].key
    setTab(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <AnimatePresence>
      {artist && p && (
        <motion.div className="fixed inset-0 z-[66] flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label="Đóng hồ sơ" tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-night/80 backdrop-blur-sm" />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-title"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 30, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative flex h-full w-full flex-col overflow-hidden border-line bg-night-2 shadow-2xl sm:max-w-xl sm:border-l lg:max-w-2xl"
          >
            {/* đầu hồ sơ: ảnh + tên + kênh chính thức */}
            <div className="relative shrink-0">
              <div className="relative h-40 overflow-hidden sm:h-48">
                <img src={artist.image} alt="" className="h-full w-full object-cover" style={{ objectPosition: artist.pos || 'center 25%' }} />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night-2 via-night-2/60 to-night/20" />
              </div>
              <button
                onClick={onClose}
                data-autofocus
                aria-label="Đóng hồ sơ nghệ sĩ"
                className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-cream/30 bg-night/70 text-cream backdrop-blur transition-colors hover:border-amber hover:text-amber"
              >
                <X size={20} aria-hidden="true" />
              </button>
              <div className="relative -mt-16 px-5 sm:px-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber">
                  Hồ sơ nghệ sĩ{show ? ` · Tán Đa ${show.dayLabel}` : ''}
                </p>
                <h2 id="profile-title" className="mt-1.5 font-serif text-3xl font-bold leading-tight text-cream sm:text-4xl">{artist.name}</h2>
                <p className="mt-1 text-sm text-muted">{artist.role}{show ? ` · ${show.shortTheme}` : ''}</p>
                {p.links?.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Kênh chính thức của ${artist.name}`}>
                    {p.links.map((l) => (
                      <li key={l.url}>
                        <a
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${BRANDS[l.type]?.label} của ${artist.name} (mở tab mới)`}
                          title={BRANDS[l.type]?.label}
                          className="grid h-11 w-11 place-items-center rounded-full border border-line bg-night/70 text-cream transition-colors hover:border-amber hover:text-amber"
                        >
                          <BrandIcon type={l.type} />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* tab */}
            <div role="tablist" aria-label="Nội dung hồ sơ" onKeyDown={onTabKey} className="mt-5 flex shrink-0 gap-0.5 overflow-x-auto overflow-y-hidden border-b border-line px-2 [scrollbar-width:none] sm:gap-1 sm:px-6">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  ref={(el) => (tabRefs.current[t.key] = el)}
                  role="tab"
                  id={`ptab-${t.key}`}
                  aria-selected={tab === t.key}
                  aria-controls={`ppanel-${t.key}`}
                  tabIndex={tab === t.key ? 0 : -1}
                  onClick={() => setTab(t.key)}
                  className={`relative inline-flex min-h-12 flex-1 items-center justify-center gap-1.5 whitespace-nowrap px-1.5 text-sm font-medium transition-colors sm:flex-none sm:px-3 ${
                    tab === t.key ? 'text-amber' : 'text-muted hover:text-cream'
                  }`}
                >
                  <t.icon size={16} className="hidden sm:block" aria-hidden="true" />
                  {t.label}
                  {t.count > 0 && <span className="font-mono text-xs opacity-80">{t.count}</span>}
                  {tab === t.key && <span aria-hidden="true" className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-amber" />}
                </button>
              ))}
            </div>

            <div
              role="tabpanel"
              id={`ppanel-${tab}`}
              aria-labelledby={`ptab-${tab}`}
              tabIndex={0}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8"
            >
              {tab === 'about' && <AboutTab p={p} />}
              {tab === 'songs' && <SongsTab p={p} />}
              {tab === 'photos' && <PhotosTab p={p} name={artist.name} />}
              {tab === 'press' && <PressTab p={p} />}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
