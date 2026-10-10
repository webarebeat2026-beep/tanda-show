import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Heart, MessageCircle, Pause, Play, CirclePlay, Volume2, VolumeX } from 'lucide-react'
import { ARTISTS, SHOWS } from '../data'
import { submitForm, useAudioPreview, useStoredState } from '../lib'
import { Button, Eyebrow, Field, Modal, Reveal, useToast } from './ui'

const TONES = {
  amber: { wash: '#F2B544', chip: 'bg-amber text-ink', glow: 'rgba(242,181,68,0.55)' },
  brick: { wash: '#A63A28', chip: 'bg-brick text-cream', glow: 'rgba(232,115,90,0.5)' },
  moss: { wash: '#3F5634', chip: 'bg-moss text-cream', glow: 'rgba(163,190,140,0.45)' },
}

/* Bố cục organic bento trên desktop, lặp cho từng đêm diễn:
   thẻ 1 (nghệ sĩ khách mời): dọc, cao 2 hàng · thẻ 2-3: ngang, so le ảnh trái/phải */
const LAYOUT = [
  { grid: 'sm:col-span-2 lg:col-span-5 lg:row-span-2', shape: 'organic-a', horizontal: false },
  { grid: 'lg:col-span-7', shape: 'organic-b', horizontal: true },
  { grid: 'lg:col-span-7', shape: 'organic-c', horizontal: true, reverse: true },
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
        className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(14,11,9,0.25)_0_1px,transparent_1px_4px)]"
        variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
      />
      <div aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card via-card/40 to-transparent ${horizontal ? 'lg:hidden' : ''}`} />
    </div>
  )
}

function ArtistCard({ artist, show, index, audio, soundOn, onMessage, wanted, onWant }) {
  const tone = TONES[artist.tone]
  const toast = useToast()
  const playing = audio.playingId === artist.id
  const L = LAYOUT[index % LAYOUT.length]

  const togglePreview = () => {
    if (!audio.play(artist.id, artist.preview)) toast(`Bản nghe thử của ${artist.name} sẽ sớm được cập nhật.`)
  }

  return (
    <Reveal delay={0.06 * index} className={`${L.grid} h-full`}>
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
    </Reveal>
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

  const onWant = (a) => {
    const next = !wanted[a.id]
    setWanted({ ...wanted, [a.id]: next })
    if (next) {
      submitForm('want-again', { artistId: a.id, artist: a.name }).catch(() => {})
      toast(`Đã ghi nhận: bạn mong chờ ${a.name}.`)
    }
  }

  return (
    <section id="nghe-si" aria-labelledby="artists-title" className="relative bg-night-2 py-24 sm:py-32">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal className="max-w-3xl">
            <Eyebrow>Nghệ sĩ tháng 10</Eyebrow>
            <h2 id="artists-title" className="mt-5 font-serif text-4xl font-bold leading-tight text-cream sm:text-5xl">
              Những thanh âm <span className="italic text-amber">ghé Tán Đa tháng này</span>
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-muted">
              Mỗi đêm diễn có một nghệ sĩ khách mời cùng những band nhạc, nghệ sĩ indie trẻ mang ca khúc của chính mình đến gốc đa. Khám phá gương mặt và tiết mục của từng đêm.
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

        {SHOWS.map((show) => {
          const list = ARTISTS.filter((a) => a.showId === show.id)
          if (!list.length) return null
          return (
            <div key={show.id} className="mt-14">
              <Reveal className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line pb-4">
                <h3 className="font-serif text-3xl font-black text-amber">{show.dayLabel}</h3>
                <p className="font-serif text-xl italic text-cream">{show.theme}</p>
              </Reveal>
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
                    wanted={!!wanted[a.id]}
                    onWant={onWant}
                  />
                ))}
              </div>
            </div>
          )
        })}

        <div className="mt-5 grid">
          <Reveal delay={0.2} className="h-full">
            <a
              href="#de-cu"
              className="organic-b group relative flex h-full min-h-[200px] flex-col justify-between gap-6 overflow-hidden sm:flex-row sm:items-end border border-amber/30 bg-[radial-gradient(circle_at_80%_20%,rgba(242,181,68,0.22),transparent_60%)] p-7 transition-colors hover:border-amber sm:p-9"
            >
              <span aria-hidden="true" className="font-serif text-7xl leading-none text-amber/80">♫</span>
              <span>
                <span className="block font-serif text-3xl font-bold leading-tight text-cream">
                  Thanh âm tiếp theo <span className="italic text-amber">có thể do bạn chọn.</span>
                </span>
                <span className="mt-4 inline-flex items-center gap-2 font-semibold text-amber">
                  Đề cử nghệ sĩ bạn muốn nghe
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </span>
            </a>
          </Reveal>
        </div>
      </div>

      <Modal open={!!messaging} onClose={() => setMessaging(null)} title={messaging ? `Gửi lời nhắn tới ${messaging.name}` : ''}>
        {messaging && <MessageForm artist={messaging} onDone={() => setMessaging(null)} />}
      </Modal>
    </section>
  )
}
