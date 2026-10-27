/**
 * Tán Đa Show — Google Sheet này làm 2 việc:
 *  (1) NHẬN dữ liệu các form trên landing page (doPost) — mỗi loại form ghi vào một trang tính riêng (tự tạo nếu chưa có).
 *  (2) QUẢN TRỊ NỘI DUNG cho trang web (doGet ?action=content) — BTC tự đăng bài báo / tin tức bằng cách sửa
 *      các trang tính "Báo chí", "Tin tức", "Đêm diễn". Trang web đọc thẳng từ đây, KHÔNG cần build / deploy lại.
 *
 * Cài đặt (1 lần):
 *  1. Mở Google Sheet nhận dữ liệu → Tiện ích mở rộng → Apps Script → dán toàn bộ file này → Lưu.
 *  2. Triển khai → Tùy chọn triển khai mới → Loại: Ứng dụng web
 *     · Thực thi với tư cách: Tôi   · Người có quyền truy cập: Bất kỳ ai   → Triển khai → cấp quyền.
 *  3. Copy "URL ứng dụng web" (…/exec) dán vào SUBMIT_ENDPOINT trong src/data.js → commit.
 *  4. Tải lại Google Sheet → menu "Tán Đa Show" → "Tạo các trang tính nội dung", rồi "Bật tự điền khi dán link".
 * Sửa script sau này: Triển khai → Quản lý triển khai → ✏️ → Phiên bản: Phiên bản mới (giữ nguyên URL).
 */
const FORMS = {
  registration: {
    sheet: 'Đăng ký biểu diễn',
    cols: [
      ['at', 'Thời gian gửi'], ['name', 'Tên nghệ sĩ / ban nhạc'], ['kind', 'Hình thức'], ['members', 'Số thành viên'],
      ['city', 'Hoạt động tại'], ['genre', 'Dòng nhạc'], ['musicLink', 'Link âm nhạc'], ['socialLink', 'Mạng xã hội / website'],
      ['bio', 'Giới thiệu'], ['setlist', 'Tiết mục đề xuất'], ['availability', 'Thời gian có thể tham gia'],
      ['contactName', 'Người liên hệ'], ['phone', 'Số điện thoại'], ['email', 'Email'], ['note', 'Ghi chú'],
    ],
  },
  nomination: {
    sheet: 'Đề cử nghệ sĩ',
    cols: [['at', 'Thời gian gửi'], ['artist', 'Nghệ sĩ được đề cử'], ['link', 'Link âm nhạc'], ['reason', 'Lý do']],
  },
  message: {
    sheet: 'Lời nhắn tới nghệ sĩ',
    cols: [['at', 'Thời gian gửi'], ['artist', 'Gửi tới'], ['from', 'Người gửi'], ['message', 'Lời nhắn']],
  },
  'want-again': {
    sheet: 'Mong chờ nghệ sĩ',
    cols: [['at', 'Thời gian'], ['artist', 'Nghệ sĩ']],
  },
  reminder: {
    sheet: 'Đăng ký nhắc lịch',
    cols: [['at', 'Thời gian gửi'], ['contact', 'Email / SĐT']],
  },
}

function doPost(e) {
  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const d = JSON.parse(e.postData.contents)
    const form = FORMS[d.type]
    if (!form) return json({ ok: false, error: 'unknown type' })
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let sh = ss.getSheetByName(form.sheet)
    if (!sh) {
      sh = ss.insertSheet(form.sheet)
      sh.appendRow(form.cols.map((c) => c[1]))
      sh.setFrozenRows(1)
      sh.getRange(1, 1, 1, form.cols.length).setFontWeight('bold').setBackground('#F2B544')
    }
    sh.appendRow(form.cols.map(([k]) => (k === 'at' ? new Date() : clean(d[k]))))
    return json({ ok: true })
  } catch (err) {
    return json({ ok: false, error: String(err) })
  } finally {
    lock.releaseLock()
  }
}

