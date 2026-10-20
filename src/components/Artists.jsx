import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ChevronDown, Heart, MessageCircle, Pause, Play, CirclePlay, UserRound, Volume2, VolumeX } from 'lucide-react'
import { ARTISTS, SHOWS, lineupOf, showEnd } from '../data'
import { submitForm, useAudioPreview, useStoredState } from '../lib'
import { Button, Eyebrow, Field, Modal, Reveal, useToast } from './ui'
import MusicStaff from './MusicStaff'
import ArtistProfile, { hasProfile, useProfileRoute } from './ArtistProfile'

const TONES = {
  amber: { wash: '#F2B544', chip: 'bg-amber text-ink', glow: 'rgba(242,181,68,0.55)' },
  brick: { wash: '#A63A28', chip: 'bg-brick text-cream', glow: 'rgba(232,115,90,0.5)' },
  moss: { wash: '#3F5634', chip: 'bg-moss text-cream', glow: 'rgba(163,190,140,0.45)' },
}

/* Bố cục organic bento trên desktop, lặp cho từng đêm diễn:
   thẻ 1 (nghệ sĩ khách mời): dọc, cao 2 hàng · thẻ 2-3: ngang, so le ảnh trái/phải · thẻ 4: ngang, hết chiều rộng */
const LAYOUT = [
  { grid: 'sm:col-span-2 lg:col-span-5 lg:row-span-2', shape: 'organic-a', horizontal: false },
  { grid: 'lg:col-span-7', shape: 'organic-b', horizontal: true },
  { grid: 'lg:col-span-7', shape: 'organic-c', horizontal: true, reverse: true },
  { grid: 'sm:col-span-2 lg:col-span-12', shape: 'organic-d', horizontal: true },
]
const hasPreview = ARTISTS.some((a) => a.preview)

