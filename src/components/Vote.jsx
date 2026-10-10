import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, Pause, Play, Send, Shuffle, ThumbsUp } from 'lucide-react'
import { CANDIDATES } from '../data'
import { isUrl, submitForm, useAudioPreview, useStoredState } from '../lib'
import { Button, Eyebrow, Field, Reveal, useToast } from './ui'

const TABS = [
  { id: 'nominate', label: 'Đề cử nghệ sĩ', icon: Send },
  { id: 'vote', label: 'Bình chọn', icon: ThumbsUp },
]
const PAGE = 3

/* ───────── Luồng 1: Đề cử ───────── */
function NominateForm() {
  const empty = { artist: '', link: '', reason: '' }
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const toast = useToast()

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value })
    setErrors({ ...errors, [k]: '' })
  }

  const submit = async (e) => {
    e.preventDefault()
    const err = {}
    if (form.artist.trim().length < 2) err.artist = 'Cho Tán Đa biết tên nghệ sĩ hoặc ban nhạc nhé.'
    if (!isUrl(form.link)) err.link = 'Dán một đường link bắt đầu bằng https:// (Spotify, YouTube, SoundCloud...).'
    if (form.reason.trim().length < 10) err.reason = 'Viết thêm một chút lý do (ít nhất 10 ký tự).'
    setErrors(err)
    if (Object.keys(err).length) {
      document.getElementById(`nom-${Object.keys(err)[0]}`)?.focus()
      return
    }
    setSending(true)
    try {
      await submitForm('nomination', { artist: form.artist.trim(), link: form.link.trim(), reason: form.reason.trim() })
      setDone(true)
      toast(`Cảm ơn bạn đã giới thiệu ${form.artist.trim()} với Tán Đa!`)
    } catch {
      setErrors({ reason: 'Chưa gửi được, bạn thử lại sau nhé.' })
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-start gap-4 py-6">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-amber text-ink">
          <Check size={28} strokeWidth={2.5} aria-hidden="true" />
        </span>
        <h3 className="font-serif text-2xl font-bold text-cream">Đề cử của bạn đã tới Tán Đa.</h3>
        <p className="text-muted">Ban tổ chức sẽ nghe và cân nhắc kết nối nghệ sĩ cho các đêm diễn sắp tới.</p>
        <Button variant="ghost" onClick={() => { setForm(empty); setDone(false) }}>Đề cử thêm một nghệ sĩ</Button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      <Field id="nom-artist" label="Tên nghệ sĩ / ban nhạc" placeholder="VD: một giọng ca bạn nghe mãi" value={form.artist} onChange={set('artist')} error={errors.artist} maxLength={80} />
      <Field id="nom-link" type="url" inputMode="url" label="Link âm nhạc" placeholder="https://" hint="Spotify, YouTube, SoundCloud, TikTok... đều được." value={form.link} onChange={set('link')} error={errors.link} />
      <Field id="nom-reason" textarea label="Vì sao bạn muốn Tán Đa gặp họ?" placeholder="Một bài hát, một khoảnh khắc, một lý do..." value={form.reason} onChange={set('reason')} error={errors.reason} maxLength={500} hint={`${form.reason.length}/500 ký tự`} />
      <Button type="submit" disabled={sending} className="sm:justify-self-start">
        <Send size={18} aria-hidden="true" />
        {sending ? 'Đang gửi đề cử...' : 'Gửi đề cử'}
      </Button>
    </form>
  )
}

