import { useEffect, useState } from 'react'
import { Modal, useToast } from './ui'
import { SHOWS, showEnd } from '../data'
import { submitForm } from '../lib'

/* Popup hỏi nhanh mỗi lần mở trang: "Bạn đã tới Tán Đa bao nhiêu lần rồi?"
   Số ô chọn = số đêm đã diễn ra (tự tăng khi có đêm mới). Câu trả lời gửi về Google Sheet (type 'visit-count').
   Không bật khi mở thẳng link hồ sơ nghệ sĩ (#nghe-si/<id>) để khỏi che ngăn hồ sơ. */
const SHAPES = ['organic-a', 'organic-b', 'organic-c', 'organic-d']

export default function VisitPoll() {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const now = Date.now()
  const past = SHOWS.filter((s) => showEnd(s) <= now)
  const next = SHOWS.find((s) => showEnd(s) > now)

  useEffect(() => {
    if (!past.length || location.hash.startsWith('#nghe-si/')) return
    const t = setTimeout(() => setOpen(true), 1200)
    return () => clearTimeout(t)
  }, [past.length])

  const choose = (count) => {
    submitForm('visit-count', { count }).catch(() => {})
    setOpen(false)
    toast(next ? `Cảm ơn bạn! Hẹn gặp lại dưới Tán Đa ${next.timeLabel ? `${next.timeLabel} ` : ''}${next.dayLabel}.` : 'Cảm ơn bạn đã ghé Tán Đa!')
  }

  return (
    <Modal open={open} onClose={() => setOpen(false)} title="Bạn đã tới Tán Đa bao nhiêu lần rồi?">
      <p className="-mt-2 text-[15px] leading-relaxed text-muted">
        Tán Đa đã có {past.length} đêm diễn: <span className="whitespace-nowrap">{past.map((s) => s.dayLabel).join(' · ')}.</span>
      </p>
      <div className={`mt-6 grid gap-3 ${past.length > 3 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
        {past.map((s, i) => (
          <button
            key={s.id}
            onClick={() => choose(i + 1)}
            className={`${SHAPES[i % SHAPES.length]} flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1 border border-line bg-night/70 px-3 py-4 transition-colors duration-200 hover:border-amber hover:bg-amber/10 active:scale-[0.97]`}
          >
            <span className="font-serif text-4xl font-bold leading-none text-amber">{i + 1}</span>
            <span className="font-mono text-xs uppercase tracking-wider text-cream">lần</span>
          </button>
        ))}
      </div>
    </Modal>
  )
}
