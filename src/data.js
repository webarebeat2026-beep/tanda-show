/* ─────────────────────────────────────────────────────────────────────────
   DỮ LIỆU TRANG — sửa ở đây, không cần đụng vào component.
   ⚠ Các mục đánh dấu [CẦN ĐIỀN] là chỗ trống chờ thông tin thật từ BTC
     (tên nghệ sĩ, link tiết mục, bản nghe thử, chủ đề đêm diễn...).
   ───────────────────────────────────────────────────────────────────────── */
import lynkLee from './assets/artists/lynk-lee.webp'
import pinkFrog from './assets/artists/pink-frog.webp'
import theMagma from './assets/artists/the-magma.webp'
import vinhKhuat from './assets/artists/vinh-khuat.webp'
import sloth from './assets/artists/sloth.webp'
import nghich from './assets/artists/nghich.webp'
import tuanCry from './assets/artists/tuan-cry.webp'
import macMaiSuong from './assets/artists/mac-mai-suong.webp'
import ocean502 from './assets/artists/502-ocean.webp'
import thienKim from './assets/artists/thien-kim.webp'
import logoBND from './assets/logo/bao-nhan-dan.webp'
import logoBeat from './assets/logo/beat-network.webp'
import logoNVH from './assets/logo/nha-van-hoa.webp'

export const SLOGAN = 'Một tán đa. Nhiều thanh âm. Những cuộc gặp mới.'

export const NAV = [
  { href: '#ve-tan-da', label: 'Về Tán Đa' },
  { href: '#nghe-si', label: 'Nghệ sĩ' },
  { href: '#dem-dien', label: 'Đêm diễn' },
  { href: '#bao-chi', label: 'Báo chí' },
]

/* Section 3 — Nghệ sĩ từng đêm diễn (nguồn: hồ sơ chương trình chính thức "SHOW tháng 9.pdf", "Chính.pdf").
   showId: khớp với SHOWS bên dưới — thẻ được nhóm theo đêm diễn, thẻ đầu mỗi nhóm là thẻ dọc lớn.
   Trên trang: đêm sắp tới (hoặc mới nhất) hiện đầy đủ, các đêm trước thu gọn — rê chuột / bấm để mở.
   tone: màu duotone khi hover (amber | brick | moss).
   setlist: tiết mục chính (không đưa tiết mục dự phòng lên trang). Đêm đã diễn: theo tiết mục THỰC TẾ báo chí đưa tin
            (Báo Nhân Dân 19.09 & 10–11.10), có thể khác danh sách dự kiến trong hồ sơ chương trình.
   Hồ sơ chi tiết (bio, thành viên, mạng xã hội, bài hát, ảnh, báo chí) nằm ở src/artistProfiles.js.
   tentative: true → hiện nhãn "Dự kiến".
   videoUrl / preview: để '' thì ẩn nút xem lại / nghe thử. */
