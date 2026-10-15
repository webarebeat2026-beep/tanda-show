import { useState } from 'react'
import { Check, Send } from 'lucide-react'
import { isUrl, submitForm } from '../lib'
import { Button, Eyebrow, Field, Reveal, useToast } from './ui'

/* ───────── Form đề cử nghệ sĩ ───────── */
function NominateForm() {
  const empty = { artist: '', link: '', reason: '' }
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const toast = useToast()

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value })
    setErrors({ ...errors, [k]: '' })
  }

  const submit = async (e) => {
    e.preventDefault()
    const err = {}
    if (form.artist.trim().length < 2) err.artist = 'Cho Tán Đa biết tên nghệ sĩ hoặc ban nhạc nhé.'
    if (!isUrl(form.link)) err.link = 'Dán một đường link bắt đầu bằng https:// (Spotify, YouTube, SoundCloud...).'
    if (form.reason.trim().length < 10) err.reason = 'Viết thêm một chút lý do (ít nhất 10 ký tự).'
    setErrors(err)
    if (Object.keys(err).length) {
      document.getElementById(`nom-${Object.keys(err)[0]}`)?.focus()
      return
    }
    setSending(true)
    try {
      await submitForm('nomination', { artist: form.artist.trim(), link: form.link.trim(), reason: form.reason.trim() })
      setDone(true)
      toast(`Cảm ơn bạn đã giới thiệu ${form.artist.trim()} với Tán Đa!`)
    } catch {
      setErrors({ reason: 'Chưa gửi được, bạn thử lại sau nhé.' })
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-start gap-4 py-6">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-amber text-ink">
          <Check size={28} strokeWidth={2.5} aria-hidden="true" />
        </span>
        <h3 className="font-serif text-2xl font-bold text-cream">Đề cử của bạn đã tới Tán Đa.</h3>
        <p className="text-muted">Ban tổ chức sẽ nghe và cân nhắc kết nối nghệ sĩ cho các đêm diễn sắp tới.</p>
        <Button variant="ghost" onClick={() => { setForm(empty); setDone(false) }}>Đề cử thêm một nghệ sĩ</Button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      <Field id="nom-artist" label="Tên nghệ sĩ / ban nhạc" placeholder="VD: một giọng ca bạn nghe mãi" value={form.artist} onChange={set('artist')} error={errors.artist} maxLength={80} />
      <Field id="nom-link" type="url" inputMode="url" label="Link âm nhạc" placeholder="https://" hint="Spotify, YouTube, SoundCloud, TikTok... đều được." value={form.link} onChange={set('link')} error={errors.link} />
      <Field id="nom-reason" textarea label="Vì sao bạn muốn Tán Đa gặp họ?" placeholder="Một bài hát, một khoảnh khắc, một lý do..." value={form.reason} onChange={set('reason')} error={errors.reason} maxLength={500} hint={`${form.reason.length}/500 ký tự`} />
      <Button type="submit" disabled={sending} className="sm:justify-self-start">
        <Send size={18} aria-hidden="true" />
        {sending ? 'Đang gửi đề cử...' : 'Gửi đề cử'}
      </Button>
    </form>
  )
}

export default function Vote() {
  return (
    <section id="de-cu" aria-labelledby="vote-title" className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden="true" className="absolute -left-40 top-20 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(166,58,40,0.28),transparent_70%)]" />
      <div aria-hidden="true" className="absolute -right-40 bottom-0 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(63,86,52,0.35),transparent_70%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8">
        <Reveal className="lg:col-span-5 lg:pt-6">
          <Eyebrow>Đề cử nghệ sĩ</Eyebrow>
          <h2 id="vote-title" className="mt-5 font-serif text-4xl font-bold leading-tight text-cream sm:text-5xl">
            Playlist của bạn có thể là <span className="glow-amber italic text-amber">cuộc gặp tiếp theo</span> của Tán Đa.
          </h2>
          <p className="mt-6 text-[17px] leading-relaxed text-muted">
            Có một giọng ca bạn nghe mãi? Một ban nhạc bạn muốn nhiều người biết đến? Hãy giới thiệu họ với Tán Đa để cùng gặp nhau trong các đêm diễn sắp tới.
          </p>
          <ol className="mt-8 space-y-3 text-sm text-cream/90">
            {['Đề cử nghệ sĩ bạn yêu thích', 'Tán Đa lắng nghe & kết nối nghệ sĩ', 'Gặp nhau dưới Tán Đa'].map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full border border-amber/50 font-mono text-xs text-amber">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="organic-b border border-line bg-card/90 p-5 shadow-[0_40px_100px_-40px_rgba(242,181,68,0.3)] backdrop-blur sm:p-8">
            <h3 className="mb-6 flex items-center gap-2 font-serif text-2xl font-bold text-cream">
              <Send size={20} className="text-amber" aria-hidden="true" /> Đề cử nghệ sĩ
            </h3>
            <NominateForm />
            <p className="mt-7 border-t border-line pt-5 text-xs leading-relaxed text-muted">
              Đề cử là một cơ sở để Tán Đa lựa chọn và kết nối nghệ sĩ. Danh sách biểu diễn chính thức sẽ được công bố sau khi xác nhận cùng nghệ sĩ.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