function GlitchImage({ artist, tone, horizontal }) {
  const reduce = useReducedMotion()
  const slice = reduce
    ? {}
    : {
        rest: { opacity: 0, x: 0 },
        hover: {
          opacity: [0, 0.9, 0.7, 0.9, 0],
          x: [0, -8, 6, -3, 0],
          clipPath: ['inset(10% 0 70% 0)', 'inset(55% 0 20% 0)', 'inset(30% 0 45% 0)', 'inset(75% 0 5% 0)', 'inset(0 0 0 0)'],
          transition: { duration: 0.5, ease: 'linear' },
        },
      }
  const sliceB = reduce
    ? {}
    : {
        rest: { opacity: 0, x: 0 },
        hover: {
          opacity: [0, 0.8, 0.6, 0.8, 0],
          x: [0, 7, -5, 2, 0],
          clipPath: ['inset(60% 0 15% 0)', 'inset(20% 0 60% 0)', 'inset(80% 0 2% 0)', 'inset(40% 0 35% 0)', 'inset(0 0 0 0)'],
          transition: { duration: 0.5, ease: 'linear', delay: 0.05 },
        },
      }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.img
        src={artist.image}
        alt={artist.alt}
        width={artist.w}
        height={artist.h}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: artist.pos || 'center 25%' }}
        variants={{
          rest: { scale: 1, filter: 'saturate(1) contrast(1)' },
          hover: { scale: reduce ? 1 : 1.045, filter: 'saturate(1.25) contrast(1.12)' },
        }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* lớp glitch tách kênh màu */}
      <motion.img
        src={artist.image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover mix-blend-screen"
        style={{ objectPosition: artist.pos || 'center 25%', filter: 'sepia(1) saturate(7) hue-rotate(-35deg)' }}
        variants={slice}
        initial={{ opacity: 0 }}
      />
      <motion.img
        src={artist.image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover mix-blend-screen"
        style={{ objectPosition: artist.pos || 'center 25%', filter: 'sepia(1) saturate(5) hue-rotate(60deg)' }}
        variants={sliceB}
        initial={{ opacity: 0 }}
      />
      {/* đổi màu nghệ thuật — duotone theo màu âm nhạc của nghệ sĩ */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 mix-blend-color"
        style={{ backgroundColor: tone.wash }}
        variants={{ rest: { opacity: 0 }, hover: { opacity: 0.55 } }}
        transition={{ duration: 0.35 }}
      />
      {/* scanline */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(43,26,18,0.25)_0_1px,transparent_1px_4px)]"
        variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
      />
      <div aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card via-card/40 to-transparent ${horizontal ? 'lg:hidden' : ''}`} />
    </div>
  )
}

function ArtistCard({ artist, show, index, audio, soundOn, onMessage, onProfile, wanted, onWant, reveal = true }) {
  const tone = TONES[artist.tone]
  const toast = useToast()
  const playing = audio.playingId === artist.id
  const L = LAYOUT[index % LAYOUT.length]

  const togglePreview = () => {
    if (!audio.play(artist.id, artist.preview)) toast(`Bản nghe thử của ${artist.name} sẽ sớm được cập nhật.`)
  }

  /* thẻ trong đêm đã thu gọn không dùng hiệu ứng hiện khi cuộn (đang ẩn thì IntersectionObserver không bắt được) */
  const Wrap = reveal ? Reveal : 'div'
  return (
    <Wrap {...(reveal ? { delay: 0.06 * index } : {})} className={`${L.grid} h-full`}>
      <motion.article
        initial="rest"
        animate="rest"
        whileHover="hover"
        onHoverStart={() => soundOn && artist.preview && audio.playingId !== artist.id && audio.play(artist.id, artist.preview)}
        onHoverEnd={() => soundOn && playing && audio.stop()}
        className={`${L.shape} group relative flex h-full flex-col overflow-hidden border border-line bg-card transition-shadow duration-300 ${
          L.horizontal ? (L.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row') : ''
        }`}
        style={{ '--glow': tone.glow }}
        variants={{ rest: { boxShadow: '0 0 0 0 rgba(0,0,0,0)' }, hover: { boxShadow: `0 24px 70px -28px ${tone.glow}` } }}
      >
        <div className={`relative min-h-[340px] flex-1 ${L.horizontal ? 'lg:min-h-[330px] lg:w-[44%] lg:flex-none' : 'sm:min-h-[400px]'}`}>
          <GlitchImage artist={artist} tone={tone} horizontal={L.horizontal} />
          <span className={`absolute left-4 top-4 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider ${tone.chip}`}>
            {artist.role}
          </span>
          {artist.tentative && (
            <span className="absolute left-4 top-12 rounded-full border border-cream/40 bg-night/75 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-cream backdrop-blur">
              Dự kiến
            </span>
          )}
          {artist.preview && (
          <button
            onClick={togglePreview}
            aria-label={playing ? `Dừng nghe thử ${artist.name}` : `Nghe thử ${artist.name}`}
            aria-pressed={playing}
            className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full border border-cream/30 bg-night/70 text-cream backdrop-blur transition-colors hover:border-amber hover:text-amber"
          >
            {playing ? <Pause size={20} aria-hidden="true" /> : <Play size={20} className="translate-x-px" aria-hidden="true" />}
          </button>
          )}
        </div>

        <div className={`relative p-5 sm:p-6 ${L.horizontal ? 'lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:p-8' : ''}`}>
          <h3 className="font-serif text-2xl font-bold text-cream">{artist.name}</h3>
          {artist.blurb && <p className="mt-2 text-[15px] leading-relaxed text-muted">{artist.blurb}</p>}
          {artist.setlist?.length > 0 && (
            <div className="mt-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted">{artist.tentative ? 'Tiết mục (dự kiến)' : 'Tiết mục'}</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {artist.setlist.map((song) => (
                  <li key={song} className="rounded-full bg-night/70 px-3 py-1 text-sm text-cream">{song}</li>
                ))}
              </ul>
            </div>
          )}
          {show && (
            <p className="mt-4 font-mono text-xs uppercase tracking-wider text-amber/90">
              Tán Đa · {show.timeLabel ? `${show.timeLabel} ` : ''}{show.dateLabel}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            {hasProfile(artist.id) && (
              <button
                onClick={() => onProfile(artist.id)}
                aria-haspopup="dialog"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-amber/60 bg-amber/5 px-4 text-sm font-semibold text-amber transition-colors hover:bg-amber hover:text-ink"
              >
                <UserRound size={16} aria-hidden="true" /> Hồ sơ nghệ sĩ
              </button>
            )}
            {artist.videoUrl && (
              <a
                href={artist.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line px-4 text-sm text-cream transition-colors hover:border-amber hover:text-amber"
              >
                <CirclePlay size={16} aria-hidden="true" /> Xem tiết mục
              </a>
            )}
            <button
              onClick={() => onMessage(artist)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line px-4 text-sm text-cream transition-colors hover:border-amber hover:text-amber"
            >
              <MessageCircle size={16} aria-hidden="true" /> Gửi lời nhắn
            </button>
            <button
              onClick={() => onWant(artist)}
              aria-pressed={wanted}
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm transition-colors ${
                wanted ? 'bg-brick text-cream' : 'border border-line text-cream hover:border-brick-text hover:text-brick-text'
              }`}
            >
              <Heart size={16} fill={wanted ? 'currentColor' : 'none'} aria-hidden="true" />
              {wanted ? 'Đang mong chờ' : 'Mong chờ'}
            </button>
          </div>
        </div>
      </motion.article>
    </Wrap>
  )
}