export const ARTISTS = [
  {
    id: 'lynk-lee',
    showId: 'ha-noi',
    name: 'Lynk Lee',
    role: 'Nghệ sĩ khách mời',
    blurb: 'Sinh năm 1988 tại Bắc Ninh. Giải nhất cuộc thi Tiếng hát sinh viên Trường Đại học Mở Hà Nội (2009–2010), bán kết Vietnam’s Got Talent 2013, Top 6 Miss International Queen Vietnam 2025.',
    setlist: ['Thì quá khứ', 'Buồn thì cứ khóc đi', 'Tát nước đầu đình'],
    image: lynkLee,
    w: 533, h: 800,
    pos: 'center 20%',
    alt: 'Ca sĩ Lynk Lee mặc đầm đen, tựa bên khung cửa sổ',
    tone: 'amber',
    videoUrl: '',
    preview: '',
  },
  {
    id: 'pink-frog',
    showId: 'ha-noi',
    name: 'Pink Frog',
    role: 'Nghệ sĩ indie',
    blurb: 'Tên thật Vũ Thành Lộc, nghệ sĩ indie viết nhạc từ năm 2014 — tác giả “Tôi và em”, “Ô cửa”, “Câu chuyện”.',
    setlist: ['Xa khỏi nơi bắt đầu', 'Người ơi', 'Ngày nào', 'Mong em', 'Ô cửa'],
    image: pinkFrog,
    w: 576, h: 576,
    pos: 'center 30%',
    alt: 'Nghệ sĩ Pink Frog đội mũ xanh, đeo kính, cười tươi trên nền cam',
    tone: 'brick',
    videoUrl: '',
    preview: '',
  },
  {
    id: 'the-magma',
    showId: 'ha-noi',
    name: 'The Magma',
    role: 'Band indie',
    blurb: 'Ban nhạc pop rock trẻ chơi sáng tác của chính mình, giọng ca chính Thanh Hiền (Bí Đỏ); EP đầu tay “Khong Mot...” (2026).',
    setlist: ['Manifest', 'A Song For You', 'Be Mine', 'Hơi men đầu môi', 'Trái tim tự do'],
    image: theMagma,
    w: 800, h: 533,
    pos: 'center 35%',
    alt: 'Sáu thành viên ban nhạc The Magma trong trang phục tối màu',
    tone: 'moss',
    videoUrl: '',
    preview: '',
  },
  {
    id: 'vinh-khuat',
    showId: 'phu-nu',
    name: 'Vinh Khuất',
    role: 'Nghệ sĩ khách mời',
    blurb: 'Sinh năm 1990 tại Hà Nội. Thí sinh ấn tượng nhất Giọng ca vàng 2005 tại Đức, giải nhất Made in Schauburg 2008, quán quân Boss Loop Station World Championship, nghệ sĩ được yêu thích nhất cuộc thi sáng tác ca khúc “Hören 2012” tại Hannover.',
    setlist: ['Quá lâu', 'Em là ai', 'Em không thể đẹp hơn'],
    image: vinhKhuat,
    w: 640, h: 427,
    pos: '55% center',
    alt: 'Nghệ sĩ Vinh Khuất mặc vest, hát bên đàn phím trên sân khấu',
    tone: 'brick',
    videoUrl: '',
    preview: '',
  },
  {
    id: 'sloth',
    showId: 'phu-nu',
    name: 'Sloth',
    role: 'Band indie',
    blurb: 'Ban nhạc trẻ đến từ Hà Đông, album đầu tay “Khi mà” phát hành cùng Sony Music Entertainment Vietnam.',
    setlist: ['Vẫn Vậy', 'Khi mà', 'Tan Biến'],
    image: sloth,
    w: 800, h: 533,
    pos: 'center 30%',
    alt: 'Ba thành viên ban nhạc Sloth đeo cà vạt vàng, giơ tay chữ V',
    tone: 'amber',
    videoUrl: '',
    preview: '',
  },
  {
    id: 'nghich',
    showId: 'phu-nu',
    name: 'Nghịch',
    role: 'Band indie',
    blurb: 'Ban nhạc pop punk / alternative rock Hà Nội; album “Zòn Zã” (2024), lưu diễn Bangkok, Hong Kong, Đài Loan năm 2025.',
    setlist: ['Chớp', 'Xinh', 'Ánh Đèn Đại Lộ'],
    image: nghich,
    w: 800, h: 533,
    pos: 'center 35%',
    alt: 'Năm thành viên ban nhạc Nghịch trong trang phục thể thao rực rỡ ở hậu trường',
    tone: 'moss',
    videoUrl: '',
    preview: '',
  },
  {
    id: 'tuan-cry',
    showId: 'trung-thu',
    name: 'Tuấn Cry',
    role: 'Nghệ sĩ',
    blurb: 'Sinh năm 1992 tại Bắc Ninh. Các thành tựu: Ca khúc của năm, MV của năm, Sự kết hợp xuất sắc, Top 10 Ca khúc được yêu thích nhất, Ca khúc được yêu thích trên radio do Làn Sóng Xanh bình chọn.',
    setlist: ['Chim sa cá lặn', 'Liễu yếu đào tơ', 'Mối duyên vàng (ft. Võ Thu Hà)'],
    image: tuanCry,
    w: 533, h: 800,
    pos: 'center 20%',
    alt: 'Ca sĩ Tuấn Cry mặc áo đỏ mận, tay chống cằm trên nền tối',
    tone: 'amber',
    videoUrl: '',
    preview: '',
  },
  {
    id: 'mac-mai-suong',
    showId: 'trung-thu',
    name: 'Mạc Mai Sương',
    role: 'Nghệ sĩ',
    blurb: 'Nghệ sĩ indie hoạt động độc lập tại Hà Nội, viết nhạc từ năm 15 tuổi — “Mơ”, “Vườn mây”, “Thu gọi”.',
    setlist: ['Thu gọi', 'Tự do như cách em là', 'Lời của cây'],
    image: macMaiSuong,
    w: 660, h: 439,
    pos: 'center 30%',
    alt: 'Ca sĩ Mạc Mai Sương tóc xoăn, mặc vest đen, hát bên chân micro',
    tone: 'brick',
    videoUrl: '',
    preview: '',
  },
  {
    id: '502-ocean',
    showId: 'trung-thu',
    name: '502 Ocean',
    role: 'Band',
    blurb: 'Ban nhạc pop-rock “Fifty to Ocean” — hành trình hướng ra biển lớn; album đầu tay “Quanh” (2025).',
    setlist: ['Chờ em', 'Vội vàng'],
    image: ocean502,
    w: 800, h: 778,
    pos: 'center 25%',
    alt: 'Ba thành viên ban nhạc 502 Ocean đứng trên nền trắng',
    tone: 'moss',
    videoUrl: '',
    preview: '',
  },
  {
    id: 'thien-kim',
    showId: 'trung-thu',
    name: 'Đặng Kim Thiên Kim',
    role: 'Nghệ sĩ nhí',
    blurb: 'Sinh năm 2012 tại Hà Nội. Theo học hệ trung cấp 6 năm ngành Nhạc cụ dân tộc tại Học viện Âm nhạc Việt Nam; từng tham gia concert quốc gia “Tổ Quốc trong tim”.',
    setlist: ['Rằm rộ'],
    image: thienKim,
    w: 600, h: 800,
    pos: 'center 12%',
    alt: 'Bé Đặng Kim Thiên Kim đeo khăn quàng đỏ, cầm giấy chứng nhận và hoa hướng dương',
    tone: 'amber',
    videoUrl: '',
    preview: '',
  },
]

