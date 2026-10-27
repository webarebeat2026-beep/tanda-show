import { useState } from 'react'
import { ArrowUpRight, ChevronDown, Pin } from 'lucide-react'
import { fmtDate, imageSrc, safeHref, useLiveContent } from '../content'
import { Button, Eyebrow, Modal, Reveal } from './ui'

const PAGE = 3

/* Ảnh của tin (kèm khung) — link lỗi thì ẩn cả khung, thẻ vẫn đọc được bằng chữ */
function NewsImage({ src, frame, className = '', fit = 'cover' }) {
  const [broken, setBroken] = useState(false)
  if (!src || broken) return null
  return (
    <div className={frame}>
      <img
        src={imageSrc(src)}
        alt=""
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        className={`${fit === 'cover' ? 'h-full w-full object-cover' : 'h-auto max-h-[52vh] w-full object-contain'} ${className}`}
      />
    </div>
  )
}

function Meta({ item }) {
  return (
    <p className="relative flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em]">
      {item.pinned && (
        <span className="inline-flex items-center gap-1 text-amber">
          <Pin size={13} aria-hidden="true" />
          Tin ghim
        </span>
      )}
      {item.pinned && item.date && <span aria-hidden="true" className="h-px w-4 bg-line" />}
      {item.date && <time dateTime={item.date} className="text-muted">{fmtDate(item.date)}</time>}
    </p>
  )
}

/* Cả thẻ bấm được (nút ở tiêu đề phủ kín thẻ) → mở hộp đọc toàn tin */
function NewsCard({ item, featured = false, onOpen }) {
  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden border border-line bg-card transition-colors duration-200 hover:border-amber/60 focus-within:border-amber ${
        featured ? 'organic-a lg:has-[img]:grid lg:has-[img]:grid-cols-[1.15fr_1fr]' : 'organic-d'
      }`}
    >
      <NewsImage
        src={item.image}
        frame={`overflow-hidden bg-night ${featured ? 'aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-80' : 'aspect-[16/10]'}`}
        className="saturate-[0.9] transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]"
      />
      <div className={`flex flex-1 flex-col ${featured ? 'p-6 sm:p-8 lg:p-10' : 'p-5 sm:p-6'}`}>
        <Meta item={item} />
        <h3 className={`mt-3 font-serif font-bold leading-snug text-cream ${featured ? 'text-2xl sm:text-3xl' : 'line-clamp-3 text-xl'}`}>
          <button
            type="button"
            onClick={() => onOpen(item)}
            className="cursor-pointer text-left transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-amber focus:outline-none"
          >
            {item.title}
          </button>
        </h3>
        {item.body && (
          <p className={`mt-3 whitespace-pre-line text-[15px] leading-relaxed text-muted ${featured ? 'line-clamp-6' : 'line-clamp-3'}`}>{item.body}</p>
        )}
        <span aria-hidden="true" className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-cream/90 group-hover:text-amber">
          Đọc tin
          <ArrowUpRight size={16} className="transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  )
}

export default function News() {
  const live = useLiveContent()
  const [limit, setLimit] = useState(PAGE)
  const [open, setOpen] = useState(null)

  const news = live?.news || []
  if (!news.length) return null
  const [featured, ...rest] = news
  const shown = rest.slice(0, limit)
  const link = open && safeHref(open.link)

  return (
    <section id="tin-tuc" aria-labelledby="news-title" className="relative overflow-hidden bg-night-2/70 py-24 sm:py-32">
      <div aria-hidden="true" className="absolute -left-48 top-20 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(166,58,40,0.18),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Eyebrow>Tin tức</Eyebrow>
          <h2 id="news-title" className="mt-5 font-serif text-4xl font-bold leading-tight text-cream sm:text-5xl">
            Tin mới <span className="glow-amber italic text-amber">từ Tán Đa</span>.
          </h2>
        </Reveal>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <li className="sm:col-span-2 lg:col-span-3">
            <NewsCard item={featured} featured onOpen={setOpen} />
          </li>
          {shown.map((item) => (
            <li key={item.id}>
              <NewsCard item={item} onOpen={setOpen} />
            </li>
          ))}
        </ul>

        {rest.length > PAGE && (
          <div className="mt-10 flex justify-center">
            {rest.length > limit ? (
              <Button variant="ghost" onClick={() => setLimit(limit + PAGE)}>
                Xem thêm {Math.min(PAGE, rest.length - limit)} tin
                <ChevronDown size={18} aria-hidden="true" />
              </Button>
            ) : (
              <Button variant="subtle" onClick={() => { setLimit(PAGE); document.getElementById('tin-tuc')?.scrollIntoView() }}>
                Thu gọn
              </Button>
            )}
          </div>
        )}
      </div>

      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.title} wide>
        {open && (
          <div>
            <Meta item={open} />
            <NewsImage src={open.image} frame="mt-5 overflow-hidden rounded-xl bg-night" fit="contain" />
            {open.body && <p className="mt-5 whitespace-pre-line text-[16px] leading-relaxed text-cream/90">{open.body}</p>}
            {link && (
              <Button as="a" href={link} target="_blank" rel="noopener noreferrer" className="mt-7">
                {open.linkLabel || 'Xem chi tiết'}
                <ArrowUpRight size={18} aria-hidden="true" />
                <span className="sr-only">(mở tab mới)</span>
              </Button>
            )}
          </div>
        )}
      </Modal>
    </section>
  )
}