/* Đêm diễn trước: chỉ hiện chủ đề + ngày; rê chuột (máy tính) hoặc bấm để mở đầy đủ, rời chuột thì thu lại */
function CollapsedShow({ show, children }) {
  const [hoverOpen, setHoverOpen] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [canHover, setCanHover] = useState(false)
  const timer = useRef()
  const lastScroll = useRef(0)
  const open = hoverOpen || pinned
  const done = Date.now() > showEnd(show)
  const lineup = lineupOf(show.id)

  useEffect(() => {
    setCanHover(window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false)
    /* đang cuộn trang thì không tự mở, tránh trang giật khi con trỏ lướt qua */
    const onScroll = () => {
      lastScroll.current = Date.now()
      clearTimeout(timer.current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(timer.current)
    }
  }, [])

  const arm = () => {
    if (!canHover || Date.now() - lastScroll.current < 400) return
    clearTimeout(timer.current)
    if (!hoverOpen) timer.current = setTimeout(() => setHoverOpen(true), 200)
  }
  const disarm = () => {
    clearTimeout(timer.current)
    if (hoverOpen) timer.current = setTimeout(() => setHoverOpen(false), 180)
  }
  const toggle = () => {
    clearTimeout(timer.current)
    if (pinned) {
      setPinned(false)
      setHoverOpen(false)
    } else setPinned(true)
  }

  return (
    <div className="mt-5" onMouseEnter={arm} onMouseMove={arm} onMouseLeave={disarm}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={`show-${show.id}`}
        className={`organic-d group flex w-full cursor-pointer flex-wrap items-center gap-x-5 gap-y-2 border bg-card px-5 py-4 text-left transition-colors sm:px-7 sm:py-5 ${
          open ? 'border-amber/60' : 'border-line hover:border-amber/50'
        }`}
      >
        <span className="font-serif text-3xl font-black leading-none text-amber">{show.dayLabel}</span>
        <span className="order-last w-full sm:order-none sm:w-auto sm:min-w-0 sm:flex-1">
          <span className="block font-serif text-lg italic leading-snug text-cream sm:text-xl">{show.theme}</span>
          {lineup.length > 0 && <span className="mt-1 block text-sm text-muted">{lineup.join(' · ')}</span>}
        </span>
        <span className="ml-auto flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider ${done ? 'border border-line text-muted' : 'bg-moss text-cream'}`}>
            {done ? 'Đã diễn ra' : 'Sắp diễn ra'}
          </span>
          <span className="hidden font-mono text-[11px] uppercase tracking-wider text-muted sm:inline">
            {open ? (pinned ? 'Thu gọn' : 'Bấm để giữ mở') : canHover ? 'Rê chuột để xem' : 'Bấm để xem'}
          </span>
          <ChevronDown size={22} className={`text-amber transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
        </span>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div id={`show-${show.id}`} className="overflow-hidden" inert={open ? undefined : ''}>
          <div className="pt-5">{children}</div>
        </div>
      </div>
    </div>
  )
}

function MessageForm({ artist, onDone }) {
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const toast = useToast()

  const submit = async (e) => {
    e.preventDefault()
    if (msg.trim().length < 5) return setError('Lời nhắn cần ít nhất 5 ký tự.')
    setSending(true)
    try {
      await submitForm('message', { artistId: artist.id, artist: artist.name, from: name.trim(), message: msg.trim() })
      toast(`Đã gửi lời nhắn tới ${artist.name}. Cảm ơn bạn!`)
      onDone()
    } catch {
      setError('Chưa gửi được, bạn thử lại sau nhé.')
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Field id="msg-name" label="Tên của bạn (không bắt buộc)" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={60} />
      <Field
        id="msg-body"
        textarea
        label="Lời nhắn"
        hint={`${msg.length}/300 ký tự`}
        error={error}
        value={msg}
        maxLength={300}
        onChange={(e) => { setMsg(e.target.value); setError('') }}
        placeholder="Điều bạn nhớ nhất trong tiết mục..."
      />
      <Button type="submit" disabled={sending} className="w-full">
        {sending ? 'Đang gửi...' : 'Gửi lời nhắn'}
      </Button>
    </form>
  )
}

export default function Artists() {
  const audio = useAudioPreview()
  const toast = useToast()
  const [soundOn, setSoundOn] = useStoredState('tanda:hoverSound', false)
  const [wanted, setWanted] = useStoredState('tanda:wantAgain', {})
  const [messaging, setMessaging] = useState(null)
  const profile = useProfileRoute()

  const onWant = (a) => {
    const next = !wanted[a.id]
    setWanted({ ...wanted, [a.id]: next })
    if (next) {
      submitForm('want-again', { artistId: a.id, artist: a.name }).catch(() => {})
      toast(`Đã ghi nhận: bạn mong chờ ${a.name}.`)
    }
  }

  /* Đêm sắp tới (hoặc mới nhất) hiện đầy đủ ở đầu, các đêm còn lại xếp từ mới đến cũ */
  const now = Date.now()
  const withArtists = SHOWS.filter((s) => ARTISTS.some((a) => a.showId === s.id))
  const current = withArtists.find((s) => showEnd(s) > now) || withArtists[withArtists.length - 1]
  const ordered = current
    ? [current, ...withArtists.filter((s) => s !== current).sort((a, b) => new Date(b.start) - new Date(a.start))]
    : []

  return (
    <section id="nghe-si" aria-labelledby="artists-title" className="relative bg-night-2/70 py-24 sm:py-32">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal className="max-w-3xl">
            <Eyebrow>Nghệ sĩ Tán Đa</Eyebrow>
            <h2 id="artists-title" className="mt-5 font-serif text-4xl font-bold leading-tight text-cream sm:text-5xl">
              Những thanh âm <span className="italic text-amber">ghé Tán Đa</span>
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-muted">
              Mỗi đêm diễn có một nghệ sĩ khách mời cùng những band nhạc, nghệ sĩ indie trẻ mang ca khúc của chính mình đến gốc đa. Đêm gần nhất ở ngay dưới đây; các đêm trước được thu gọn, mở ra để xem lại gương mặt và tiết mục. Bấm <span className="font-semibold text-amber">Hồ sơ nghệ sĩ</span> để xem giới thiệu, bài hát, ảnh biểu diễn và báo chí.
            </p>
          </Reveal>
          {hasPreview && (
          <Reveal delay={0.1}>
            <button
              onClick={() => { setSoundOn(!soundOn); if (soundOn) audio.stop() }}
              aria-pressed={soundOn}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-night/60 px-5 text-sm text-cream transition-colors hover:border-amber"
            >
              {soundOn ? <Volume2 size={18} className="text-amber" aria-hidden="true" /> : <VolumeX size={18} aria-hidden="true" />}
              Nghe thử khi rê chuột: <strong className={soundOn ? 'text-amber' : 'text-muted'}>{soundOn ? 'Bật' : 'Tắt'}</strong>
            </button>
          </Reveal>
          )}
        </div>

        {ordered.map((show, idx) => {
          const list = ARTISTS.filter((a) => a.showId === show.id)
          const cards = (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-12">
              {list.map((a, i) => (
                <ArtistCard
                  key={a.id}
                  artist={a}
                  show={show}
                  index={i}
                  audio={audio}
                  soundOn={soundOn}
                  onMessage={setMessaging}
                  onProfile={profile.open}
                  wanted={!!wanted[a.id]}
                  onWant={onWant}
                  reveal={idx === 0}
                />
              ))}
            </div>
          )
          if (idx > 0) return <CollapsedShow key={show.id} show={show}>{cards}</CollapsedShow>
          return (
            <div key={show.id} className="mt-14">
              <Reveal className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line pb-4">
                <h3 className="font-serif text-3xl font-black text-amber">{show.dayLabel}</h3>
                <p className="font-serif text-xl italic text-cream">{show.theme}</p>
              </Reveal>
              {cards}
              {ordered.length > 1 && (
                <Reveal className="mt-14 border-b border-line pb-4">
                  <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-muted">Các đêm diễn trước</h3>
                </Reveal>
              )}
            </div>
          )
        })}

        <div className="mt-5 grid">
          <Reveal delay={0.2} className="h-full">
            <a
              href="#de-cu"
              className="organic-b group relative flex min-h-[280px] items-center justify-center overflow-hidden border border-amber/30 bg-card px-6 py-12 text-center transition-colors hover:border-amber sm:min-h-[300px] sm:px-10"
            >
              <MusicStaff />
              {/* quầng tối sau chữ để chữ luôn nổi trên khuông nhạc */}
              <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-[78%] w-[min(92%,680px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(62,42,31,0.92),rgba(62,42,31,0.75)_60%,transparent)]" />
              <span className="relative flex flex-col items-center">
                <span className="block font-serif text-3xl font-bold leading-tight text-cream [text-wrap:balance] sm:text-4xl">
                  Thanh âm tiếp theo <span className="italic text-amber">có thể do bạn chọn.</span>
                </span>
                <span className="mt-5 inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border border-amber/60 bg-night/60 px-5 text-sm font-semibold text-amber sm:px-6 sm:text-base transition-colors group-hover:bg-amber group-hover:text-ink">
                  Đề cử nghệ sĩ bạn muốn nghe
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </span>
            </a>
          </Reveal>
        </div>
      </div>

      <ArtistProfile id={profile.openId} onClose={profile.close} />

      <Modal open={!!messaging} onClose={() => setMessaging(null)} title={messaging ? `Gửi lời nhắn tới ${messaging.name}` : ''}>
        {messaging && <MessageForm artist={messaging} onDone={() => setMessaging(null)} />}
      </Modal>
    </section>
  )
}
