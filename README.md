# Tán Đa Show — Landing page

Trang giới thiệu **Tán Đa Show** — không gian âm nhạc cộng đồng dưới gốc đa 71 Hàng Trống, Hoàn Kiếm, Hà Nội.
Đơn vị chỉ đạo: Báo Nhân Dân · Phối hợp tổ chức: BEAT Network · Thực hiện: Nhà Văn Hóa.

**Trang đang chạy:** https://tanda-show.pages.dev

Công nghệ: React 18 + Tailwind CSS 4 + Framer Motion 11 (Vite). Bản build ra file `index.html` (ảnh, CSS, JS nhúng sẵn) + thư mục `press/` (ảnh đại diện các bài báo, tải lười khi cuộn tới).

---

## 1. Sửa nội dung thường gặp — chỉ cần mở `src/data.js`

Có thể sửa ngay trên GitHub: mở file → bấm biểu tượng ✏️ (Edit) → sửa → **Commit changes**.

| Muốn đổi | Biến trong `src/data.js` | Ghi chú |
|---|---|---|
| Lịch đêm diễn | `SHOWS` | Thêm đêm mới theo thứ tự thời gian. Vé "Cuộc hẹn sắp tới" tự chọn đêm gần nhất chưa diễn ra. `timeLabel: null` = giờ chưa công bố |
| Nghệ sĩ / line-up | `ARTISTS` | `showId` phải khớp `id` của đêm trong `SHOWS`. Trên trang: đêm sắp tới (hoặc mới nhất) hiện đầy đủ, các đêm trước tự thu gọn (rê chuột / bấm để mở). `tentative: true` = hiện chữ "dự kiến" |
| Menu đầu trang | `NAV` | |
| Đơn vị tổ chức (chân trang) | `ORGANIZERS` | Có logo thì hiện logo, chưa có thì hiện chữ |
| Nơi nhận form đề cử / liên hệ | `SUBMIT_ENDPOINT` | Để trống = chỉ lưu tạm trên trình duyệt người xem. Điền URL nhận POST JSON (Google Apps Script, Formspree, Supabase…) để thu dữ liệu thật |

Chỗ nào còn ghi `[CẦN ĐIỀN]` là thông tin BTC chưa cung cấp.

### Mục "Báo chí nói về Tán Đa"
Danh sách bài báo nằm ở `tools/press/sources.txt` (mỗi dòng 1 link bài gốc). Khi có bài mới:
1. Dán link vào cuối `tools/press/sources.txt`.
2. Chạy `python tools/press/crawl_press.py` (cần Python + `pip install pillow`) — script tự đọc tiêu đề, sapo, ngày đăng, ảnh đại diện của bài, ghi ra `src/press.js` và ảnh `public/press/`.
3. Commit cả 3 chỗ (`sources.txt`, `src/press.js`, `public/press/`) → trang tự cập nhật.

Bài được tự xếp vào "Số 01 / Số 02 / ..." theo ngày đăng (danh sách đêm diễn ở biến `SHOWS` đầu file `crawl_press.py`). Muốn ghi đè tên báo hoặc đêm diễn: `link | Tên báo | so-02`.

### Đổi ảnh
- Ảnh nằm trong `src/assets/` (`artists/` ảnh nghệ sĩ, `kv/` key visual, `logo/` logo).
- Nên dùng **WebP**, cạnh dài ~640–1100px, để trang nhẹ. Thay ảnh bằng file **cùng tên** thì không phải sửa code.
- Logo đầu trang (Báo Nhân Dân + "Chuyên trang của Báo Nhân Dân"): `src/assets/logo/bnd-chuyen-trang.svg`.

---

## 2. Xuất bản lên web

### Cách A — tự động (khuyên dùng)
Repo có sẵn workflow `.github/workflows/deploy.yml`: **mỗi lần commit lên nhánh `main`**, GitHub tự build và đẩy lên Cloudflare Pages (project `tanda-show`). Xem tiến trình ở tab **Actions**.

Cần cài 1 lần trong **Settings → Secrets and variables → Actions**:
- `CLOUDFLARE_API_TOKEN` — token Cloudflare có quyền *Cloudflare Pages: Edit*
- `CLOUDFLARE_ACCOUNT_ID` — ID tài khoản Cloudflare đang chứa project `tanda-show`

Chưa cài 2 secret này thì workflow chỉ build để kiểm tra lỗi, không đăng lên web.

### Cách B — thủ công trên máy
```bash
npm install        # lần đầu
npm run dev        # xem trực tiếp tại http://localhost:5173, sửa code tự tải lại
npm run build      # → dist/index.html
```
Sau đó nén **toàn bộ nội dung thư mục `dist/`** (`index.html` + thư mục `press/`) thành file `.zip` (index.html nằm ở gốc zip) → Cloudflare Pages → project `tanda-show` → **Create deployment** → tải file zip lên.
`dist/` cũng có thể mở trực tiếp bằng trình duyệt hoặc đưa lên bất kỳ hosting tĩnh nào.

---

## 3. Cấu trúc thư mục

```
src/
├── data.js            ← TOÀN BỘ nội dung (lịch diễn, nghệ sĩ, đơn vị, menu…)
├── components/        ← Navbar, Hero, About, Artists, Vote, NextShow, Footer, ui.jsx
├── assets/            ← ảnh, logo
├── index.css          ← màu sắc, font, hiệu ứng (design tokens)
└── lib.js             ← gửi form, tạo file lịch .ics
```

## 4. Nguyên tắc thiết kế — "Neo-Traditional Street"

- **Màu lấy từ KV**: nền *night* `#0E0B09`, *amber* `#F2B544` (màu hành động chính), *đỏ gạch* `#A63A28`, *xanh rêu* `#3F5634`. Các cặp chữ/nền đã kiểm tra tương phản WCAG — khi thêm màu mới nên kiểm tra lại.
- **Chữ**: *Playfair Display* (tiêu đề), *Be Vietnam Pro* (nội dung), *Space Mono* (nhãn/vé).
- **Bố cục**: ô bo góc lệch nhịp (`organic-a…d`), hạt giấy in, băng keo dán poster, tấm vé răng cưa.
- **Chuyển động**: tôn trọng cài đặt giảm chuyển động (`prefers-reduced-motion`); "Nghe thử khi rê chuột" mặc định Tắt.

## 5. Lưu ý bản quyền

Một số tranh minh hoạ trong `src/assets/` có chữ ký tác giả — cần có sự đồng ý của tác giả hoặc thay bằng ảnh thuộc quyền sử dụng của BTC.
