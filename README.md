# Tán Đa Show — Landing page

Trang giới thiệu **Tán Đa Show** — không gian âm nhạc cộng đồng dưới gốc đa 71 Hàng Trống, Hoàn Kiếm, Hà Nội.
Đơn vị chỉ đạo: Báo Nhân Dân · Phối hợp tổ chức: BEAT Network · Thực hiện: Nhà Văn Hóa.

**Trang đang chạy:** https://tanda-show.pages.dev

Công nghệ: React 18 + Tailwind CSS 4 + Framer Motion 11 (Vite). Bản build ra file `index.html` (ảnh, CSS, JS nhúng sẵn) + thư mục `press/` (ảnh đại diện các bài báo) + thư mục `artists/` (ảnh biểu diễn trong hồ sơ nghệ sĩ) — hai thư mục ảnh này tải lười, chỉ tải khi người xem cần.

---

## 1. Sửa nội dung thường gặp — chỉ cần mở `src/data.js`

Có thể sửa ngay trên GitHub: mở file → bấm biểu tượng ✏️ (Edit) → sửa → **Commit changes**.

| Muốn đổi | Biến trong `src/data.js` | Ghi chú |
|---|---|---|
| Lịch đêm diễn | `SHOWS` | Thêm đêm mới theo thứ tự thời gian. Vé "Cuộc hẹn sắp tới" tự chọn đêm gần nhất chưa diễn ra. `timeLabel: null` = giờ chưa công bố |
| Nghệ sĩ / line-up | `ARTISTS` | `showId` phải khớp `id` của đêm trong `SHOWS`. Trên trang: đêm sắp tới (hoặc mới nhất) hiện đầy đủ, các đêm trước tự thu gọn (rê chuột / bấm để mở). `tentative: true` = hiện chữ "dự kiến" |
| Menu đầu trang | `NAV` | |
| Đơn vị tổ chức (chân trang) | `ORGANIZERS` | Có logo thì hiện logo, chưa có thì hiện chữ |
| Nơi nhận dữ liệu form | `SUBMIT_ENDPOINT` | Đang trỏ tới Google Apps Script → Google Sheet "Tán Đa Show — Hồ sơ đăng ký & form trên landing" (tài khoản thaiph@beatnetwork.vn). Xem mục *Form & Google Sheet* bên dưới |

Chỗ nào còn ghi `[CẦN ĐIỀN]` là thông tin BTC chưa cung cấp.

### Hồ sơ nghệ sĩ — `src/artistProfiles.js`
Mỗi thẻ nghệ sĩ có nút **Hồ sơ nghệ sĩ** mở ngăn bên phải gồm 4 tab: *Giới thiệu* (bio + thành viên ban nhạc), *Bài hát* (link YouTube/Spotify, nhãn "Tại Tán Đa" cho tiết mục đã hát), *Ảnh* (ảnh biểu diễn tại Tán Đa) và *Báo chí*. Hàng biểu tượng dưới tên là các kênh chính thức (Facebook, Instagram, TikTok, YouTube, Spotify, SoundCloud).

- Khoá của mỗi hồ sơ = `id` của nghệ sĩ trong `ARTISTS` (`src/data.js`). Nghệ sĩ mới chưa có hồ sơ thì thẻ không hiện nút.
- Mục nào để trống thì tab đó tự ẩn (VD chưa có ảnh → không có tab Ảnh).
- Ảnh biểu diễn: thêm file WebP (cạnh dài ~1280px) vào `public/artists/`, khai báo trong `photos` kèm chú thích, tác giả ảnh (`credit`) và link bài gốc (`source`).
- Link chia sẻ thẳng một hồ sơ: `https://…/#nghe-si/<id>` (VD `#nghe-si/lynk-lee`).
- Chỉ ghi thông tin có nguồn — mỗi hồ sơ có dòng `// NGUỒN:` ghi rõ lấy từ đâu.

### Form & Google Sheet
Mọi form trên trang (Đăng ký biểu diễn, Đề cử, Gửi lời nhắn, Mong chờ, Nhắc lịch) gửi về **một** Google Sheet, mỗi loại một trang tính riêng (tự tạo khi có dữ liệu đầu tiên). Mã nhận dữ liệu: `tools/google-sheet/Code.gs` (Apps Script gắn với Sheet, hướng dẫn cài đặt ở đầu file).
- Muốn thêm/bớt cột: sửa `FORMS` trong Apps Script → **Triển khai → Quản lý triển khai → ✏️ → Phiên bản mới** (giữ nguyên URL), đồng thời sửa form tương ứng trong `src/components/`.
- Form **Đăng ký biểu diễn** (`src/components/Register.jsx`, mục `#dang-ky`) gồm 3 bước: Nghệ sĩ → Âm nhạc → Liên hệ.

