import { useEffect, useState } from 'react'
import { Modal, useToast } from './ui'
import { SHOWS, showEnd } from '../data'
import { submitForm } from '../lib'

/* Popup hỏi nhanh mỗi lần mở trang: "Bạn đã tới Tán Đa Show bao nhiêu lần rồi?"
   Ô chọn = 0 lần (chưa tới) + 1…số đêm đã diễn ra (tự tăng khi có đêm mới). Câu trả lời gửi về Google Sheet (type 'visit-count').
   Không bật khi mở thẳng link hồ sơ nghệ sĩ (#nghe-si/<id>) để khỏi che ngăn hồ sơ. */
const TDS = 'Tán Đa Show' // không để rớt dòng giữa tên chương trình
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
    const when = next ? ` ${next.timeLabel ? `${next.timeLabel} ` : ''}${next.dayLabel}` : ''
    if (count === 0) toast(next ? `Cảm ơn bạn! Hẹn gặp bạn lần đầu tại Tán Đa Show${when}.` : 'Cảm ơn bạn! Hẹn gặp bạn ở Tán Đa Show sắp tới.')
    else toast(next ? `Cảm ơn bạn! Hẹn gặp lại tại Tán Đa Show${when}.` : 'Cảm ơn bạn đã ghé Tán Đa Show!')
  }

  return (
    <Modal open={open} onClose={() => setOpen(false)} title={`Bạn đã tới ${TDS} bao nhiêu lần rồi?`}>
      <p className="-mt-2 text-[15px] leading-relaxed text-muted">
        {TDS} đã có {past.length} đêm diễn: <span className="whitespace-nowrap">{past.map((s) => s.dayLabel).join(' · ')}.</span>
      </p>
      {/* ô 0 = chưa tới lần nào, sau đó 1…N theo số đêm đã diễn ra */}
      <div className={`mt-6 grid gap-3 ${past.length + 1 > 4 ? 'grid-cols-3 sm:grid-cols-5' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {[0, ...past.map((_, i) => i + 1)].map((n) => (
          <button
            key={n}
            onClick={() => choose(n)}
            className={`${SHAPES[n % SHAPES.length]} flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1 border border-line bg-night/70 px-3 py-4 transition-colors duration-200 hover:border-amber hover:bg-amber/10 active:scale-[0.97]`}
          >
            <span className="font-serif text-4xl font-bold leading-none text-amber">{n}</span>
            <span className="font-mono text-xs uppercase tracking-wider text-cream">lần</span>
          </button>
        ))}
      </div>
    </Modal>
  )
}
