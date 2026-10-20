import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Bell, CalendarPlus, Clock, Download, MapPin, Mic, Share2, Timer } from 'lucide-react'
import pho from '../assets/kv/pho-hang-mam.webp'
import { SHOWS, lineupOf, showEnd } from '../data'
import { calendarLinks, isEmail, isPhone, submitForm } from '../lib'
import { Button, Eyebrow, Field, Reveal, useToast } from './ui'

function ReminderForm({ id = 'reminder', upcoming }) {
  const [contact, setContact] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const toast = useToast()

  const submit = async (e) => {
    e.preventDefault()
    if (!isEmail(contact) && !isPhone(contact)) {
      setError('Nhập email hoặc số điện thoại Việt Nam hợp lệ.')
      document.getElementById(`${id}-contact`)?.focus()
      return
    }
    setSending(true)
    try {
      await submitForm('reminder', { contact: contact.trim() })
      setDone(true)
      toast(upcoming ? 'Đã lưu! Tán Đa sẽ nhắc bạn trước giờ diễn.' : 'Đã lưu! Tán Đa sẽ báo bạn khi cuộc hẹn mới được mở.')
    } catch {
      setError('Chưa gửi được, bạn thử lại sau nhé.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="organic-c border border-amber/30 bg-night/85 p-6 backdrop-blur sm:p-8">
      <p className="font-serif text-xl font-bold leading-snug text-cream sm:text-2xl">
        {upcoming ? 'Để lại thông tin, Tán Đa nhắc bạn trước giờ diễn.' : 'Để lại thông tin, Tán Đa báo bạn khi cuộc hẹn mới được mở.'}
      </p>
      {done ? (
        <p className="mt-4 flex items-center gap-2 text-moss-text">
          <Bell size={18} aria-hidden="true" /> Đã ghi nhận <strong className="text-cream">{contact}</strong>. Hẹn gặp bạn dưới Tán Đa!
        </p>
      ) : (
        <form onSubmit={submit} noValidate className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start">
          <Field
            id={`${id}-contact`}
            className="flex-1"
            label="Email hoặc số điện thoại"
            placeholder="ban@email.com / 09xx xxx xxx"
            autoComplete="email"
            value={contact}
            onChange={(e) => { setContact(e.target.value); setError('') }}
            error={error}
          />
          <Button type="submit" disabled={sending} className="sm:mt-7">
            <Bell size={18} aria-hidden="true" />
            {sending ? 'Đang lưu...' : 'Báo tôi nhé'}
          </Button>
        </form>
      )}
    </div>
  )
}

function Ticket({ show, past }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className="relative mx-auto max-w-5xl"
      initial={{ rotate: reduce ? 0 : -1.2 }}
      whileHover={reduce ? undefined : { rotate: 0, y: -4 }}
      transition={{ type: 'spring', stiffness: 150, damping: 16 }}
    >
      <span className="tape -top-3 left-10 -rotate-3 z-10" aria-hidden="true" />
      <span className="tape -bottom-3 right-24 rotate-[4deg] z-10" aria-hidden="true" />

      <div className="flex flex-col overflow-hidden rounded-3xl shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] md:flex-row">
        {/* thân vé */}
        <div className="relative flex flex-1 bg-cream text-ink">
          <div className="hidden w-12 shrink-0 items-center justify-center bg-brick sm:flex" aria-hidden="true">
            <span className="rotate-180 font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-cream [writing-mode:vertical-rl]">
              Vé vào cửa · Tán Đa
            </span>
          </div>
          <div className={`relative flex-1 p-6 sm:p-9 ${past ? 'pb-20 sm:pb-20' : ''}`}>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-brick">Cuộc hẹn sắp tới</p>
            <h3 className="mt-3 font-serif text-4xl font-black italic leading-none sm:text-5xl lg:text-6xl">{show.title}</h3>
            <p className="mt-3 font-serif text-lg italic text-ink/75">{show.theme}</p>

            <dl className="mt-8 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink/60"><Clock size={14} aria-hidden="true" /> Thời gian</dt>
                <dd className="mt-1 text-xl font-bold">
                  {show.timeLabel && <span className="whitespace-nowrap">{show.timeLabel} · </span>}
                  <span className="whitespace-nowrap">{show.dateLabel}</span>
                  <span className="block text-sm font-normal text-ink/70">{show.timeLabel ? show.durationLabel : 'Giờ diễn đang cập nhật'}</span>
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink/60"><MapPin size={14} aria-hidden="true" /> Địa điểm</dt>
                <dd className="mt-1 text-xl font-bold">
                  <a href={show.mapUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-brick decoration-2 underline-offset-4 hover:text-brick">
                    {show.venue}
                  </a>
                  <span className="block text-sm font-normal text-ink/70">Hoàn Kiếm, Hà Nội</span>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink/60"><Mic size={14} aria-hidden="true" /> Nghệ sĩ góp mặt</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {lineupOf(show.id).length ? (
                    lineupOf(show.id).map((a) => (
                      <span key={a} className="rounded-full border-2 border-ink px-3 py-1 text-sm font-semibold">{a}</span>
                    ))
                  ) : (
                    <span className="text-[15px] text-ink/75">Sẽ công bố sau khi xác nhận cùng nghệ sĩ.</span>
                  )}
                </dd>
              </div>
            </dl>

            {past && (
              <div aria-label="Đêm diễn đã diễn ra" className="pointer-events-none absolute bottom-5 right-5 rotate-[-10deg] rounded-lg border-[3px] border-brick px-3 py-1 font-mono text-sm font-bold uppercase tracking-widest text-brick opacity-85 sm:right-10 sm:text-base">
                Đã diễn ra
              </div>
            )}
          </div>
        </div>

        {/* đường răng cưa */}
        <div aria-hidden="true" className="ticket-perf h-6 w-full bg-cream [background-size:22px_100%] [background-position:center] md:h-auto md:w-6 md:[background-size:100%_22px]" />

        {/* cuống vé */}
        <div className="relative flex shrink-0 flex-row items-center justify-between gap-4 bg-amber p-6 text-ink md:w-60 md:flex-col md:items-start md:justify-center md:p-8">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-ink/70">Hẹn lúc</p>
            <p className="font-serif text-5xl font-black leading-none">{show.timeLabel || show.dayLabel}</p>
            <p className="mt-1 font-mono text-lg font-bold">{show.timeLabel ? show.dateLabel : 'Giờ: đang cập nhật'}</p>
          </div>
          <div className="w-28 md:mt-6 md:w-full">
            <div className="barcode h-12 w-full" aria-hidden="true" />
            <p className="mt-1 font-mono text-[10px] tracking-[0.3em] text-ink/70">71·HANG·TRONG</p>
          </div>
        </div>
      </div>

      {/* sticker kiểu sơn xịt */}
      <motion.span
        aria-hidden="true"
        className="absolute -right-2 -top-6 rotate-12 rounded-full bg-brick px-4 py-2 font-serif text-lg font-bold italic text-cream shadow-lg sm:-right-6 sm:text-xl"
        animate={reduce ? undefined : { rotate: [12, 6, 12] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        Rủ bạn nhé!
      </motion.span>
    </motion.div>
  )
}

/* Lịch các đêm trong tháng của đêm kế tiếp — chương trình từng phần + nghệ sĩ */
const COUNT = ['', 'Một', 'Hai', 'Ba', 'Bốn', 'Năm']
function Schedule({ nextId }) {
  const ref = SHOWS.find((s) => s.id === nextId) || SHOWS[SHOWS.length - 1] // hết lịch → tháng của đêm cuối
  if (!ref) return null
  const month = ref.start.slice(0, 7) // 'YYYY-MM'
  const shows = SHOWS.filter((s) => s.start.startsWith(month))
  if (shows.length < 2) return null
  const now = Date.now()
  return (
    <div className="mx-auto mt-20 max-w-5xl">
      <Reveal className="text-center">
        <h3 className="font-serif text-3xl font-bold text-cream sm:text-4xl">
          Lịch Tán Đa <span className="italic text-amber">tháng {Number(month.slice(5))}</span>
        </h3>
        <p className="mt-3 text-muted">{COUNT[shows.length] || shows.length} cuộc hẹn dưới gốc đa 305 tuổi trong khuôn viên Báo Nhân Dân, mỗi đêm khoảng 75–90 phút.</p>
      </Reveal>
      <ol className="mt-10 grid gap-5 md:grid-cols-2">
        {shows.map((s, i) => {
          const done = now > showEnd(s)
          const isNext = s.id === nextId
          return (
            <Reveal as="li" key={s.id} delay={0.08 * i} className={`${i % 2 ? 'organic-b' : 'organic-a'} relative flex flex-col border bg-card p-6 sm:p-8 ${isNext ? 'border-amber/60' : 'border-line'}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-serif text-4xl font-black leading-none text-cream">{s.dayLabel}</p>
                <span className={`rounded-full px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider ${done ? 'border border-line text-muted' : isNext ? 'bg-amber text-ink' : 'bg-moss text-cream'}`}>
                  {done ? 'Đã diễn ra' : isNext ? 'Đêm kế tiếp' : 'Sắp diễn ra'}
                </span>
              </div>
              <p className="mt-3 font-serif text-lg italic text-amber">{s.theme}</p>
              <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5"><Clock size={14} aria-hidden="true" /> {s.timeLabel ? `${s.timeLabel} · ${s.dateLabel}` : `${s.dateLabel} · giờ đang cập nhật`}</span>
                <span className="inline-flex items-center gap-1.5"><Timer size={14} aria-hidden="true" /> {s.durationLabel}</span>
              </p>
              <ul className="mt-6 space-y-4 border-t border-line pt-5">
                {s.parts.map((p) => (
                  <li key={p.title}>
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-cream">{p.title}</p>
                    <p className="mt-1 text-[15px] leading-relaxed text-muted">{p.text}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Nghệ sĩ góp mặt</p>
                <p className="mt-2 flex flex-wrap gap-2">
                  {lineupOf(s.id).map((a) => (
                    <span key={a} className="rounded-full border border-cream/30 px-3 py-1 text-sm font-semibold text-cream">{a}</span>
                  ))}
                </p>
              </div>
            </Reveal>
          )
        })}
      </ol>
    </div>
  )
}

export default function NextShow() {
  const toast = useToast()
  const [calOpen, setCalOpen] = useState(false)
  const [remindOpen, setRemindOpen] = useState(false)
  const remindRef = useRef(null)
  /* đêm gần nhất chưa kết thúc; hết lịch → đêm cuối cùng (hiện dấu "Đã diễn ra") */
  const now = Date.now()
  const show = SHOWS.find((s) => showEnd(s) > now) || SHOWS[SHOWS.length - 1] || null
  const past = show ? now > showEnd(show) : false
  const links = show ? calendarLinks(show) : null
  const showReminder = !show || past || remindOpen

  const openReminder = () => {
    setRemindOpen(true)
    setTimeout(() => {
      remindRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      document.getElementById('reminder-contact')?.focus({ preventScroll: true })
    }, 80)
  }

  const share = async () => {
    /* window.TANDA_SHARE_URL: link công khai của trang (dùng khi trang chạy trong khung nhúng, VD bản demo) */
    const base = window.TANDA_SHARE_URL || window.location.href.split('#')[0]
    const data = {
      title: 'Tán Đa Show — Hẹn dưới Tán Đa',
      text: show ? `Đi Tán Đa với mình nhé! ${show.timeLabel ? show.timeLabel + ' ' : ''}${show.dateLabel} tại ${show.address}.` : 'Đi Tán Đa với mình nhé!',
      url: base + '#dem-dien',
    }
    if (navigator.share) {
      try {
        await navigator.share(data)
        return
      } catch (e) {
        if (e?.name === 'AbortError') return
        /* trình duyệt từ chối chia sẻ → chuyển sang sao chép */
      }
    }
    try {
      await navigator.clipboard.writeText(`${data.text} ${data.url}`)
      toast('Đã sao chép lời rủ, dán gửi bạn bè thôi!')
    } catch {
      toast(`Gửi bạn bè đường dẫn này nhé: ${data.url}`)
    }
  }

  return (
    <section id="dem-dien" aria-labelledby="show-title" className="relative isolate overflow-hidden py-24 sm:py-32">
      {/* nền phố đêm — tranh phố Hàng Mâm phủ tối + duotone amber */}
      <img src={pho} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30 grayscale" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#2B1A12_0%,rgba(43,26,18,0.82)_30%,rgba(43,26,18,0.88)_70%,#2B1A12_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-amber/10 mix-blend-color" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">Đêm diễn tiếp theo</Eyebrow>
          <h2 id="show-title" className="mt-5 font-serif text-4xl font-bold leading-tight text-cream sm:text-5xl">
            Cuộc hẹn <span className="italic text-amber">sắp tới</span>
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-muted">
            Một tối ra phố. Một cuộc hẹn với âm nhạc. Xem lịch Tán Đa tiếp theo và rủ một người bạn cùng đến.
          </p>
        </Reveal>

        {show && (
          <>
            <Reveal delay={0.1} className="mt-16">
              <Ticket show={show} past={past} />
            </Reveal>

            <Reveal delay={0.15} className="mx-auto mt-12 flex max-w-5xl flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Button variant="primary" onClick={openReminder} aria-expanded={showReminder} aria-controls="reminder-box">
                <Bell size={18} aria-hidden="true" /> {past ? 'Nhắc tôi khi có lịch' : 'Nhắc tôi trước giờ diễn'}
              </Button>
              <div className="relative">
                <Button variant="ghost" className="w-full" onClick={() => setCalOpen((v) => !v)} aria-expanded={calOpen} aria-controls="cal-menu">
                  <CalendarPlus size={18} aria-hidden="true" /> Thêm vào lịch
                </Button>
                <AnimatePresence>
                  {calOpen && (
                    <motion.div
                      id="cal-menu"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-1/2 top-full z-20 mt-2 w-60 -translate-x-1/2 overflow-hidden rounded-2xl border border-line bg-card shadow-2xl"
                    >
                      <a href={links.google} target="_blank" rel="noopener noreferrer" onClick={() => setCalOpen(false)} className="flex min-h-12 items-center gap-2 px-4 text-sm text-cream hover:bg-night hover:text-amber">
                        <CalendarPlus size={16} aria-hidden="true" /> Google Calendar
                      </a>
                      <a href={links.icsUrl} download="tan-da-show.ics" onClick={() => setCalOpen(false)} className="flex min-h-12 items-center gap-2 border-t border-line px-4 text-sm text-cream hover:bg-night hover:text-amber">
                        <Download size={16} aria-hidden="true" /> Tải file lịch (.ics)
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Button variant="subtle" onClick={share}>
                <Share2 size={18} aria-hidden="true" /> Rủ bạn cùng đi
              </Button>
            </Reveal>
          </>
        )}

        <AnimatePresence>
          {showReminder && (
            <motion.div
              id="reminder-box"
              ref={remindRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mx-auto mt-10 max-w-3xl overflow-hidden"
            >
              <ReminderForm upcoming={!!show && !past} />
            </motion.div>
          )}
        </AnimatePresence>

        <Schedule nextId={past ? null : show?.id} />
      </div>
    </section>
  )
}
