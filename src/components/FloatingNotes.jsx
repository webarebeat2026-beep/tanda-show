import { Note } from './MusicStaff'

/* Nốt nhạc trôi lơ lửng phía sau nội dung toàn trang (chỉ lộ ở phần nền, không đè lên chữ/thẻ/ảnh).
   Thuần SVG + CSS transform (index.css: .float-note) → nhẹ máy; tắt khi người xem chọn giảm chuyển động.
   mobile: true = vẫn hiện trên điện thoại (các nốt còn lại chỉ hiện từ khổ sm trở lên cho đỡ rối). */
const FILL = {
  amber: 'var(--color-amber)',
  cream: 'var(--color-cream)',
  brick: 'var(--color-brick-text)',
  moss: 'var(--color-moss-text)',
}

const NOTES = [
  { left: '4%', size: 40, dur: 34, delay: -4, type: 'eighth', tone: 'amber', o: 0.54, sway: 40, mobile: true },
  { left: '21%', size: 51, dur: 39, delay: -14, type: 'beam', tone: 'amber', o: 0.44, sway: 55, mobile: true },
  { left: '39%', size: 35, dur: 47, delay: -6, type: 'quarter', tone: 'amber', o: 0.37, sway: 35 },
  { left: '47%', size: 46, dur: 36, delay: -31, type: 'eighth', tone: 'cream', o: 0.31, sway: -50 },
  { left: '64%', size: 40, dur: 32, delay: -20, type: 'quarter', tone: 'amber', o: 0.48, sway: -35, mobile: true },
  { left: '80%', size: 49, dur: 38, delay: -3, type: 'beam', tone: 'cream', o: 0.31, sway: -55 },
  { left: '88%', size: 35, dur: 35, delay: -25, type: 'eighth', tone: 'brick', o: 0.44, sway: 45 },
  { left: '95%', size: 30, dur: 46, delay: -10, type: 'quarter', tone: 'amber', o: 0.41, sway: -30 },
  { left: '34%', size: 38, dur: 40, delay: -44, type: 'beam', tone: 'amber', o: 0.34, sway: -40 },
  { left: '71%', size: 43, dur: 39, delay: -47, type: 'quarter', tone: 'amber', o: 0.44, sway: -45 },
]

/* fixed = lớp nền cố định toàn trang; không fixed = phủ trong một section (dùng cho section có ảnh nền riêng) */
export default function FloatingNotes({ fixed = false, className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none overflow-hidden ${fixed ? 'fixed inset-0 -z-10' : 'absolute inset-0'} ${className}`}
    >
      {NOTES.map((n, i) => (
        <svg
          key={i}
          viewBox="-12 -46 50 56"
          width={n.size}
          height={Math.round(n.size * 1.12)}
          className={`float-note absolute bottom-0 ${n.mobile ? '' : 'max-sm:hidden'}`}
          style={{
            left: n.left,
            '--o': n.o,
            '--sway': `${n.sway}px`,
            animationDuration: `${n.dur}s`,
            animationDelay: `${n.delay}s`,
          }}
        >
          <Note type={n.type} fill={FILL[n.tone]} />
        </svg>
      ))}
    </div>
  )
}