### Báo chí & Tin tức — BTC tự cập nhật trên Google Sheet (không cần sửa code)
Mục **Báo chí nói về Tán Đa** (`#bao-chi`) và **Tin tức** (`#tin-tuc`) đọc thẳng từ Google Sheet *"Tán Đa Show — Hồ sơ đăng ký & form trên landing"* (cùng Sheet nhận form). Sửa Sheet là trang web đổi theo, chậm nhất ~1 phút, trên **mọi tên miền** (tandashow.nhandan.vn, tanda-show.pages.dev) — không cần build, commit hay tải lại code.

| Trang tính | Dùng để | Cách làm |
|---|---|---|
| **Báo chí** | Bài báo viết về Tán Đa | Dán link bài gốc vào cột *Link bài* (dòng trống cuối) → máy tự điền tên báo, tiêu đề, sapo, ảnh, ngày đăng, đêm diễn và tick *Hiển thị*. Ô nào sửa tay thì giữ nguyên. Bỏ tick *Hiển thị* = ẩn bài |
| **Tin tức** | Thông báo, tin thời sự của chương trình | Mỗi dòng 1 tin: *Tiêu đề* (bắt buộc), *Nội dung* (xuống dòng: Ctrl + Enter), *Ảnh* (link), *Link xem thêm* + *Chữ trên nút link* (không bắt buộc). Tick *Hiển thị* để đăng, tick *Ghim lên đầu* để tin luôn đứng đầu. Chưa có tin nào thì mục Tin tức và mục menu "Tin tức" tự ẩn |
| **Đêm diễn** | Danh sách nút lọc "Số 01 · 19.09…" của mục Báo chí | Có đêm mới: thêm 1 dòng (tên + ngày diễn) — bài báo đăng sau đó tự xếp vào đêm mới |

- Menu **Tán Đa Show** trên thanh công cụ Sheet: *Lấy thông tin cho các bài mới dán link* (khi dán nhiều link một lúc hoặc tự điền chưa chạy) · *Đẩy thay đổi lên web ngay* (bỏ qua bộ nhớ đệm 1 phút).
- Ảnh từ Google Drive: chia sẻ file ở chế độ *Bất kỳ ai có đường liên kết* rồi dán link vào ô ảnh.
- Mỗi ô có ghi chú hướng dẫn — rê chuột vào tiêu đề cột để xem.
- Mã xử lý: `tools/google-sheet/Code.gs` (Apps Script gắn với Sheet). Nếu Sheet không truy cập được, trang tự hiện danh sách bài đóng sẵn trong `src/press.js`.

<details><summary>Cách cũ (dự phòng): cào bài bằng script Python → src/press.js</summary>

1. Dán link vào cuối `tools/press/sources.txt`.
2. Chạy `python tools/press/crawl_press.py` (cần Python + `pip install pillow`) — ghi ra `src/press.js` và ảnh `public/press/`.
3. Commit cả 3 chỗ (`sources.txt`, `src/press.js`, `public/press/`).

Danh sách này chỉ hiện khi Google Sheet chưa có bài hoặc không tải được.
</details>

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
Sau đó nén **toàn bộ nội dung thư mục `dist/`** (`index.html` + thư mục `press/` + `artists/`) thành file `.zip` (index.html nằm ở gốc zip) → Cloudflare Pages → project `tanda-show` → **Create deployment** → tải file zip lên.
`dist/` cũng có thể mở trực tiếp bằng trình duyệt hoặc đưa lên bất kỳ hosting tĩnh nào.

---

## 3. Cấu trúc thư mục

```
src/
├── data.js            ← TOÀN BỘ nội dung (lịch diễn, nghệ sĩ, đơn vị, menu…)
├── artistProfiles.js  ← hồ sơ chi tiết từng nghệ sĩ (bio, thành viên, MXH, bài hát, ảnh, báo chí)
├── components/        ← Navbar, Hero, About, Artists, ArtistProfile, Vote (Đề cử), Register (Đăng ký biểu diễn), NextShow, News (Tin tức), Press, Footer, ui.jsx
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

Ảnh biểu diễn trong `public/artists/` lấy từ các bài ảnh của **Báo Nhân Dân** (đơn vị chỉ đạo), luôn ghi tên tác giả/nguồn và link bài gốc ngay dưới ảnh. Biểu tượng mạng xã hội dùng bộ Simple Icons (giấy phép CC0).