function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'content') {
    return ContentService.createTextOutput(getContent()).setMimeType(ContentService.MimeType.JSON)
  }
  return json({ ok: true, service: 'Tán Đa Show forms' })
}

/* ═══════════════════════ (2) QUẢN TRỊ NỘI DUNG ═══════════════════════ */

const TZ = 'Asia/Ho_Chi_Minh'
const CACHE_SECONDS = 60 // web thấy thay đổi chậm nhất sau ~1 phút (bật tự điền thì gần như ngay lập tức)

const CONTENT = {
  press: {
    sheet: 'Báo chí',
    cols: [
      ['show', 'Hiển thị', 'Bỏ tick = ẩn bài khỏi trang web (không cần xoá dòng).'],
      ['url', 'Link bài', 'Dán link bài gốc vào đây — các cột tiêu đề, sapo, ảnh, ngày, tên báo sẽ tự điền.'],
      ['outlet', 'Tên báo', 'Tự điền theo tên miền; sửa lại nếu muốn.'],
      ['title', 'Tiêu đề', 'Tự lấy nguyên tiêu đề bài gốc.'],
      ['excerpt', 'Sapo', 'Tự lấy nguyên đoạn mở đầu bài gốc.'],
      ['image', 'Ảnh đại diện', 'Tự lấy ảnh đại diện bài gốc. Có thể thay bằng link ảnh khác (link Google Drive phải để "Bất kỳ ai có đường liên kết").'],
      ['date', 'Ngày đăng', 'Ngày bài lên báo (dd/mm/yyyy). Bài xếp mới → cũ theo cột này.'],
      ['showLabel', 'Đêm diễn', 'Bài nói về đêm nào — chọn trong danh sách (lấy từ trang tính "Đêm diễn"). Để trống = tự chọn theo ngày đăng.'],
      ['kind', 'Loại', 'Bài viết / Video / Ảnh — hiện nhãn trên ảnh.'],
      ['status', 'Tình trạng', 'Máy tự ghi — không cần sửa.'],
    ],
    widths: [80, 320, 150, 320, 380, 220, 100, 140, 90, 260],
  },
  news: {
    sheet: 'Tin tức',
    cols: [
      ['show', 'Hiển thị', 'Bỏ tick = ẩn tin khỏi trang web.'],
      ['pinned', 'Ghim lên đầu', 'Tick để tin luôn đứng đầu, hiện to nhất.'],
      ['date', 'Ngày đăng', 'dd/mm/yyyy — tin xếp mới → cũ theo cột này.'],
      ['title', 'Tiêu đề', 'Bắt buộc. Dòng không có tiêu đề sẽ không hiện.'],
      ['body', 'Nội dung', 'Xuống dòng trong ô: Ctrl + Enter (Mac: ⌘ + Enter). Trang web giữ nguyên các lần xuống dòng.'],
      ['image', 'Ảnh', 'Link ảnh (https://…). Ảnh Google Drive phải chia sẻ "Bất kỳ ai có đường liên kết".'],
      ['link', 'Link xem thêm', 'Không bắt buộc — VD link bài báo, link đăng ký, link Facebook.'],
      ['linkLabel', 'Chữ trên nút link', 'Không bắt buộc — để trống sẽ ghi "Xem chi tiết".'],
    ],
    widths: [80, 100, 100, 320, 480, 240, 260, 160],
  },
  shows: {
    sheet: 'Đêm diễn',
    cols: [
      ['label', 'Đêm diễn', 'Tên hiển thị trên nút lọc của mục Báo chí, VD "Số 04 · 07.11". Thêm đêm mới vào cuối.'],
      ['date', 'Ngày diễn', 'dd/mm/yyyy — dùng để tự xếp bài báo vào đúng đêm.'],
    ],
    widths: [180, 110],
    seed: [['Số 01 · 19.09', '19/09/2026'], ['Số 02 · 10.10', '10/10/2026'], ['Số 03 · 24.10', '24/10/2026']],
  },
}