/* ───────── Luồng 2: Bình chọn — danh sách luân phiên ───────── */
function VoteList() {
  const reduce = useReducedMotion()
  const audio = useAudioPreview()
  const toast = useToast()
  const [voted, setVoted] = useStoredState('tanda:votes', {})
  const [offset, setOffset] = useState(0)
  const [paused, setPaused] = useState(false)

  const visible = useMemo(
    () => Array.from({ length: Math.min(PAGE, CANDIDATES.length) }, (_, i) => CANDIDATES[(offset + i) % CANDIDATES.length]),
    [offset],
  )
  const next = () => setOffset((o) => (o + PAGE) % CANDIDATES.length)

  /* tự luân phiên mỗi 9s; dừng khi người dùng đang tương tác hoặc bật reduced-motion */
  useEffect(() => {
    if (paused || reduce || audio.playingId) return
    const t = setInterval(next, 9000)
    return () => clearInterval(t)
  }, [paused, reduce, audio.playingId])

  const vote = (c) => {
    if (voted[c.id]) return
    setVoted({ ...voted, [c.id]: true })
    submitForm('vote', { candidateId: c.id, candidate: c.name }).catch(() => {})
    toast(`Bạn đã bình chọn cho ${c.name}.`)
  }

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted">Nghe thử rồi chọn những gương mặt bạn muốn gặp.</p>
        <button
          onClick={next}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-line px-4 text-sm text-cream transition-colors hover:border-amber hover:text-amber"
        >
          <Shuffle size={16} aria-hidden="true" /> Lượt khác
        </button>
      </div>
      <ul className="grid gap-3" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((c, i) => {
            const isVoted = !!voted[c.id]
            const playing = audio.playingId === c.id
            return (
              <motion.li
                key={c.id}
                layout
                initial={{ opacity: 0, x: reduce ? 0 : 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: reduce ? 0 : -40 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="flex items-center gap-4 rounded-2xl border border-line bg-night/70 p-3 pr-4"
              >
                <img src={c.image} alt="" width="64" height="64" loading="lazy" className="h-16 w-16 shrink-0 rounded-[1rem_0.4rem_1rem_0.4rem] object-cover object-top" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-lg font-bold text-cream">{c.name}</p>
                  <p className="truncate font-mono text-[11px] uppercase tracking-wider text-muted">{c.genre}</p>
                </div>
                <button
                  onClick={() => audio.play(c.id, c.preview) || toast(`Bản nghe thử của ${c.name} sẽ sớm được cập nhật.`)}
                  aria-label={playing ? `Dừng nghe thử ${c.name}` : `Nghe thử ${c.name}`}
                  aria-pressed={playing}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-cream transition-colors hover:border-amber hover:text-amber"
                >
                  {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} className="translate-x-px" aria-hidden="true" />}
                </button>
                <button
                  onClick={() => vote(c)}
                  disabled={isVoted}
                  aria-label={isVoted ? `Đã bình chọn ${c.name}` : `Bình chọn cho ${c.name}`}
                  className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors disabled:cursor-default disabled:opacity-100 ${
                    isVoted ? 'bg-moss text-cream' : 'bg-amber text-ink hover:bg-[#F7C766]'
                  }`}
                >
                  {isVoted ? <Check size={16} aria-hidden="true" /> : <ThumbsUp size={16} aria-hidden="true" />}
                  <span className="hidden sm:inline">{isVoted ? 'Đã chọn' : 'Bình chọn'}</span>
                </button>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>
      <div className="mt-4 flex justify-center gap-1.5" aria-hidden="true">
        {Array.from({ length: Math.ceil(CANDIDATES.length / PAGE) }, (_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-all ${Math.floor(offset / PAGE) === i ? 'w-6 bg-amber' : 'w-1.5 bg-line'}`} />
        ))}
      </div>
    </div>
  )
}

export default function Vote() {
  const [tab, setTab] = useState('nominate')

  const onKey = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    const i = TABS.findIndex((t) => t.id === tab)
    const n = TABS[(i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length]
    setTab(n.id)
    document.getElementById(`tab-${n.id}`)?.focus()
  }

  return (
    <section id="de-cu" aria-labelledby="vote-title" className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden="true" className="absolute -left-40 top-20 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(166,58,40,0.28),transparent_70%)]" />
      <div aria-hidden="true" className="absolute -right-40 bottom-0 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(63,86,52,0.35),transparent_70%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8">
        <Reveal className="lg:col-span-5 lg:pt-6">
          <Eyebrow>Đề cử & Bình chọn</Eyebrow>
          <h2 id="vote-title" className="mt-5 font-serif text-4xl font-bold leading-tight text-cream sm:text-5xl">
            Playlist của bạn có thể là <span className="glow-amber italic text-amber">cuộc gặp tiếp theo</span> của Tán Đa.
          </h2>
          <p className="mt-6 text-[17px] leading-relaxed text-muted">
            Có một giọng ca bạn nghe mãi? Một ban nhạc bạn muốn nhiều người biết đến? Hãy giới thiệu họ với Tán Đa và bình chọn cho những gương mặt bạn muốn gặp trong các đêm diễn sắp tới.
          </p>
          <ol className="mt-8 space-y-3 text-sm text-cream/90">
            {['Đề cử nghệ sĩ bạn yêu thích', 'Nghe thử & bình chọn gương mặt mới', 'Gặp nhau dưới Tán Đa'].map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full border border-amber/50 font-mono text-xs text-amber">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="organic-b border border-line bg-card/90 p-5 shadow-[0_40px_100px_-40px_rgba(242,181,68,0.3)] backdrop-blur sm:p-8">
            <div role="tablist" aria-label="Đề cử hoặc bình chọn" onKeyDown={onKey} className="mb-7 grid grid-cols-2 gap-1 rounded-full border border-line bg-night/80 p-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  id={`tab-${t.id}`}
                  role="tab"
                  aria-selected={tab === t.id}
                  aria-controls={`panel-${t.id}`}
                  tabIndex={tab === t.id ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  className={`relative inline-flex min-h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors ${
                    tab === t.id ? 'text-ink' : 'text-muted hover:text-cream'
                  }`}
                >
                  {tab === t.id && (
                    <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-amber" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                  )}
                  <t.icon size={16} className="relative" aria-hidden="true" />
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>

            {TABS.map((t) => (
              <div key={t.id} id={`panel-${t.id}`} role="tabpanel" aria-labelledby={`tab-${t.id}`} hidden={tab !== t.id}>
                {tab === t.id && (t.id === 'nominate' ? <NominateForm /> : <VoteList />)}
              </div>
            ))}

            <p className="mt-7 border-t border-line pt-5 text-xs leading-relaxed text-muted">
              Bình chọn là một cơ sở để Tán Đa lựa chọn và kết nối nghệ sĩ. Danh sách biểu diễn chính thức sẽ được công bố sau khi xác nhận cùng nghệ sĩ.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