/* Section 5 — Lịch diễn. Thêm đêm mới vào SHOWS theo thứ tự thời gian.
   Vé "Cuộc hẹn sắp tới" tự chọn đêm gần nhất chưa diễn ra; hết lịch → hiện đêm cuối với dấu "Đã diễn ra".
   timeLabel: null → giờ chưa công bố (vé ghi "Đang cập nhật", file lịch tạo sự kiện cả ngày). */
const VENUE = {
  venue: '71 Hàng Trống',
  address: '71 Hàng Trống, Hoàn Kiếm, Hà Nội',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=71+H%C3%A0ng+Tr%E1%BB%91ng%2C+Ho%C3%A0n+Ki%E1%BA%BFm%2C+H%C3%A0+N%E1%BB%99i',
}

export const SHOWS = [
  {
    id: 'trung-thu',
    title: 'Tán Đa Show',
    theme: 'Số đầu tiên · Chủ đề Trung thu, cùng chiến dịch Rằm Rộ',
    shortTheme: 'Chủ đề Trung thu',
    start: '2026-09-19T20:00:00+07:00',
    durationHours: 1.5,
    durationLabel: 'Khoảng 75–90 phút',
    timeLabel: '20H',
    dateLabel: '19.09.2026',
    dayLabel: '19.09',
    ...VENUE,
    parts: [
      { title: 'Phần 1 · Mở màn chương trình', text: 'Tiết mục múa lân, giới thiệu chương trình và nghệ sĩ nhí thể hiện ca khúc chủ đề. Đại diện các bên tổ chức phát biểu về mục đích của chương trình.' },
      { title: 'Phần 2 · Thanh âm', text: '2–3 nghệ sĩ biểu diễn các ca khúc dựa trên tinh thần chủ đề gốc.' },
      { title: 'Phần 3 · Ký ức trên thân cây', text: 'Trình chiếu mapping trên thân cây đa với chất liệu thị giác: trăng rằm, ánh đèn lồng, đầu sư tử Việt cổ, phố cổ, mặt nạ giấy bồi, bóng trẻ em rước đèn...' },
    ],
  },
  {
    id: 'ha-noi',
    title: 'Tán Đa Show',
    theme: 'Chủ đề Hà Nội · Kỷ niệm 72 năm Giải phóng Thủ đô',
    shortTheme: 'Chủ đề Hà Nội',
    start: '2026-10-10T20:00:00+07:00',
    durationHours: 1.5,
    durationLabel: 'Khoảng 75–90 phút',
    timeLabel: '20H',
    dateLabel: '10.10.2026',
    dayLabel: '10.10',
    ...VENUE,
    parts: [
      { title: 'Phần 1 · Kỷ niệm 72 năm Giải phóng Thủ đô', text: 'Dàn giao hưởng gồm 3 violin, 1 cello, 1 sáo, 1 saxophone và 1 piano, với những tiết mục mang màu sắc Hà Nội.' },
      { title: 'Phần 2 · Thanh âm', text: '2 band nhạc/nghệ sĩ indie trẻ trình diễn ca khúc của chính mình và 1 nghệ sĩ nổi tiếng giao lưu cùng khán giả.' },
    ],
  },
  {
    id: 'phu-nu',
    title: 'Tán Đa Show',
    theme: 'Chủ đề Phụ nữ Việt Nam · Mừng ngày 20.10',
    shortTheme: 'Chủ đề Phụ nữ Việt Nam',
    start: '2026-10-24T19:00:00+07:00',
    durationHours: 1.5,
    durationLabel: 'Khoảng 75–90 phút',
    timeLabel: '19H',
    dateLabel: '24.10.2026',
    dayLabel: '24.10',
    ...VENUE,
    parts: [
      { title: 'Phần 1 · Ngày Phụ nữ Việt Nam 20.10', text: 'Nhóm hợp xướng 10–15 nghệ sĩ nam biểu diễn và gửi tặng quà tới những người phụ nữ đi dạo phố đi bộ, cùng theo dõi chương trình.' },
      { title: 'Phần 2 · Thanh âm', text: '2 band nhạc/nghệ sĩ indie trẻ trình diễn ca khúc của chính mình và 1 nghệ sĩ nổi tiếng giao lưu cùng khán giả.' },
    ],
  },
]

