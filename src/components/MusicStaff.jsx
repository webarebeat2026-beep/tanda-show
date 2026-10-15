/* Khuông nhạc lượn sóng trôi ngang + nốt nhạc bay lên — nền trang trí cho ô CTA "Thanh âm tiếp theo".
   Toàn bộ là SVG + CSS animation (index.css: .staff-drift / .note-bob / .note-rise), tắt khi người xem chọn giảm chuyển động. */

const W = 1200 // bề ngang viewBox
const P = 600 // chu kỳ sóng = quãng trôi mỗi vòng → lặp liền mạch
const A = 22 // biên độ sóng
const Y0 = 112 // dòng kẻ trên cùng
const GAP = 13 // khoảng cách giữa 5 dòng kẻ

const wave = (x) => A * Math.sin((2 * Math.PI * x) / P)
const lineY = (i, x) => Y0 + i * GAP + wave(x)

/* 5 dòng kẻ, vẽ dư 1 chu kỳ mỗi bên để khi trôi không lộ đầu mút */
const LINES = Array.from({ length: 5 }, (_, i) => {
  let d = ''
  for (let x = -P; x <= W + P; x += 10) d += `${d ? 'L' : 'M'}${x} ${lineY(i, x).toFixed(1)}`
  return d
})

/* Nốt trên khuông trong 1 chu kỳ: x, bậc (0 = dòng trên cùng, mỗi bậc nửa khoảng), loại, màu */
const STAFF_NOTES = [
  { x: 40, step: 6, type: 'quarter', tone: 'amber' },
  { x: 120, step: 3, type: 'eighth', tone: 'cream' },
  { x: 200, step: 5, type: 'beam', tone: 'amber' },
  { x: 330, step: 2, type: 'quarter', tone: 'brick' },
  { x: 410, step: 7, type: 'eighth', tone: 'amber' },
  { x: 490, step: 4, type: 'beam', tone: 'moss' },
]
const COPIES = [-P, 0, P, 2 * P]

/* Nốt bay lên khỏi khuông: vị trí theo % ô, độ trễ, thời lượng */
const FLOATERS = [
  { left: '8%', top: '30%', type: 'eighth', tone: 'amber', delay: 0, dur: 7 },
  { left: '19%', top: '62%', type: 'beam', tone: 'cream', delay: 2.4, dur: 8 },
  { left: '31%', top: '24%', type: 'quarter', tone: 'brick', delay: 4.6, dur: 7.5 },
  { left: '68%', top: '28%', type: 'eighth', tone: 'moss', delay: 1.2, dur: 8.5 },
  { left: '79%', top: '60%', type: 'beam', tone: 'amber', delay: 3.6, dur: 7 },
  { left: '90%', top: '26%', type: 'quarter', tone: 'cream', delay: 5.4, dur: 8 },
]

const FILL = {
  amber: 'var(--color-amber)',
  cream: 'var(--color-cream)',
  brick: 'var(--color-brick-text)',
  moss: 'var(--color-moss-text)',
}

/* Hình nốt nhạc, gốc toạ độ = tâm đầu nốt */
function Note({ type, fill }) {
  const head = <ellipse rx="8" ry="5.6" transform="rotate(-22)" fill={fill} />
  if (type === 'beam')
    return (
      <g fill={fill}>
        {head}
        <ellipse cx="24" cy="-6" rx="8" ry="5.6" transform="rotate(-22 24 -6)" />
        <rect x="6.2" y="-36" width="2.2" height="35" />
        <rect x="30.2" y="-42" width="2.2" height="35" />
        <path d="M6.2 -36 L32.4 -42 L32.4 -36.5 L6.2 -30.5 Z" />
      </g>
    )
  return (
    <g fill={fill}>
      {head}
      <rect x="6.2" y="-36" width="2.2" height="35" />
      {type === 'eighth' && <path d="M8.4 -36 C 10 -27 21 -25 18 -11 C 17 -19 12 -22 8.4 -24 Z" />}
    </g>
  )
}

export default function MusicStaff() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg viewBox={`0 0 ${W} 260`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="staff-fade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.12" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.88" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="staff-mask">
            <rect width={W} height="260" fill="url(#staff-fade)" />
          </mask>
        </defs>
        <g mask="url(#staff-mask)">
          <g className="staff-drift">
            {LINES.map((d, i) => (
              <path key={i} d={d} fill="none" stroke="var(--color-amber)" strokeOpacity={0.32} strokeWidth="1.4" />
            ))}
            {COPIES.flatMap((offset) =>
              STAFF_NOTES.map((n, k) => {
                const x = n.x + offset
                const y = Y0 + (n.step * GAP) / 2 + wave(x)
                return (
                  <g key={`${offset}-${k}`} transform={`translate(${x} ${y.toFixed(1)})`}>
                    <g className="note-bob" style={{ animationDelay: `${(k * 0.45).toFixed(2)}s` }} opacity="0.85">
                      <Note type={n.type} fill={FILL[n.tone]} />
                    </g>
                  </g>
                )
              }),
            )}
          </g>
        </g>
      </svg>

      {FLOATERS.map((f, i) => (
        <svg
          key={i}
          viewBox="-12 -46 50 56"
          width="34"
          height="38"
          className="note-rise absolute"
          style={{ left: f.left, top: f.top, animationDelay: `${f.delay}s`, animationDuration: `${f.dur}s` }}
        >
          <Note type={f.type} fill={FILL[f.tone]} />
        </svg>
      ))}
    </div>
  )
}