/* Tên báo theo tên miền (giống tools/press/crawl_press.py) */
const OUTLETS = {
  'nhandan.vn': 'Báo Nhân Dân', 'vietnamplus.vn': 'VietnamPlus', 'vtv.vn': 'VTV', 'htv.vn': 'HTV',
  'qdnd.vn': 'Báo Quân đội Nhân dân', 'hanoimoi.vn': 'Báo Hànộimới', 'nguoihanoi.vn': 'Tạp chí Người Hà Nội',
  'congluan.vn': 'Báo Công Luận', 'danviet.vn': 'Báo Dân Việt', 'phunuvietnam.vn': 'Báo Phụ nữ Việt Nam',
  'thethaovanhoa.vn': 'Thể thao & Văn hóa', 'vntravel.org.vn': 'Tạp chí Du lịch Việt Nam', 'soha.vn': 'Soha',
  'cafef.vn': 'CafeF', 'afamily.vn': 'aFamily', 'tienphong.vn': 'Báo Tiền Phong', 'anninhthudo.vn': 'Báo An ninh Thủ đô',
  'congly.vn': 'Báo Công Lý', 'baophapluat.vn': 'Báo Pháp luật Việt Nam', 'baoxaydung.vn': 'Báo Xây dựng',
  'vnexpress.net': 'VnExpress', 'tuoitre.vn': 'Báo Tuổi Trẻ', 'thanhnien.vn': 'Báo Thanh Niên', 'dantri.com.vn': 'Báo Dân trí',
  'laodong.vn': 'Báo Lao Động', 'vov.vn': 'VOV', 'baotintuc.vn': 'Báo Tin tức', 'kinhtedothi.vn': 'Báo Kinh tế & Đô thị',
}
const KINDS = { 'Bài viết': 'article', Video: 'video', 'Ảnh': 'photo' }
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36'

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Tán Đa Show')
    .addItem('Lấy thông tin cho các bài mới dán link', 'fillAllPress')
    .addItem('Đẩy thay đổi lên web ngay', 'clearContentCache')
    .addSeparator()
    .addItem('Tạo các trang tính nội dung', 'setupContentSheets')
    .addItem('Bật tự điền khi dán link', 'installEditTrigger')
    .addToUi()
}

/* Tạo 3 trang tính Báo chí / Tin tức / Đêm diễn (bỏ qua trang đã có) */
function setupContentSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  ;['shows', 'press', 'news'].forEach((k) => {
    const c = CONTENT[k]
    let sh = ss.getSheetByName(c.sheet)
    if (sh) return
    sh = ss.insertSheet(c.sheet)
    const head = sh.getRange(1, 1, 1, c.cols.length)
    head.setValues([c.cols.map((x) => x[1])]).setFontWeight('bold').setBackground('#F2B544').setWrap(true)
    c.cols.forEach((x, i) => sh.getRange(1, i + 1).setNote(x[2]))
    c.widths.forEach((w, i) => sh.setColumnWidth(i + 1, w))
    sh.setFrozenRows(1)
    if (c.seed) sh.getRange(2, 1, c.seed.length, c.seed[0].length).setValues(c.seed)
  })
  formatContentSheets()
}

