import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'
import tree from '../assets/kv/tree.webp'
import logoTanDa from '../assets/logo/tan-da.webp'
import { SHOWS, showEnd } from '../data'
import { Button } from './ui'

/* Toạ độ cố định (không random mỗi lần render) cho các đốm nắng / đom đóm / nốt nhạc */
const SPOTS = [
  { x: '62%', y: '30%', s: 150, d: 7 },
  { x: '71%', y: '22%', s: 110, d: 9 },
  { x: '78%', y: '40%', s: 170, d: 8 },
  { x: '86%', y: '28%', s: 120, d: 10 },
  { x: '68%', y: '52%', s: 130, d: 7.5 },
  { x: '83%', y: '58%', s: 150, d: 11 },
  { x: '92%', y: '44%', s: 100, d: 8.5 },
  { x: '57%', y: '46%', s: 90, d: 9.5 },
  { x: '74%', y: '68%', s: 110, d: 10.5 },
  { x: '22%', y: '20%', s: 220, d: 13 },
  { x: '40%', y: '70%', s: 180, d: 12 },
]
const FIREFLIES = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 53) % 100}%`,
  top: `${30 + ((i * 37) % 60)}%`,
  size: 2 + (i % 3),
  dur: 6 + (i % 5) * 1.6,
  delay: (i % 7) * 0.9,
}))
const NOTES = [
  { left: '52%', top: '62%', glyph: '♪', size: 28, dur: 9, delay: 0 },
  { left: '86%', top: '70%', glyph: '♫', size: 34, dur: 11, delay: 2 },
  { left: '68%', top: '78%', glyph: '♩', size: 24, dur: 8, delay: 4 },
  { left: '94%', top: '40%', glyph: '♪', size: 22, dur: 10, delay: 1 },
  { left: '44%', top: '84%', glyph: '♬', size: 30, dur: 12, delay: 5 },
]

/* Ánh sáng xuyên kẽ lá: các đốm nắng amber lấp lánh, trôi chậm quanh tán cây */
function DappledLight() {
  const reduce = useReducedMotion()
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {SPOTS.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full mix-blend-screen"
          style={{
            left: p.x,
            top: p.y,
            width: p.s,
            height: p.s,
            marginLeft: -p.s / 2,
            marginTop: -p.s / 2,
            background: 'radial-gradient(circle, rgba(255,214,130,0.5) 0%, rgba(242,181,68,0.16) 35%, transparent 66%)',
            filter: 'blur(4px)',
          }}
          animate={reduce ? undefined : { x: [0, 26, -18, 0], y: [0, -14, 12, 0], opacity: [0.55, 1, 0.65, 0.55], scale: [1, 1.12, 0.94, 1] }}
          transition={{ duration: p.d, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {FIREFLIES.map((f, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-amber"
          style={{ left: f.left, top: f.top, width: f.size, height: f.size, boxShadow: '0 0 10px 2px rgba(242,181,68,0.7)' }}
          animate={reduce ? { opacity: 0.6 } : { y: [0, -60, -120], opacity: [0, 1, 0] }}
          transition={{ duration: f.dur, delay: f.delay, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {NOTES.map((n, i) => (
        <motion.span
          key={i}
          className="absolute font-serif text-amber/70"
          style={{ left: n.left, top: n.top, fontSize: n.size, textShadow: '0 0 14px rgba(242,181,68,0.6)' }}
          animate={reduce ? { opacity: 0.5 } : { y: [0, -140], x: [0, 18, -8], opacity: [0, 0.9, 0], rotate: [0, 12, -6] }}
          transition={{ duration: n.dur, delay: n.delay, repeat: Infinity, ease: 'easeOut' }}
        >
          {n.glyph}
        </motion.span>
      ))}
    </div>
  )
}

export default function Hero() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const treeY = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 90])
  const upcoming = SHOWS.filter((s) => showEnd(s) > Date.now())

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-20 pt-28 lg:pt-24">
      {/* quầng sáng ấm phía sau cây */}
      <div aria-hidden="true" className="absolute -right-40 top-1/4 -z-10 h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(242,181,68,0.32),rgba(201,134,42,0.12)_40%,transparent_70%)] lg:right-[-6%]" />

      {/* Artwork cây đa phát sáng (từ KV Tán Đa) */}
      <motion.div
        aria-hidden="true"
        style={{ y: treeY }}
        className="absolute bottom-0 left-1/2 -z-10 w-[160%] max-w-none -translate-x-1/2 opacity-80 sm:w-[110%] lg:left-auto lg:right-0 lg:w-[58%] lg:translate-x-0 lg:opacity-100"
      >
        <img
          src={tree}
          alt=""
          width="1080"
          height="760"
          className="h-auto w-full [mask-image:radial-gradient(ellipse_56%_62%_at_50%_54%,#000_22%,rgba(0,0,0,0.55)_48%,rgba(0,0,0,0.15)_64%,transparent_78%)]"
        />
      </motion.div>

      <DappledLight />

      {/* gradient đè để chữ luôn đọc rõ */}
      <div aria-hidden="true" className="absolute inset-0 -z-[5] bg-[linear-gradient(90deg,rgba(14,11,9,0.92)_0%,rgba(14,11,9,0.65)_45%,rgba(14,11,9,0)_75%)] max-lg:bg-[linear-gradient(180deg,rgba(14,11,9,0.35)_0%,rgba(14,11,9,0.78)_40%,rgba(14,11,9,0.78)_75%,rgba(14,11,9,0.4)_100%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl lg:max-w-3xl">
          <img
            src={logoTanDa}
            alt="Tán Đa Show"
            width="720"
            height="326"
            style={{ '--d': '0.09s' }}
            className="rise mb-8 h-auto w-[220px] sm:w-[280px] lg:-mt-3 lg:w-[340px]"
          />
          <p style={{ '--d': '0.15s' }} className="rise mb-6 inline-flex items-center gap-2 rounded-full border border-amber/30 bg-night/60 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-amber backdrop-blur">
            <MapPin size={14} aria-hidden="true" />
            Báo Nhân Dân × BEAT Network · 71 Hàng Trống
          </p>

          <h1 id="hero-title" style={{ '--d': '0.21s' }} className="rise font-serif text-[2.6rem] font-black leading-[1.05] tracking-tight text-cream sm:text-6xl lg:text-[4.25rem]">
            Hẹn dưới <em className="glow-amber font-bold text-amber">Tán Đa.</em>
            <br />
            <span className="font-medium italic text-cream/95 lg:whitespace-nowrap">Nghe những thanh âm mới.</span>
          </h1>

          <p style={{ '--d': '0.27s' }} className="rise mt-7 max-w-xl text-[17px] leading-relaxed text-muted sm:text-lg">
            Giữa nhịp phố, Tán Đa mở một khoảng không cho âm nhạc và những cuộc gặp. Nơi khán giả tìm thấy một nghệ sĩ mình chưa từng nghe, nghệ sĩ tìm thấy những người muốn lắng nghe, và mỗi đêm diễn để lại một điều đáng nhớ.
          </p>

          <div style={{ '--d': '0.39s' }} className="rise mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button as="a" href="#dem-dien" variant="primary" className="px-7">
              Khám phá đêm diễn tiếp theo
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
            <Button as="a" href="#de-cu" variant="ghost" className="px-7">
              Đề cử nghệ sĩ bạn muốn nghe
            </Button>
          </div>

          {upcoming.length > 0 && (
            <ul style={{ '--d': '0.45s' }} className="rise mt-8 flex flex-col gap-2 font-mono text-xs uppercase tracking-wider text-cream/85 sm:flex-row sm:flex-wrap sm:gap-x-6">
              {upcoming.map((s) => (
                <li key={s.id} className="flex items-center gap-2">
                  <CalendarDays size={14} className="text-amber" aria-hidden="true" />
                  <span><strong className="text-amber">{s.timeLabel ? `${s.timeLabel} · ` : ''}{s.dayLabel}</strong> · {s.shortTheme}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
