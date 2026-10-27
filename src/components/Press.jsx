import { useMemo, useState } from 'react'
import { ArrowUpRight, ChevronDown, CirclePlay, Images, Quote } from 'lucide-react'
import { PRESS, PRESS_SHOWS, PRESS_UPDATED } from '../press'
import { fmtDate, imageSrc, safeHref, useLiveContent } from '../content'
import { Button, Eyebrow, Reveal } from './ui'

const PAGE = 6
const KIND = {
  video: { label: 'Video', icon: CirclePlay },
  photo: { label: 'Ảnh', icon: Images },
}

/* Ảnh đại diện của bài — chưa có ảnh thì hiện tên báo trên nền giấy */
function Thumb({ item, featured }) {
  const kind = KIND[item.kind]
  const [broken, setBroken] = useState(false) // ảnh thiếu/lỗi trên máy chủ → hiện thẻ chữ
  return (
    <div className={`relative overflow-hidden bg-night ${featured ? 'aspect-[16/10] lg:aspect-auto lg:h-full' : 'aspect-[16/10]'}`}>
      {item.image && !broken ? (
        <img
          src={imageSrc(item.image)}
          alt=""
          referrerPolicy="no-referrer"
          width="640"
          height="400"
          loading="lazy"
          decoding="async"
          onError={() => setBroken(true)}
          className="h-full w-full object-cover saturate-[0.85] transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]"
        />
      ) : (
        <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(242,181,68,0.18),transparent_60%)]">
          <Quote size={44} className="text-amber/60" aria-hidden="true" />
        </div>
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
      {kind && (
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-night/85 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-amber backdrop-blur">
          <kind.icon size={14} aria-hidden="true" />
          {kind.label}
        </span>
      )}
    </div>
  )
}

function PressCard({ item, featured = false }) {
  return (
    <a
      href={safeHref(item.url)}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex h-full cursor-pointer flex-col overflow-hidden border border-line bg-card transition-colors duration-200 hover:border-amber/60 ${
        featured ? 'organic-a lg:grid lg:grid-cols-[1.15fr_1fr]' : 'organic-d'
      }`}
    >
      <Thumb item={item} featured={featured} />
      <div className={`flex flex-1 flex-col ${featured ? 'p-6 sm:p-8 lg:p-10' : 'p-5 sm:p-6'}`}>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em]">
          <span className="text-amber">{item.outlet}</span>
          <span aria-hidden="true" className="h-px w-4 bg-line" />
          <time dateTime={item.date} className="text-muted">{fmtDate(item.date)}</time>
        </p>
        <h3
          className={`mt-3 font-serif font-bold leading-snug text-cream transition-colors group-hover:text-amber ${
            featured ? 'text-2xl sm:text-3xl' : 'line-clamp-3 text-xl'
          }`}
        >
          {item.title}
        </h3>
        {item.excerpt && (
          <p className={`mt-3 text-[15px] leading-relaxed text-muted ${featured ? 'line-clamp-5' : 'line-clamp-2'}`}>{item.excerpt}</p>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-cream/90 group-hover:text-amber">
          Đọc trên {item.outlet}
          <ArrowUpRight size={16} className="transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
          <span className="sr-only">(mở tab mới)</span>
        </span>
      </div>
    </a>
  )
}

export default function Press() {
  const [chosen, setChosen] = useState('all')
  const [limit, setLimit] = useState(PAGE)

  // Danh sách bài do BTC cập nhật trên Google Sheet; Sheet chưa có bài / chưa tải được thì dùng bản đóng sẵn (src/press.js)
  const live = useLiveContent()
  const fromSheet = live?.press?.length > 0
  const items = fromSheet ? live.press : PRESS
  const shows = fromSheet ? live.shows || [] : PRESS_SHOWS
  const updated = (fromSheet && live.updated) || PRESS_UPDATED

  const outlets = useMemo(() => [...new Set(items.map((a) => a.outlet))], [items])
  const filters = [{ id: 'all', label: 'Tất cả' }, ...shows]
  const filter = filters.some((f) => f.id === chosen) ? chosen : 'all'
  const count = (id) => (id === 'all' ? items.length : items.filter((a) => a.showId === id).length)

  const list = filter === 'all' ? items : items.filter((a) => a.showId === filter)
  const [featured, ...rest] = list
  const shown = rest.slice(0, limit)

  const choose = (id) => {
    setChosen(id)
    setLimit(PAGE)
  }

  if (!items.length) return null

  return (
    <section id="bao-chi" aria-labelledby="press-title" className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden="true" className="absolute -right-48 top-10 h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle,rgba(242,181,68,0.14),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <Eyebrow>Báo chí nói về Tán Đa</Eyebrow>
            <h2 id="press-title" className="mt-5 font-serif text-4xl font-bold leading-tight text-cream sm:text-5xl">
              Những thanh âm dưới tán đa, <span className="glow-amber italic text-amber">qua trang báo</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <dl className="grid grid-cols-2 gap-4">
              <div className="organic-b border border-line bg-card/80 p-5">
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Bài viết</dt>
                <dd className="mt-1 font-serif text-4xl font-bold text-amber">{items.length}</dd>
              </div>
              <div className="organic-c border border-line bg-card/80 p-5">
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted [text-wrap:balance]">Cơ quan báo chí</dt>
                <dd className="mt-1 font-serif text-4xl font-bold text-amber">{outlets.length}</dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <p className="mt-8 flex flex-wrap gap-y-1.5 text-sm leading-relaxed text-muted">
            <span className="sr-only">Các cơ quan báo chí đã đưa tin: </span>
            {outlets.map((o, i) => (
              <span key={o} className="whitespace-nowrap">
                <span className="text-cream/85">{o}</span>
                {i < outlets.length - 1 && <span aria-hidden="true" className="mx-2 text-amber/50">·</span>}
              </span>
            ))}
          </p>
        </Reveal>

        <div role="group" aria-label="Lọc bài theo đêm diễn" className="mt-10 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => choose(f.id)}
              className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors ${
                filter === f.id ? 'border-amber bg-amber text-ink' : 'border-line bg-night-2/70 text-muted hover:border-amber/60 hover:text-cream'
              }`}
            >
              {f.label}
              <span className={`font-mono text-xs ${filter === f.id ? 'text-ink/70' : 'text-muted'}`}>{count(f.id)}</span>
            </button>
          ))}
        </div>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {featured && (
            <li key={featured.url} className="sm:col-span-2 lg:col-span-3">
              <PressCard item={featured} featured />
            </li>
          )}
          {shown.map((item) => (
            <li key={item.url}>
              <PressCard item={item} />
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-center gap-4">
          {rest.length > limit ? (
            <Button variant="ghost" onClick={() => setLimit(limit + PAGE)}>
              Xem thêm {Math.min(PAGE, rest.length - limit)} bài
              <ChevronDown size={18} aria-hidden="true" />
            </Button>
          ) : (
            rest.length > PAGE && (
              <Button variant="subtle" onClick={() => { setLimit(PAGE); document.getElementById('bao-chi')?.scrollIntoView() }}>
                Thu gọn
              </Button>
            )
          )}
          <p className="max-w-2xl text-center text-xs leading-relaxed text-muted">
            Tiêu đề, đoạn mở đầu và ảnh đại diện được trích nguyên từ bài gốc của từng cơ quan báo chí — bấm vào thẻ để đọc toàn bài. Cập nhật {fmtDate(updated)}.
          </p>
        </div>
      </div>
    </section>
  )
}