/* Ô tick, danh sách chọn, định dạng ngày — chạy lại được nhiều lần */
function formatContentSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const rows = 1000
  const col = (k, key) => CONTENT[k].cols.findIndex((x) => x[0] === key) + 1
  const press = ss.getSheetByName(CONTENT.press.sheet)
  const news = ss.getSheetByName(CONTENT.news.sheet)
  const shows = ss.getSheetByName(CONTENT.shows.sheet)
  press.getRange(2, col('press', 'show'), rows).insertCheckboxes()
  press.getRange(2, col('press', 'date'), rows).setNumberFormat('dd/MM/yyyy')
  press.getRange(2, col('press', 'kind'), rows).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(Object.keys(KINDS), true).setAllowInvalid(false).build())
  press.getRange(2, col('press', 'showLabel'), rows).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInRange(shows.getRange('A2:A'), true).setAllowInvalid(false).build())
  press.getRange(2, col('press', 'status'), rows).setFontColor('#777777')
  press.getRange(2, 1, rows, CONTENT.press.cols.length).setVerticalAlignment('top').setWrap(true)
  news.getRange(2, col('news', 'show'), rows).insertCheckboxes()
  news.getRange(2, col('news', 'pinned'), rows).insertCheckboxes()
  news.getRange(2, col('news', 'date'), rows).setNumberFormat('dd/MM/yyyy')
  news.getRange(2, 1, rows, CONTENT.news.cols.length).setVerticalAlignment('top').setWrap(true)
  shows.getRange(2, 2, rows).setNumberFormat('dd/MM/yyyy')
}

/* Chạy 1 lần (từ trình soạn Apps Script): nạp các bài báo đã có trên web (tools/google-sheet/press-seed.json trong repo)
   vào trang tính "Báo chí". Bài trùng link đã có trong Sheet thì bỏ qua — chạy lại không bị nhân đôi. */
const SEED_URL = 'https://raw.githubusercontent.com/webarebeat2026-beep/tanda-show/main/tools/google-sheet/press-seed.json'
function importBundledPress() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sh = ss.getSheetByName(CONTENT.press.sheet)
  if (!sh) throw new Error('Chưa có trang tính "Báo chí" — chạy setupContentSheets trước.')
  const head = headerIndex(sh)
  const have = new Set(readTable(sh, CONTENT.press.cols).map((r) => String(r.url).trim()))
  const seed = JSON.parse(UrlFetchApp.fetch(SEED_URL).getContentText('UTF-8'))
  const rows = seed.filter((a) => !have.has(a.url)).map((a) => {
    const row = new Array(sh.getLastColumn()).fill('')
    const put = (h, v) => { if (head[h] != null) row[head[h]] = v }
    put('Hiển thị', true)
    put('Link bài', a.url)
    put('Tên báo', a.outlet)
    put('Tiêu đề', a.title)
    put('Sapo', a.excerpt)
    put('Ảnh đại diện', a.image)
    put('Ngày đăng', new Date(a.date + 'T12:00:00+07:00'))
    put('Đêm diễn', a.showLabel)
    put('Loại', a.kind)
    put('Tình trạng', 'Nạp từ bản web cũ')
    return row
  })
  // thứ tự cũ → mới: bài mới nhất nằm cuối, đúng thói quen thêm bài mới vào dòng trống tiếp theo
  rows.reverse()
  const first = Math.max(2, lastFilledRow(sh, head['Link bài'] + 1) + 1)
  if (rows.length) sh.getRange(first, 1, rows.length, rows[0].length).setValues(rows)
  clearContentCache(true)
  ss.toast(`Đã nạp ${rows.length} bài.`, 'Tán Đa Show', 6)
}

/* Dòng cuối có dữ liệu trong 1 cột (getLastRow tính cả các dòng chỉ có ô tick trống) */
function lastFilledRow(sh, col) {
  const v = sh.getRange(1, col, sh.getMaxRows()).getValues()
  for (let i = v.length - 1; i >= 0; i--) if (String(v[i][0]).trim()) return i + 1
  return 1
}

/* Tự điền khi dán link: cần trigger "khi sửa" cài đặt (trigger đơn giản onEdit không được phép tải trang ngoài) */
function installEditTrigger() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  ScriptApp.getProjectTriggers().filter((t) => t.getHandlerFunction() === 'handleEdit').forEach((t) => ScriptApp.deleteTrigger(t))
  ScriptApp.newTrigger('handleEdit').forSpreadsheet(ss).onEdit().create()
  ss.toast('Đã bật: dán link vào cột "Link bài" là tự điền thông tin bài.', 'Tán Đa Show', 6)
}

