/**
 * Tán Đa Show — nhận dữ liệu các form trên landing page và ghi vào Google Sheet này.
 *
 * Cài đặt (1 lần):
 *  1. Mở Google Sheet nhận dữ liệu → Tiện ích mở rộng → Apps Script → dán toàn bộ file này → Lưu.
 *  2. Triển khai → Tùy chọn triển khai mới → Loại: Ứng dụng web
 *     · Thực thi với tư cách: Tôi   · Người có quyền truy cập: Bất kỳ ai   → Triển khai → cấp quyền.
 *  3. Copy "URL ứng dụng web" (…/exec) dán vào SUBMIT_ENDPOINT trong src/data.js → commit.
 * Sửa script sau này: Triển khai → Quản lý triển khai → ✏️ → Phiên bản: Phiên bản mới (giữ nguyên URL).
 *
 * Mỗi loại form ghi vào một trang tính riêng (tự tạo nếu chưa có).
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

function doGet() {
  return json({ ok: true, service: 'Tán Đa Show forms' })
}

/* Cắt độ dài + giữ nguyên dạng chữ (số 0 đầu số điện thoại) + chặn chèn công thức (=, +, -, @) */
function clean(v) {
  v = v == null ? '' : String(v).slice(0, 2000)
  return /^[=+\-@0-9]/.test(v) ? "'" + v : v
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON)
}
