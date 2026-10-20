import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Guitar, Mic2, Music2, Phone, Send } from 'lucide-react'
import { isUrl, submitForm } from '../lib'
import { Button, Eyebrow, Field, Reveal, useToast } from './ui'

/* ───────── Form đăng ký biểu diễn — 3 bước ngắn: Nghệ sĩ → Âm nhạc → Liên hệ ───────── */
const STEPS = [
  { key: 'artist', label: 'Nghệ sĩ', icon: Mic2 },
  { key: 'music', label: 'Âm nhạc', icon: Music2 },
  { key: 'contact', label: 'Liên hệ', icon: Phone },
]

const EMPTY = {
  name: '',
  kind: '',
  members: '',
  city: '',
  genre: '',
  musicLink: '',
  socialLink: '',
  bio: '',
  setlist: '',
  availability: '',
  contactName: '',
  phone: '',
  email: '',
  note: '',
  consent: false,
  website: '', // bẫy spam: người thật không thấy ô này
}

const isPhone = (v) => /^(\+?84|0)\d{9,10}$/.test(v.replace(/[\s.-]/g, ''))
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())

function validate(step, f) {
  const e = {}
  if (step === 0) {
    if (f.name.trim().length < 2) e.name = 'Cho Tán Đa biết tên nghệ sĩ hoặc ban nhạc nhé.'
    if (!f.kind) e.kind = 'Chọn hình thức biểu diễn.'
    if (f.kind === 'band' && !(Number(f.members) >= 2 && Number(f.members) <= 20)) e.members = 'Nhập số thành viên (từ 2 đến 20).'
  }
  if (step === 1) {
    if (!isUrl(f.musicLink)) e.musicLink = 'Dán một đường link bắt đầu bằng https:// (YouTube, Spotify, SoundCloud, TikTok...).'
    if (f.socialLink.trim() && !isUrl(f.socialLink)) e.socialLink = 'Link cần bắt đầu bằng https://'
    if (f.bio.trim().length < 20) e.bio = 'Giới thiệu thêm một chút về bạn/nhóm (ít nhất 20 ký tự).'
  }
  if (step === 2) {
    if (f.contactName.trim().length < 2) e.contactName = 'Nhập tên người liên hệ.'
    if (!isPhone(f.phone)) e.phone = 'Số điện thoại chưa đúng (VD: 0912 345 678).'
    if (!isEmail(f.email)) e.email = 'Email chưa đúng định dạng.'
    if (!f.consent) e.consent = 'Bạn cần đồng ý để BTC có thể liên hệ.'
  }
  return e
}

const FIELD_STEP = { name: 0, kind: 0, members: 0, musicLink: 1, socialLink: 1, bio: 1, contactName: 2, phone: 2, email: 2, consent: 2 }