function handleEdit(e) {
  const sh = e.range.getSheet()
  const names = Object.keys(CONTENT).map((k) => CONTENT[k].sheet)
  if (names.indexOf(sh.getName()) < 0) return
  clearContentCache(true)
  if (sh.getName() !== CONTENT.press.sheet) return
  const head = headerIndex(sh)
  const urlCol = head['Link bài'] + 1
  if (e.range.getColumn() > urlCol || e.range.getLastColumn() < urlCol) return
  for (let r = Math.max(2, e.range.getRow()); r <= e.range.getLastRow(); r++) fillPressRow(sh, r, head)
}

/* Menu: điền mọi dòng có link mà chưa có tiêu đề */
function fillAllPress() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sh = ss.getSheetByName(CONTENT.press.sheet)
  if (!sh) return ss.toast('Chưa có trang tính "Báo chí" — chạy "Tạo các trang tính nội dung" trước.', 'Tán Đa Show', 6)
  const head = headerIndex(sh)
  const values = sh.getDataRange().getValues()
  let n = 0
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][head['Link bài']]).trim() && !String(values[i][head['Tiêu đề']]).trim()) {
      fillPressRow(sh, i + 1, head)
      n++
    }
  }
  clearContentCache(true)
  ss.toast(n ? `Đã xử lý ${n} bài — xem cột "Tình trạng".` : 'Không có bài mới nào cần lấy thông tin.', 'Tán Đa Show', 6)
}

/* Đọc thẻ meta của bài gốc rồi điền vào các ô ĐANG TRỐNG (không ghi đè chỗ BTC đã sửa tay) */
function fillPressRow(sh, row, head) {
  const cell = (h) => sh.getRange(row, head[h] + 1)
  const url = String(cell('Link bài').getValue()).trim()
  if (!/^https?:\/\//i.test(url)) {
    if (url) cell('Tình trạng').setValue('Link không hợp lệ — cần bắt đầu bằng https://')
    return
  }
  const isNew = !String(cell('Tiêu đề').getValue()).trim()
  try {
    const info = readArticle(url)
    const setIfEmpty = (h, v) => { if (v && !String(cell(h).getValue()).trim()) cell(h).setValue(v) }
    setIfEmpty('Tên báo', info.outlet)
    setIfEmpty('Tiêu đề', info.title)
    setIfEmpty('Sapo', info.excerpt)
    setIfEmpty('Ảnh đại diện', info.image)
    setIfEmpty('Ngày đăng', info.date)
    setIfEmpty('Loại', info.kind)
    setIfEmpty('Đêm diễn', showForDate(info.date || new Date()))
    if (isNew) cell('Hiển thị').setValue(true)
    cell('Tình trạng').setValue(`Đã tự lấy thông tin lúc ${Utilities.formatDate(new Date(), TZ, 'HH:mm dd/MM')}${info.title ? '' : ' — KHÔNG thấy tiêu đề, cần điền tay'}`)
  } catch (err) {
    cell('Tình trạng').setValue('Không đọc được bài (' + String(err.message || err).slice(0, 80) + ') — điền tay Tiêu đề / Sapo / Ảnh / Ngày')
  }
}

