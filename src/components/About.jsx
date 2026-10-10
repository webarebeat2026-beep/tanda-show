import { motion, useReducedMotion } from 'framer-motion'
import poster from '../assets/artists/kv-thang10.webp'
import congDong from '../assets/kv/cong-dong.webp'
import sanKhau from '../assets/kv/san-khau.webp'
import space from '../assets/kv/space.webp'
import { SLOGAN } from '../data'
import { Eyebrow, Reveal } from './ui'

const PILLARS = [
  {
    image: congDong,
    pos: 'center 55%',
    title: 'Điểm hẹn cộng đồng',
    text: 'Gặp nhau qua những trải nghiệm nghệ thuật chung.',
    shape: 'organic-a',
    accent: 'bg-amber text-ink',
    ring: 'hover:border-amber/60',
  },
  {
    image: sanKhau,
    pos: 'center 45%',
    title: 'Sân khấu cho nghệ sĩ trẻ',
    text: 'Có cơ hội biểu diễn, được biết đến và kết nối với khán giả.',
    shape: 'organic-b',
    accent: 'bg-brick text-cream',
    ring: 'hover:border-brick-text/60',
  },
  {
    image: space,
    pos: 'center 62%',
    title: 'Không gian khám phá',
    text: 'Tìm thấy những giọng ca, cách thể hiện và cảm hứng mới.',
    shape: 'organic-c',
    accent: 'bg-moss text-cream',
    ring: 'hover:border-moss-text/60',
  },
]

export function SloganMarquee() {
  const items = Array.from({ length: 6 }, () => SLOGAN)
  return (
    <div className="relative overflow-hidden border-y border-line/70 bg-night-2 py-4">
      <p className="sr-only">{SLOGAN}</p>
      <div className="marquee-track flex w-max gap-10 whitespace-nowrap" aria-hidden="true">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-10 font-serif text-xl italic text-cream/80 sm:text-2xl">
            {t}
            <span className="text-amber">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function About() {
  const reduce = useReducedMotion()
  return (
    <section id="ve-tan-da" aria-labelledby="about-title" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        {/* Ô chữ chính */}
        <Reveal className="organic-a relative overflow-hidden border border-line bg-card p-7 sm:p-10 lg:col-span-7">
          <div aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(242,181,68,0.18),transparent_70%)]" />
          <Eyebrow>Vì sao có Tán Đa?</Eyebrow>
          <h2 id="about-title" className="mt-5 font-serif text-3xl font-bold leading-tight text-cream sm:text-[2.6rem]">
            Cho người trẻ một điểm hẹn.{' '}
            <span className="italic text-amber">Cho nghệ sĩ trẻ một cơ hội được nghe.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted">
            Tán Đa Show là không gian âm nhạc cộng đồng do Báo Nhân Dân và BEAT Network cùng xây dựng, hướng tới một điểm hẹn văn hóa dành cho người trẻ giữa phố đi bộ.
          </p>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted">
            Chương trình diễn ra hằng tháng dưới <strong className="font-semibold text-cream">gốc đa 305 tuổi</strong> trong khuôn viên Báo Nhân Dân, số 71 phố Hàng Trống, mở một sân chơi để các band nhạc và nghệ sĩ indie đến gần hơn với cộng đồng.
          </p>
        </Reveal>

        {/* Poster KV dán tường */}
        <Reveal delay={0.1} className="relative lg:col-span-5 lg:row-span-2">
          <motion.figure
            className="relative mx-auto max-w-sm lg:max-w-none"
            initial={{ rotate: reduce ? 0 : -2.5 }}
            whileHover={reduce ? undefined : { rotate: 0, scale: 1.015 }}
            transition={{ type: 'spring', stiffness: 160, damping: 18 }}
          >
            <span className="tape -top-3 left-8 -rotate-6" aria-hidden="true" />
            <span className="tape -top-3 right-8 rotate-6" aria-hidden="true" />
            <img
              src={poster}
              alt="Key visual Tán Đa Show tháng 10: cây đa phát sáng, nốt nhạc bay; 20H 10.10.2026 tại 71 Hàng Trống, Hoàn Kiếm, Hà Nội"
              width="640"
              height="800"
              loading="lazy"
              className="organic-d w-full border border-amber/20 shadow-[0_30px_80px_-30px_rgba(242,181,68,0.45)]"
            />
            <figcaption className="mt-4 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Key visual · Tán Đa Show tháng 10
            </figcaption>
          </motion.figure>
        </Reveal>

        {/* 3 trụ cột */}
        <ul className="grid gap-5 sm:grid-cols-3 lg:col-span-7">
          {PILLARS.map((p, i) => (
            <Reveal as="li" key={p.title} delay={0.08 * i} className={`${p.shape} group relative overflow-hidden border border-line bg-night-2 p-3 pb-6 transition-colors duration-300 ${p.ring}`}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem_0.5rem_1.4rem_0.5rem]">
                <motion.img
                  src={p.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: p.pos }}
                  whileHover={reduce ? undefined : { scale: 1.06 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
                <span aria-hidden="true" className={`absolute left-2.5 top-2.5 grid h-9 w-9 place-items-center rounded-[0.8rem_0.3rem_0.8rem_0.3rem] font-mono text-xs font-bold ${p.accent}`}>
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 px-3 font-serif text-xl font-bold leading-snug text-cream">{p.title}</h3>
              <p className="mt-2 px-3 text-[15px] leading-relaxed text-muted">{p.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