/* Nghệ sĩ của một đêm diễn (tên kèm "dự kiến" nếu đánh dấu tentative) */
export const lineupOf = (showId) =>
  ARTISTS.filter((a) => a.showId === showId).map((a) => (a.tentative ? `${a.name} (dự kiến)` : a.name))

/* Thời điểm kết thúc của một đêm (giờ chưa công bố → hết ngày) */
export const showEnd = (show) =>
  new Date(show.start).getTime() + (show.timeLabel ? (show.durationHours || 2) * 3600e3 : 24 * 3600e3)

/* Đơn vị — theo KV chính thức tháng 10/2026 */
/* Chân trang: đơn vị có logo thì hiện logo (w/h = kích thước file gốc), chưa có logo thì hiện chữ */
export const ORGANIZERS = [
  { role: 'Đơn vị chỉ đạo', names: [{ name: 'Báo Nhân Dân', logo: logoBND, w: 520, h: 187 }] },
  { role: 'Đơn vị phối hợp tổ chức', names: [{ name: 'BEAT Network', logo: logoBeat, w: 440, h: 121 }] },
  { role: 'Đơn vị thực hiện', names: [{ name: 'Nhà Văn Hóa', logo: logoNVH, w: 440, h: 131 }] },
]

/* Nơi nhận dữ liệu mọi form trên trang (đăng ký biểu diễn, đề cử, lời nhắn, nhắc lịch...).
   Google Apps Script gắn với Google Sheet "Tán Đa Show — Hồ sơ đăng ký & form trên landing"
   (tài khoản thaiph@beatnetwork.vn) — mã script: tools/google-sheet/Code.gs. Để '' = chỉ lưu tạm trên trình duyệt. */
export const SUBMIT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwpNeuruIkGE0C0kLfI6JcBPAsgeyN_q3iULc9AT2xnpEZ8Gjum9o2oUpnuYPXwJbuxIA/exec'