function RegisterForm() {
  const [f, setF] = useState(EMPTY)
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const formRef = useRef(null)
  const toast = useToast()

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setF({ ...f, [k]: v })
    if (errors[k]) setErrors({ ...errors, [k]: '' })
  }

  const focusFirst = (err) => {
    const k = Object.keys(err)[0]
    setTimeout(() => (document.getElementById(`reg-${k}`) || document.querySelector(`[name="reg-${k}"]`))?.focus(), 30)
  }

  const goTo = (n) => {
    setStep(n)
    setErrors({})
    setTimeout(() => {
      formRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      formRef.current?.querySelector('[data-step] input, [data-step] textarea')?.focus({ preventScroll: true })
    }, 30)
  }

  const next = () => {
    const err = validate(step, f)
    setErrors(err)
    if (Object.keys(err).length) return focusFirst(err)
    goTo(step + 1)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (step < STEPS.length - 1) return next()
    const all = { ...validate(0, f), ...validate(1, f), ...validate(2, f) }
    if (Object.keys(all).length) {
      const s = FIELD_STEP[Object.keys(all)[0]]
      setStep(s)
      setErrors(all)
      return focusFirst(all)
    }
    if (f.website) return setDone(true) // bot điền ô ẩn → bỏ qua lặng lẽ
    setSending(true)
    try {
      const { consent, website, ...data } = f
      await submitForm('registration', {
        ...Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v).trim()])),
        kind: f.kind === 'band' ? 'Nhóm / ban nhạc' : 'Nghệ sĩ solo',
        members: f.kind === 'band' ? f.members : '1',
      })
      setDone(true)
      toast(`Tán Đa đã nhận hồ sơ của ${f.name.trim()}. Cảm ơn bạn!`)
      setTimeout(() => document.getElementById('register-done')?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 50)
    } catch {
      setErrors({ consent: 'Chưa gửi được hồ sơ, bạn kiểm tra kết nối mạng rồi thử lại nhé.' })
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <div id="register-done" className="flex flex-col items-start gap-4 py-6" role="status">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-amber text-ink">
          <Check size={28} strokeWidth={2.5} aria-hidden="true" />
        </span>
        <h3 className="font-serif text-2xl font-bold text-cream">Hồ sơ của {f.name.trim() || 'bạn'} đã tới Tán Đa.</h3>
        <p className="text-muted">Ban tổ chức sẽ nghe các link âm nhạc và liên hệ qua số điện thoại hoặc email bạn để lại khi có đêm diễn phù hợp.</p>
        <Button variant="ghost" onClick={() => { setF(EMPTY); setStep(0); setDone(false) }}>Gửi hồ sơ khác</Button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate>
      {/* thanh bước */}
      <ol className="mb-7 grid grid-cols-3 gap-2" aria-label="Các bước đăng ký">
        {STEPS.map((s, i) => {
          const state = i < step ? 'done' : i === step ? 'current' : 'todo'
          return (
            <li key={s.key} aria-current={state === 'current' ? 'step' : undefined}>
              <button
                type="button"
                onClick={() => i < step && goTo(i)}
                disabled={i >= step}
                className={`flex w-full flex-col gap-2 text-left disabled:cursor-default ${i < step ? 'cursor-pointer' : ''}`}
              >
                <span className={`h-1 rounded-full transition-colors ${state === 'todo' ? 'bg-line' : 'bg-amber'}`} />
                <span className={`flex items-center gap-1.5 text-sm font-medium ${state === 'current' ? 'text-amber' : state === 'done' ? 'text-cream' : 'text-muted'}`}>
                  {state === 'done' ? <Check size={15} aria-hidden="true" /> : <s.icon size={15} aria-hidden="true" />}
                  <span className="hidden font-mono text-[11px] text-muted sm:inline">{i + 1}.</span> <span className="whitespace-nowrap">{s.label}</span>
                  <span className="sr-only">{state === 'done' ? '(đã xong)' : state === 'current' ? '(đang điền)' : ''}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      {/* ô bẫy spam — ẩn với người thật */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="reg-website">Website</label>
        <input id="reg-website" tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} />
      </div>

      {step === 0 && (
        <div data-step className="grid gap-5">
          <Field id="reg-name" label="Tên nghệ sĩ / ban nhạc *" value={f.name} onChange={set('name')} error={errors.name} maxLength={80} autoComplete="off" />
          <fieldset>
            <legend className="mb-1.5 block text-sm font-medium text-cream">Hình thức biểu diễn *</legend>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { v: 'solo', label: 'Nghệ sĩ solo', icon: Mic2 },
                { v: 'band', label: 'Nhóm / ban nhạc', icon: Guitar },
              ].map((o) => (
                <label
                  key={o.v}
                  className={`flex min-h-12 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl border px-3 py-3 text-sm transition-colors sm:justify-start sm:gap-2.5 sm:px-4 sm:text-[15px] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-amber ${
                    f.kind === o.v ? 'border-amber bg-amber/10 text-amber' : 'border-line bg-night/70 text-cream hover:border-amber/50'
                  }`}
                >
                  <input type="radio" name="reg-kind" value={o.v} checked={f.kind === o.v} onChange={set('kind')} className="sr-only" aria-describedby={errors.kind ? 'reg-kind-err' : undefined} />
                  <o.icon size={18} className="hidden sm:block" aria-hidden="true" />
                  {o.label}
                </label>
              ))}
            </div>
            {errors.kind && <p id="reg-kind-err" className="mt-1.5 text-xs text-brick-text">{errors.kind}</p>}
          </fieldset>
          <div className="grid gap-5 sm:grid-cols-2">
            {f.kind === 'band' && (
              <Field id="reg-members" type="number" inputMode="numeric" min="2" max="20" label="Số thành viên *" value={f.members} onChange={set('members')} error={errors.members} />
            )}
            <Field id="reg-city" label="Đang hoạt động tại" placeholder="VD: Hà Nội" value={f.city} onChange={set('city')} maxLength={60} autoComplete="address-level1" />
            <Field id="reg-genre" label="Dòng nhạc / phong cách" placeholder="VD: indie pop, rock, dân gian đương đại..." value={f.genre} onChange={set('genre')} maxLength={80} className={f.kind === 'band' ? 'sm:col-span-2' : ''} />
          </div>
        </div>
      )}

      {step === 1 && (
        <div data-step className="grid gap-5">
          <Field id="reg-musicLink" type="url" inputMode="url" label="Link nghe nhạc / video biểu diễn *" placeholder="https://" hint="YouTube, Spotify, SoundCloud, TikTok, Google Drive... Bản live càng tốt." value={f.musicLink} onChange={set('musicLink')} error={errors.musicLink} />
          <Field id="reg-socialLink" type="url" inputMode="url" label="Trang mạng xã hội / website" placeholder="https://" value={f.socialLink} onChange={set('socialLink')} error={errors.socialLink} />
          <Field id="reg-bio" textarea label="Giới thiệu ngắn về bạn / nhóm *" placeholder="Bạn là ai, chơi nhạc từ bao giờ, đã có sản phẩm hay sân khấu nào..." value={f.bio} onChange={set('bio')} error={errors.bio} maxLength={600} hint={`${f.bio.length}/600 ký tự`} />
          <Field id="reg-setlist" textarea label="Tiết mục muốn mang tới Tán Đa" placeholder="2–5 ca khúc, ghi rõ sáng tác hay cover" value={f.setlist} onChange={set('setlist')} maxLength={400} />
        </div>
      )}

      {step === 2 && (
        <div data-step className="grid gap-5">
          <Field id="reg-contactName" label="Người liên hệ *" value={f.contactName} onChange={set('contactName')} error={errors.contactName} maxLength={60} autoComplete="name" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="reg-phone" type="tel" inputMode="tel" label="Số điện thoại *" value={f.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" maxLength={16} />
            <Field id="reg-email" type="email" inputMode="email" label="Email *" value={f.email} onChange={set('email')} error={errors.email} autoComplete="email" maxLength={100} />
          </div>
          <Field id="reg-availability" label="Thời gian có thể tham gia" placeholder="VD: các tối thứ 7 tháng 11, 12" value={f.availability} onChange={set('availability')} maxLength={120} />
          <Field id="reg-note" textarea label="Ghi chú thêm cho BTC" placeholder="Nhu cầu kỹ thuật, nhạc cụ mang theo..." value={f.note} onChange={set('note')} maxLength={400} />
          <div>
            <label htmlFor="reg-consent" className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-cream/90">
              <input
                id="reg-consent"
                type="checkbox"
                checked={f.consent}
                onChange={set('consent')}
                aria-invalid={!!errors.consent}
                aria-describedby={errors.consent ? 'reg-consent-err' : undefined}
                className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#F2B544]"
              />
              Tôi xác nhận thông tin trên là chính xác và đồng ý để Ban tổ chức Tán Đa dùng thông tin này để liên hệ về việc biểu diễn.
            </label>
            {errors.consent && <p id="reg-consent-err" className="mt-1.5 text-xs text-brick-text">{errors.consent}</p>}
          </div>
        </div>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-3">
        {step > 0 && (
          <Button type="button" variant="subtle" onClick={() => goTo(step - 1)}>
            <ArrowLeft size={18} aria-hidden="true" /> Quay lại
          </Button>
        )}
        {step < STEPS.length - 1 ? (
          <Button key="next" type="submit">
            Tiếp tục <ArrowRight size={18} aria-hidden="true" />
          </Button>
        ) : (
          <Button key="send" type="submit" disabled={sending}>
            <Send size={18} aria-hidden="true" />
            {sending ? 'Đang gửi hồ sơ...' : 'Gửi hồ sơ đăng ký'}
          </Button>
        )}
        <span className="ml-auto font-mono text-xs text-muted">Bước {step + 1}/{STEPS.length}</span>
      </div>
    </form>
  )
}

export default function Register() {
  return (
    <section id="dang-ky" aria-labelledby="register-title" className="relative overflow-hidden bg-night-2 py-24 sm:py-32">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent" />
      <div aria-hidden="true" className="absolute -right-48 top-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(242,181,68,0.14),transparent_70%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8">
        <Reveal className="lg:col-span-5 lg:order-2 lg:pt-6">
          <Eyebrow>Dành cho nghệ sĩ</Eyebrow>
          <h2 id="register-title" className="mt-5 font-serif text-4xl font-bold leading-tight text-cream sm:text-5xl">
            Mang ca khúc của bạn <span className="glow-amber italic text-amber">đến gốc đa.</span>
          </h2>
          <p className="mt-6 text-[17px] leading-relaxed text-muted">
            Tán Đa diễn ra hằng tháng dưới gốc đa 305 tuổi tại 71 Hàng Trống. Mỗi đêm diễn dành sân khấu cho những band nhạc, nghệ sĩ indie trẻ trình diễn ca khúc của chính mình trước khán giả phố đi bộ.
          </p>
          <p className="mt-4 text-[17px] leading-relaxed text-muted">
            Nghệ sĩ solo hay ban nhạc đều có thể gửi hồ sơ — chỉ cần một đường link để Tán Đa được nghe bạn.
          </p>
          <ol className="mt-8 space-y-3 text-sm text-cream/90">
            {['Gửi hồ sơ kèm link âm nhạc', 'BTC nghe & liên hệ khi có đêm phù hợp', 'Gặp khán giả dưới Tán Đa'].map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-amber/50 font-mono text-xs text-amber">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7 lg:order-1">
          <div className="organic-a relative border border-line bg-card/90 p-5 shadow-[0_40px_100px_-40px_rgba(242,181,68,0.3)] backdrop-blur sm:p-8">
            <h3 className="mb-6 flex items-center gap-2 font-serif text-2xl font-bold text-cream">
              <Guitar size={20} className="text-amber" aria-hidden="true" /> Đăng ký biểu diễn
            </h3>
            <RegisterForm />
            <p className="mt-7 border-t border-line pt-5 text-xs leading-relaxed text-muted">
              Thông tin liên hệ chỉ được Ban tổ chức dùng để trao đổi về việc biểu diễn. Gửi hồ sơ chưa đồng nghĩa với việc được xếp lịch — line-up chính thức sẽ được công bố sau khi xác nhận cùng nghệ sĩ.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