function readArticle(url) {
  const res = UrlFetchApp.fetch(url, {
    headers: { 'User-Agent': UA, 'Accept-Language': 'vi,en;q=0.8' },
    muteHttpExceptions: true,
    followRedirects: true,
    validateHttpsCertificates: false, // vài báo thiếu chứng chỉ trung gian SSL (congluan.vn)
  })
  if (res.getResponseCode() >= 400) throw new Error('HTTP ' + res.getResponseCode())
  const page = res.getContentText('UTF-8')
  let title = tidy(meta(page, ['og:title']) || ((page.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || ''))
  let kind = 'Bài viết'
  const m = title.match(/^\[(Video|Ảnh|Infographic|Podcast)\]\s*/i)
  if (m) {
    kind = { video: 'Video', 'ảnh': 'Ảnh' }[m[1].toLowerCase()] || 'Bài viết'
    title = title.slice(m[0].length)
  }
  let rawDate = meta(page, ['article:published_time', 'datePublished', 'pubdate', 'dc.created'])
  if (!rawDate) rawDate = (page.match(/"datePublished"\s*:\s*"([^"]+)"/) || [])[1] || ''
  const excerpt = tidy(meta(page, ['og:description', 'description']).replace(/^(VTV\.vn|ANTD\.VN|\((?:HTV|CLO)\))\s*-?\s*/, ''))
  return { outlet: outletOf(url), title, excerpt, image: meta(page, ['og:image', 'twitter:image']), date: parseDate(rawDate), kind }
}

function meta(page, keys) {
  for (const k of keys) {
    const q = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const m = page.match(new RegExp(`<meta[^>]+(?:property|name|itemprop)=["']${q}["'][^>]*content=["']([^"']*)["']`, 'i')) ||
      page.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name|itemprop)=["']${q}["']`, 'i'))
    if (m && m[1].trim()) return unescapeHtml(m[1]).trim()
  }
  return ''
}

function unescapeHtml(s) {
  return s.replace(/&(#x?[0-9a-f]+|amp|lt|gt|quot|apos|#39);/gi, (all, c) => {
    const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }[c.toLowerCase()]
    if (named) return named
    const code = c[1] === 'x' || c[1] === 'X' ? parseInt(c.slice(2), 16) : parseInt(c.slice(1), 10)
    return isNaN(code) ? all : String.fromCodePoint(code)
  })
}

const tidy = (s) => String(s || '').replace(/\s+/g, ' ').replace(/ ,/g, ',').replace(/“ /g, '“').replace(/ ”/g, '”').trim()

function parseDate(raw) {
  raw = String(raw || '').trim()
  if (!raw) return ''
  const m = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/) // dạng M/D/YYYY h:m:s AM (hanoimoi, nguoihanoi)
  const d = m ? new Date(+m[3], +m[1] - 1, +m[2], 12) : new Date(raw)
  return isNaN(d) ? '' : d
}

