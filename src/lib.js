import { useCallback, useEffect, useRef, useState } from 'react'
import { SUBMIT_ENDPOINT } from './data'

/* localStorage có thể bị chặn (chế độ ẩn danh, chặn cookie) → luôn bọc try/catch */
export function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw == null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* bỏ qua — trang vẫn chạy bình thường */
  }
}

export function useStoredState(key, initial) {
  const [value, setValue] = useState(() => readStore(key, initial))
  useEffect(() => writeStore(key, value), [key, value])
  return [value, setValue]
}

/* Gửi form: có SUBMIT_ENDPOINT thì POST thật, không thì lưu tạm vào trình duyệt */
export async function submitForm(type, payload) {
  const record = { type, ...payload, at: new Date().toISOString() }
  if (SUBMIT_ENDPOINT) {
    const res = await fetch(SUBMIT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    })
    if (!res.ok) throw new Error('Gửi không thành công')
    return
  }
  await new Promise((r) => setTimeout(r, 600))
  const all = readStore('tanda:submissions', [])
  writeStore('tanda:submissions', [...all, record])
}

/* Một trình phát nghe thử dùng chung — chỉ 1 bản phát tại một thời điểm */
let sharedAudio = null
export function useAudioPreview() {
  const [playingId, setPlayingId] = useState(null)
  const idRef = useRef(null)

  const stop = useCallback(() => {
    if (sharedAudio) sharedAudio.pause()
    idRef.current = null
    setPlayingId(null)
  }, [])

  const play = useCallback((id, src) => {
    if (!src) return false
    if (!sharedAudio) sharedAudio = new Audio()
    if (idRef.current === id) {
      stop()
      return true
    }
    sharedAudio.src = src
    sharedAudio.currentTime = 0
    sharedAudio.volume = 0.8
    sharedAudio.onended = stop
    sharedAudio.play().catch(stop)
    idRef.current = id
    setPlayingId(id)
    return true
  }, [stop])

  useEffect(() => stop, [stop])
  return { playingId, play, stop }
}

/* Tạo file .ics + link Google Calendar cho nút "Thêm vào lịch" */
function toICSDate(d) {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

/* ngày theo giờ Việt Nam dạng YYYYMMDD — dùng cho sự kiện cả ngày */
function toVNDay(d) {
  return new Date(d.getTime() + 7 * 3600e3).toISOString().slice(0, 10).replace(/-/g, '')
}

export function calendarLinks(show) {
  const start = new Date(show.start)
  const allDay = !show.timeLabel
  const end = allDay ? new Date(start.getTime() + 24 * 3600e3) : new Date(start.getTime() + (show.durationHours || 2) * 3600 * 1000)
  const title = `${show.title} — Hẹn dưới Tán Đa`
  const details = [show.theme, allDay ? 'Giờ diễn sẽ được cập nhật.' : '', 'Một tán đa. Nhiều thanh âm. Những cuộc gặp mới.'].filter(Boolean).join(' · ')
  const dates = allDay ? `${toVNDay(start)}/${toVNDay(end)}` : `${toICSDate(start)}/${toICSDate(end)}`
  const google =
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${dates}` +
    `&details=${encodeURIComponent(details)}` +
    `&location=${encodeURIComponent(show.address)}`
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tan Da Show//VI',
    'BEGIN:VEVENT',
    `UID:tanda-${show.id || toICSDate(start)}@tandashow`,
    `DTSTAMP:${toICSDate(new Date())}`,
    allDay ? `DTSTART;VALUE=DATE:${toVNDay(start)}` : `DTSTART:${toICSDate(start)}`,
    allDay ? `DTEND;VALUE=DATE:${toVNDay(end)}` : `DTEND:${toICSDate(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${details.replace(/,/g, '\\,')}`,
    `LOCATION:${show.address.replace(/,/g, '\\,')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const icsUrl = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics)
  return { google, icsUrl }
}

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
export const isPhone = (v) => /^(\+?84|0)\d{9,10}$/.test(v.replace(/[\s.-]/g, ''))
export const isUrl = (v) => {
  try {
    const u = new URL(v.trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}
