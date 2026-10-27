import { useEffect, useState } from 'react'
import { SUBMIT_ENDPOINT } from './data'
import { readStore, writeStore } from './lib'

/* Nội dung BTC tự cập nhật trên Google Sheet (trang tính "Báo chí", "Tin tức", "Đêm diễn")
   — Apps Script tools/google-sheet/Code.gs trả về { ok, updated, shows, press, news }.
   Trang hiện ngay bản lưu gần nhất (hoặc dữ liệu đóng sẵn trong src/press.js), tải xong bản mới thì thay. */
const CACHE_KEY = 'tanda:content'
const TIMEOUT_MS = 12000

let pending = null
function load() {
  if (!pending) {
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null
    const timer = ctrl && setTimeout(() => ctrl.abort(), TIMEOUT_MS)
    pending = fetch(`${SUBMIT_ENDPOINT}?action=content`, { signal: ctrl?.signal })
      .then((r) => r.json())
      .then((d) => {
        if (!d?.ok || !Array.isArray(d.press) || !Array.isArray(d.news)) throw new Error('Dữ liệu không hợp lệ')
        writeStore(CACHE_KEY, d)
        return d
      })
      .finally(() => clearTimeout(timer))
  }
  return pending
}

export function useLiveContent() {
  const [data, setData] = useState(() => readStore(CACHE_KEY, null))
  useEffect(() => {
    if (!SUBMIT_ENDPOINT) return
    let alive = true
    load()
      .then((d) => alive && setData(d))
      .catch(() => {}) // lỗi mạng / Sheet → giữ nguyên bản đang hiện
    return () => {
      alive = false
    }
  }, [])
  return data
}

/* Ảnh: link ngoài dùng thẳng, ảnh có sẵn trên web (press/…) đi theo đường dẫn tương đối */
export const imageSrc = (v) => (/^https?:\/\//i.test(v) ? v : `./${v}`)
export const safeHref = (v) => (/^https?:\/\//i.test(v || '') ? v : '')
export const fmtDate = (iso) => (iso ? iso.split('-').reverse().join('.') : '')