function outletOf(url) {
  const host = (url.match(/^https?:\/\/([^/:?#]+)/i) || [])[1].toLowerCase().replace(/^www\./, '')
  for (const domain in OUTLETS) if (host === domain || host.endsWith('.' + domain)) return OUTLETS[domain]
  return host
}

/* Bài được gắn vào đêm sớm nhất diễn ra không quá 7 ngày trước ngày đăng (bài đăng trước đêm diễn vẫn tính cho đêm đó) */
function showForDate(date) {
  const shows = readShows()
  if (!shows.length) return ''
  const day = isoDate(date)
  const limit = isoDate(new Date(new Date(day + 'T12:00:00+07:00').getTime() - 7 * 864e5))
  const hit = shows.find((s) => s.date >= limit)
  return (hit || shows[shows.length - 1]).label
}

function readShows() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONTENT.shows.sheet)
  if (!sh) return []
  return readTable(sh, CONTENT.shows.cols)
    .map((r) => ({ label: String(r.label).trim(), date: isoDate(r.date) }))
    .filter((s) => s.label)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
}

function clearContentCache(silent) {
  CacheService.getScriptCache().remove('content')
  if (silent !== true) SpreadsheetApp.getActiveSpreadsheet().toast('Trang web sẽ hiện nội dung mới ở lần tải trang kế tiếp.', 'Tán Đa Show', 5)
}

/* JSON trang web đọc: { ok, updated, shows, press, news } — chỉ các dòng đã tick "Hiển thị" */
function getContent() {
  const cache = CacheService.getScriptCache()
  const hit = cache.get('content')
  if (hit) return hit
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const pressSh = ss.getSheetByName(CONTENT.press.sheet)
  const newsSh = ss.getSheetByName(CONTENT.news.sheet)
  const shows = readShows().map((s) => ({ id: slug(s.label), label: s.label, date: s.date }))

  const press = (pressSh ? readTable(pressSh, CONTENT.press.cols) : [])
    .filter((r) => r.show === true && safeUrl(r.url) && String(r.title).trim())
    .map((r) => {
      const date = isoDate(r.date)
      const label = String(r.showLabel).trim() || (date ? showForDate(date) : '')
      return {
        url: safeUrl(r.url),
        outlet: String(r.outlet).trim() || outletOf(r.url),
        title: tidy(r.title),
        excerpt: tidy(r.excerpt),
        date,
        showId: label ? slug(label) : '',
        kind: KINDS[String(r.kind).trim()] || 'article',
        image: safeImage(r.image),
      }
    })
    .sort(byDateDesc)

  const news = (newsSh ? readTable(newsSh, CONTENT.news.cols) : [])
    .filter((r) => r.show === true && String(r.title).trim())
    .map((r) => ({
      id: slug(isoDate(r.date) + '-' + r.title).slice(0, 80),
      pinned: r.pinned === true,
      date: isoDate(r.date),
      title: String(r.title).trim(),
      body: String(r.body || '').replace(/\r\n?/g, '\n').trim(),
      image: safeImage(r.image),
      link: safeUrl(r.link),
      linkLabel: String(r.linkLabel || '').trim(),
    }))
    .sort((a, b) => (b.pinned - a.pinned) || byDateDesc(a, b))

  const usedShows = shows.filter((s) => press.some((p) => p.showId === s.id)).map(({ id, label }) => ({ id, label }))
  const updated = press.reduce((d, p) => (p.date > d ? p.date : d), '')
  const out = JSON.stringify({ ok: true, updated, shows: usedShows, press, news })
  if (out.length < 90000) cache.put('content', out, CACHE_SECONDS) // CacheService giới hạn 100KB / khoá
  return out
}

/* Đọc trang tính theo TÊN cột (BTC có kéo đổi thứ tự cột vẫn chạy) */
function readTable(sh, cols) {
  const values = sh.getDataRange().getValues()
  const head = values.shift() || []
  const idx = cols.map((c) => head.indexOf(c[1]))
  return values.map((row) => {
    const o = {}
    cols.forEach((c, j) => { o[c[0]] = idx[j] >= 0 ? row[idx[j]] : '' })
    return o
  })
}

function headerIndex(sh) {
  const head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0]
  const o = {}
  head.forEach((h, i) => { o[String(h).trim()] = i })
  return o
}

function isoDate(v) {
  if (Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v)) return Utilities.formatDate(v, TZ, 'yyyy-MM-dd')
  const s = String(v || '').trim()
  let m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/)
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`
  m = s.match(/^\d{4}-\d{2}-\d{2}/)
  return m ? m[0] : ''
}

const byDateDesc = (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)

function slug(s) {
  return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/* Chỉ cho phép link http(s) — chặn javascript: và các kiểu link lạ */
function safeUrl(v) {
  v = String(v || '').trim()
  return /^https?:\/\/[^\s"'<>]+$/i.test(v) ? v : ''
}

/* Ảnh: link http(s), link Google Drive (đổi sang link ảnh xem trực tiếp), hoặc ảnh có sẵn trên web (press/…, artists/…) */
function safeImage(v) {
  v = String(v || '').trim()
  if (/^(press|artists)\/[\w.-]+$/.test(v)) return v
  const drive = v.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]{20,})/)
  if (drive) return `https://drive.google.com/thumbnail?id=${drive[1]}&sz=w1600`
  return safeUrl(v)
}

/* Cắt độ dài + giữ nguyên dạng chữ (số 0 đầu số điện thoại) + chặn chèn công thức (=, +, -, @) */
function clean(v) {
  v = v == null ? '' : String(v).slice(0, 2000)
  return /^[=+\-@0-9]/.test(v) ? "'" + v : v
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON)
}
