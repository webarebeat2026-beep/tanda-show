/* ─────────────────────────────────────────────────────────────────────────
   HỒ SƠ NGHỆ SĨ — mở khi bấm "Hồ sơ" trên thẻ nghệ sĩ (khóa = id trong ARTISTS, data.js).
   Mục nào để trống / không khai báo thì tab tương ứng tự ẩn.

   intro    : giới thiệu chung 2–3 câu (chỉ ghi điều có nguồn — xem ghi chú NGUỒN cuối mỗi hồ sơ)
   members  : thành viên ban nhạc  [{ name, role }]
   links    : kênh chính thức       [{ type: facebook|instagram|tiktok|youtube|spotify|soundcloud, url }]
   songs    : bài hát               [{ title, url, note, live }]  — live: true = đã hát tại Tán Đa
   photos   : ảnh biểu diễn tại Tán Đa, file trong public/artists/  [{ src, w, h, caption, credit, source }]
   (ảnh chân dung ở đầu tab Giới thiệu = ảnh thẻ nghệ sĩ `image` trong data.js)
   press    : báo chí nói về nghệ sĩ [{ outlet, title, date (YYYY-MM-DD), url }]
   ───────────────────────────────────────────────────────────────────────── */

const ND_TANDA_1 = 'https://nhandan.vn/nhung-sac-mau-am-nhac-duoi-tan-da-post989669.html'
const ND_TANDA_2 = 'https://nhandan.vn/anh-tan-da-so-thu-2-hen-nhau-giua-thu-do-thang-muoi-post994393.html'
const ND_TANDA_3 = 'https://nhandan.vn/anh-vinh-khuat-cung-nghich-va-sloth-chay-het-minh-tai-tan-da-show-post997855.html'

const yt = (id) => `https://www.youtube.com/watch?v=${id}`

/* Bài báo về Tán Đa có nhắc tới nghệ sĩ (dùng chung giữa các hồ sơ) */
const P = {
  ndSacMau: { outlet: 'Báo Nhân Dân', title: 'Những sắc màu âm nhạc dưới tán đa', date: '2026-09-19', url: ND_TANDA_1 },
  ndHenNhau: { outlet: 'Báo Nhân Dân', title: 'Tán Đa số thứ 2 - Hẹn nhau giữa Thủ đô tháng Mười', date: '2026-10-11', url: ND_TANDA_2 },
  nd2000: {
    outlet: 'Báo Nhân Dân',
    title: 'Gần 2.000 khán giả thưởng thức số thứ 2 của Tán Đa Show tại khuôn viên Báo Nhân Dân',
    date: '2026-10-10',
    url: 'https://nhandan.vn/gan-2000-khan-gia-thuong-thuc-so-thu-2-cua-tan-da-show-tai-khuon-vien-bao-nhan-dan-post994372.html',
  },
  nguoiHaNoi: {
    outlet: 'Tạp chí Người Hà Nội',
    title: '“Tán Đa Show #02”: Hà Nội tháng Mười ngân vang dưới tán cây trăm tuổi',
    date: '2026-10-11',
    url: 'https://nguoihanoi.vn/tan-da-show-02-ha-noi-thang-muoi-ngan-vang-duoi-tan-cay-tram-tuoi-102874.html',
  },
  ndChay: { outlet: 'Báo Nhân Dân', title: 'Vinh Khuất cùng Nghịch và Sloth “cháy” hết mình tại “Tán Đa” show', date: '2026-10-24', url: ND_TANDA_3 },
  xayDung: {
    outlet: 'Báo Xây dựng',
    title: 'Vinh Khuất đốt cháy sân khấu Tán Đa, ban nhạc Nghịch khuấy động phố đi bộ Hồ Gươm',
    date: '2026-10-25',
    url: 'https://baoxaydung.vn/vinh-khuat-dot-chay-san-khau-tan-da-ban-nhac-nghich-khuay-dong-pho-di-bo-ho-guom-19226102501465321.htm',
  },
  tienPhong: {
    outlet: 'Báo Tiền Phong',
    title: 'Từ sân khấu dưới tán đa đến cơ hội cho những tài năng âm nhạc trẻ',
    date: '2026-10-13',
    url: 'https://svvn.tienphong.vn/tu-san-khau-duoi-tan-da-den-co-hoi-cho-nhung-tai-nang-am-nhac-tre-post1884929.tpo',
  },
}

const ndPhoto = (src, w, h, caption, source = ND_TANDA_2, credit = 'Báo Nhân Dân') => ({ src, w, h, caption, credit, source })

export const PROFILES = {
  'lynk-lee': {
    intro:
      'Ca sĩ – nhạc sĩ với nhiều ca khúc tự sáng tác; MV “Buồn thì cứ khóc đi” đã vượt 96 triệu lượt xem trên YouTube. Năm 2023 cô tham gia “Chị đẹp đạp gió rẽ sóng”, năm 2025 thi Miss International Queen Vietnam, và năm 2026 trở lại với single R&B/pop tự sáng tác “Thì quá khứ”.',
    links: [
      { type: 'facebook', url: 'https://www.facebook.com/Singer.LynkLee' },
      { type: 'instagram', url: 'https://www.instagram.com/lynk_lee' },
      { type: 'tiktok', url: 'https://www.tiktok.com/@lynk_lee' },
      { type: 'youtube', url: 'https://www.youtube.com/@lynk_lee' },
      { type: 'spotify', url: 'https://open.spotify.com/artist/7H9jPV9qWyp6V629038aXU' },
    ],
    songs: [
      { title: 'Thì quá khứ', url: yt('DUT6U7rj6d4'), note: 'Official Music Visualizer', live: true },
      { title: 'Buồn thì cứ khóc đi', url: yt('X-GCJwz4PnY'), note: 'Official MV', live: true },
      { title: 'Tát nước đầu đình', url: yt('6vGvIqeGxPc'), note: 'ft. Binz · Audio', live: true },
      { title: 'Cho tôi xin một vé đi tuổi thơ', url: yt('I0y45gN36Vk'), note: 'Official MV' },
    ],
    photos: [
      ndPhoto('artists/lynk-lee-1.webp', 1280, 854, 'Điểm nhấn của Tán Đa 2 là sự xuất hiện của ca sĩ Lynk Lee.'),
      ndPhoto('artists/lynk-lee-2.webp', 1280, 854, 'Lynk Lee duyên dáng tại Tán Đa 2.'),
      ndPhoto('artists/lynk-lee-3.webp', 1280, 854, 'Lynk Lee trình diễn trước sự theo dõi của đông đảo khán giả và người hâm mộ.'),
    ],
    press: [
      { outlet: 'Báo Tiền Phong', title: 'Lynk Lee: ‘Tôi không còn áp lực phải chứng minh bản thân với bất kỳ ai’', date: '2026-09-23', url: 'https://tienphong.vn/lynk-lee-toi-khong-con-ap-luc-phai-chung-minh-ban-than-voi-bat-ky-ai-post1878715.tpo' },
      P.nd2000,
      P.nguoiHaNoi,
      { outlet: 'VTC News', title: 'Lynk Lee phẫu thuật giọng nói thành công, hoàn thành ước mơ được là chính mình', date: '2022-07-28', url: 'https://vtcnews.vn/lynk-lee-phau-thuat-giong-noi-thanh-cong-hoan-thanh-uoc-mo-duoc-la-chinh-minh-ar690681.html' },
    ],
    // NGUỒN: Tiền Phong 23/09/2026 · lượt xem MV trên kênh YouTube @lynk_lee (20/10/2026) · link MXH lấy từ mục giới thiệu kênh YouTube chính thức.
  },

  'pink-frog': {
    intro:
      'Pink Frog (tên thật Vũ Thành Lộc) là gương mặt quen thuộc của nhạc indie Việt, bắt đầu viết nhạc từ năm 2014 và được biết đến qua “Tôi và em”, “Ô cửa”, “Câu chuyện”. Nghệ danh ra đời từ nhóm nhạc thời sinh viên gồm anh và người bạn chơi violin Cóc Béo. Nhạc của anh kể chuyện đời thường giản dị, nhiều bài thấp thoáng âm hưởng dân ca Bắc Bộ.',
    facts: [{ label: 'Sản phẩm', value: 'Album “Chuyển cảnh” · EP “Không nhất quán” · Album “Viết nhạc cho tỉnh” (cùng Hào, Mạnh Ninh)' }],
    links: [
      { type: 'facebook', url: 'https://www.facebook.com/chu.ech.hong' },
      { type: 'youtube', url: 'https://www.youtube.com/@PINKFROGOFFICIAL' },
      { type: 'spotify', url: 'https://open.spotify.com/artist/3Z1ArowingijWbVesn0aON' },
    ],
    songs: [
      { title: 'Xa khỏi nơi bắt đầu', url: yt('4l3LNAViZmc'), note: 'EP “Không nhất quán”', live: true },
      { title: 'Người ơi', url: yt('oE-n6-qCfDE'), note: 'Live · Bật Lửa Show', live: true },
      { title: 'Ngày nào', url: yt('13QcBzNuVaE'), note: 'Official Lyrics Video', live: true },
      { title: 'Mong em', url: yt('DkeAZs239ys'), note: 'Album “Chuyển cảnh”', live: true },
      { title: 'Ô cửa', url: '', live: true },
      { title: 'Tôi và em', url: yt('k8_kR36GeS4'), note: 'Official MV' },
    ],
    photos: [
      ndPhoto('artists/pink-frog-1.webp', 1280, 854, 'Pink Frog trình diễn tại Tán Đa 2.'),
      ndPhoto('artists/pink-frog-2.webp', 1280, 914, 'Pink Frog mang đến chất nhạc nhẹ nhàng, chân thành cùng những câu chuyện rất đời.'),
      ndPhoto('artists/pink-frog-3.webp', 1280, 854, 'Các thành viên của Pink Frog trình diễn tại Tán Đa 2.'),
    ],
    press: [
      P.ndHenNhau,
      P.nguoiHaNoi,
      { outlet: 'Sóng Trẻ', title: 'Với Pink Frog: “Âm nhạc giúp chữa lành vết thương tâm hồn”', date: '2021-11-21', url: 'https://songtre.com.vn/voi-pink-frog-am-nhac-giup-chua-lanh-vet-thuong-tam-hon-p21283.html' },
    ],
    // NGUỒN: Sóng Trẻ 21/11/2021 · Người Hà Nội, Tạp chí Du lịch VN 11/10/2026 · tên album/EP theo kênh YouTube chính thức. "Ô cửa" chưa có bản chính thức trên YouTube nên không gắn link.
  },

  'the-magma': {
    intro:
      'Ban nhạc pop rock trẻ với tinh thần “MAGMA – Nham thạch cảm xúc”, trình diễn các ca khúc do chính nhóm sáng tác. EP đầu tay “Khong Mot...” phát hành năm 2026. Tại Tán Đa #02, MAGMA là nhóm mở màn phần Live Session — lần đầu nhóm hát sáng tác của mình trên một sân khấu lớn vào dịp đặc biệt của Thủ đô.',
    members: [
      { name: 'Nguyễn Nam Giang', role: 'Trưởng nhóm · Bass · Sáng tác' },
      { name: 'Thanh Hiền (Bí Đỏ)', role: 'Giọng ca chính' },
      { name: 'Đăng Duy', role: 'Trống' },
      { name: 'Trương Xuân Hoàng', role: 'Keyboard' },
      { name: 'Trần Minh Sang', role: 'Guitar điện' },
      { name: 'Nguyễn Đình Hoan', role: 'Guitar điện' },
    ],
    links: [
      { type: 'facebook', url: 'https://www.facebook.com/profile.php?id=61585070923819' },
      { type: 'youtube', url: 'https://www.youtube.com/@the.magmaband' },
      { type: 'spotify', url: 'https://open.spotify.com/artist/2teMQnHEzAMRXYBGedS3N3' },
    ],
    songs: [
      { title: 'Manifest', url: '', live: true },
      { title: 'A Song For You', url: yt('aofN-__y2gI'), note: 'Lyric Video · EP “Khong Mot...”', live: true },
      { title: 'Be Mine', url: '', live: true },
      { title: 'Hơi men đầu môi', url: yt('UX1nYTcGAsk'), note: 'Lyric Video · EP “Khong Mot...”', live: true },
      { title: 'Trái tim tự do', url: 'https://open.spotify.com/track/2IQRrJZzoJL4OyG9CxdErA', note: 'Spotify · từ phim “Đội bóng nữ làng Xuân”', live: true },
      { title: 'Chẳng thể níu đôi tay', url: yt('_Rydv778odE'), note: 'Lyric Video' },
    ],
    photos: [
      ndPhoto('artists/the-magma-1.webp', 1280, 854, 'Ban nhạc MAGMA trình diễn mở đầu Tán Đa 2.'),
      ndPhoto('artists/the-magma-2.webp', 1280, 854, 'Main vocal Thanh Hiền (Bí Đỏ) tại chương trình.'),
      ndPhoto('artists/the-magma-3.webp', 1280, 853, 'Các thành viên của MAGMA trình diễn tại Tán Đa 2.'),
    ],
    press: [P.nd2000, P.ndHenNhau, P.tienPhong],
    // NGUỒN: thành viên theo phần mô tả video "Cố Chấp" trên kênh YouTube chính thức The MAGMA · EP/năm theo Spotify · Báo Nhân Dân, Tiền Phong 10–13/10/2026.
  },

  'tuan-cry': {
    intro:
      'Gần một thập kỷ làm nhạc sĩ, nhà sản xuất, Tuấn Cry đứng sau nhiều ca khúc mang hơi thở dân gian như “Bắc Bling”, “Lá ngọc cành vàng”, “Kén cá chọn canh”. Tháng 8/2026 anh chính thức ra mắt với vai trò ca sĩ qua EP “Mối duyên vàng” gồm 5 ca khúc, kể trọn một mối nhân duyên từ rung động đầu đến ngày hỷ sự.',
    links: [
      { type: 'facebook', url: 'https://www.facebook.com/TuanCrydz' },
      { type: 'youtube', url: 'https://www.youtube.com/@tuancry' },
      { type: 'spotify', url: 'https://open.spotify.com/artist/1XeMw22FKMPIjQIkyV3yDN' },
    ],
    songs: [
      { title: 'Chim sa cá lặn', url: yt('JC0dktKMswg'), note: 'Official MV', live: true },
      { title: 'Liễu yếu đào tơ', url: yt('GebXFnPOR6A'), note: 'Visualizer', live: true },
      { title: 'Mối duyên vàng (ft. Võ Thu Hà)', url: yt('yszxOH4e5eA'), note: 'MV Animation', live: true },
    ],
    photos: [
      ndPhoto('artists/tuan-cry-1.webp', 1280, 806, 'Ca sĩ, nhạc sĩ Tuấn Cry với những ca khúc mang âm hưởng dân gian.', ND_TANDA_1, 'Khiếu Minh / Báo Nhân Dân'),
      ndPhoto('artists/tuan-cry-2.webp', 1280, 854, 'Tuấn Cry và Võ Thu Hà giao lưu với khán giả nhỏ tuổi.', ND_TANDA_1, 'Khiếu Minh / Báo Nhân Dân'),
    ],
    press: [
      P.ndSacMau,
      { outlet: 'Tuổi Trẻ Cười', title: '‘Hit-maker’ Tuấn Cry lấn sân làm ca sĩ', date: '2026-08-06', url: 'https://cuoi.tuoitre.vn/hit-maker-tuan-cry-lan-san-lam-ca-si-100260806141715608.htm' },
      { outlet: 'Báo Thanh Niên', title: 'Tác giả ‘Bắc Bling’ làm ca sĩ', date: '2026-08-06', url: 'https://thanhnien.vn/tac-gia-bac-bling-lam-ca-si-185260806090225782.htm' },
      { outlet: 'Thể thao & Văn hóa', title: 'Tuấn Cry ra mắt MV ‘Chim sa cá lặn’ đánh dấu cột mốc mới', date: '2026-08-07', url: 'https://thethaovanhoa.vn/tuan-cry-ra-mat-mv-chim-sa-ca-lan-danh-dau-cot-moc-moi-20260807142742299.htm' },
    ],
    // NGUỒN: Tuổi Trẻ Cười 06/08/2026 · Facebook trang nghệ sĩ (522K theo dõi) liên kết từ kênh YouTube chính thức.
  },

  'mac-mai-suong': {
    intro:
      'Nghệ sĩ indie hoạt động độc lập tại Hà Nội, bắt đầu viết nhạc từ năm 15 tuổi. Giọng hát ấm cùng những sáng tác giàu chất thơ như “Mơ”, “Vườn mây”, “Thu gọi”; cô từng biểu diễn cùng ban nhạc Mạc and the Odd Stones và góp giọng trong bản “Đá tan” cùng Ngọt.',
    links: [
      { type: 'facebook', url: 'https://www.facebook.com/blaaoi' },
      { type: 'instagram', url: 'https://www.instagram.com/blaaoi' },
      { type: 'youtube', url: 'https://www.youtube.com/@MacMaiSuong' },
      { type: 'spotify', url: 'https://open.spotify.com/artist/7fMznGrNJs6H2kZbiqDPgE' },
    ],
    songs: [
      { title: 'Thu gọi', url: yt('Ke-UcR4pfI4'), note: 'Official MV', live: true },
      { title: 'Tự do như cách em là', url: '', live: true },
      { title: 'Lời của cây', url: '', live: true },
      { title: 'Đá tan (Ngọt, Mạc Mai Sương)', url: yt('VbtVgQn_Zkk'), note: 'Audio' },
      { title: 'Luôn luôn', url: yt('aP8b4hgakGM'), note: 'Homemade Lyric Video' },
    ],
    photos: [
      ndPhoto('artists/mac-mai-suong-1.webp', 1280, 854, 'Mạc Mai Sương trên sân khấu Tán Đa số đầu tiên.', ND_TANDA_1, 'Khiếu Minh / Báo Nhân Dân'),
      ndPhoto('artists/mac-mai-suong-2.webp', 1000, 562, 'Tiết mục của ca sĩ Mạc Mai Sương trong chương trình.', ND_TANDA_1, 'Khiếu Minh / Báo Nhân Dân'),
    ],
    press: [
      P.ndSacMau,
      { outlet: 'Eva', title: 'Mạc Mai Sương: Chất nhạc “vừa đủ hiếm” sau 10 năm phiêu du với “miền đất” Indie', date: '2024-07-25', url: 'https://eva.vn/lang-sao/mac-mai-suong-chat-nhac-vua-du-hiem-sau-10-nam-phieu-du-voi-mien-dat-indie-c20a603220.html' },
      { outlet: 'Saigoneer', title: 'Mạc Mai Sương: Không chỉ mộc mạc và dịu dàng', date: '2021-10-28', url: 'https://saigoneer.com/vn/quang-8-octave/17072-m%E1%BA%A1c-mai-s%C6%B0%C6%A1ng-kh%C3%B4ng-ch%E1%BB%89-m%E1%BB%99c-m%E1%BA%A1c-v%C3%A0-d%E1%BB%8Bu-d%C3%A0ng' },
    ],
    // NGUỒN: Eva 25/07/2024, Saigoneer 28/10/2021 · tiết mục tại Tán Đa theo Báo Nhân Dân 19/09/2026 · "Đá tan" ghi Ngọt, Mạc Mai Sương trên Spotify.
  },

  '502-ocean': {
    intro:
      'Ban nhạc pop-rock trẻ, tên đọc là “Fifty to Ocean” — hành trình hướng ra biển lớn, rời khỏi sự chật chội của phố thị để tìm tự do. Âm nhạc của nhóm trẻ trung, giàu cảm xúc, pha chất indie-pop đương đại; album đầu tay “Quanh” phát hành ngày 04/11/2025.',
    members: [
      { name: 'Long Thành', role: 'Giọng ca chính · Sáng tác' },
      { name: 'Nguyễn Việt Hùng', role: 'Sản xuất · Keyboard' },
      { name: 'Tuấn Anh', role: 'Trống' },
    ],
    links: [
      { type: 'facebook', url: 'https://www.facebook.com/502Ocean.music' },
      { type: 'instagram', url: 'https://www.instagram.com/502ocean/' },
      { type: 'tiktok', url: 'https://www.tiktok.com/@502ocean' },
      { type: 'youtube', url: 'https://www.youtube.com/@502Ocean' },
      { type: 'spotify', url: 'https://open.spotify.com/artist/0Kt6VpEHduO4ONq6f8rSTg' },
    ],
    songs: [
      { title: 'Chờ em', url: yt('hh6XZL0G_aE'), note: 'Official MV', live: true },
      { title: 'Vội vàng', url: yt('_hz-CR-Zne0'), note: 'Official Lyric Video', live: true },
      { title: 'Chúng ta giữa đêm', url: yt('isMEEV3zoLU'), note: 'Official Lyric Video' },
      { title: 'Rời xa', url: yt('bD13SacPPhc'), note: 'Official MV' },
    ],
    press: [P.ndSacMau, P.tienPhong],
    // NGUỒN: mục giới thiệu kênh YouTube chính thức 502 Ocean (thành viên) · ngày phát hành album theo video "Quanh (Album Highlight Medley)" và vietnam.vn 13/12/2025.
    // Chưa có ảnh biểu diễn có chú thích rõ của 502 Ocean tại Tán Đa → tab Ảnh tự ẩn, BTC bổ sung sau.
  },

  'thien-kim': {
    intro:
      'Sinh năm 2012 tại Hà Nội, theo học hệ trung cấp ngành Nhạc cụ dân tộc tại Học viện Âm nhạc Việt Nam. Em từng giành Giải Nhất Giọng hát Họa Mi Hà Nội 2023, Giải Nhất Tài năng Thiếu nhi Thủ đô 2024 và biểu diễn tại concert quốc gia “Tổ quốc trong tim”.',
    links: [{ type: 'youtube', url: 'https://www.youtube.com/@%C4%90%E1%BA%B7ngKimThi%C3%AAnKimOfficial' }],
    songs: [{ title: 'Rằm rộ', url: yt('aS_1Kv_lhs8'), note: 'Bản gốc: Hà Myo · Official MV', live: true }],
    press: [
      P.ndSacMau,
      { outlet: 'Báo Nhân Dân', title: 'Giọng ca “Tài năng thiếu nhi thủ đô” ra MV về mẹ', date: '2025-03-09', url: 'https://nhandan.vn/giong-ca-tai-nang-thieu-nhi-thu-do-ra-mv-ve-me-post863951.html' },
    ],
    // NGUỒN: hồ sơ chương trình "SHOW tháng 9.pdf" · Báo Nhân Dân 09/03/2025. Nghệ sĩ nhí → chỉ gắn kênh YouTube chính thức, không gắn Facebook/TikTok cá nhân.
  },

  'vinh-khuat': {
    intro:
      'Nghệ sĩ người Đức gốc Việt (tên thật Khuất Duy Vinh), nổi tiếng với lối trình diễn loop station một mình như cả ban nhạc. Khán giả trong nước biết đến anh từ Gala Sao Mai 2019 với “Quá lâu”; cùng năm anh biểu diễn tại Monsoon Music Festival ở Hoàng thành Thăng Long.',
    links: [
      { type: 'facebook', url: 'https://www.facebook.com/vinhkhuatmusic' },
      { type: 'youtube', url: 'https://www.youtube.com/@vinhkhuatmusic' },
      { type: 'spotify', url: 'https://open.spotify.com/artist/0Hxo49G2Y9jzrRGqQeok1m' },
    ],
    songs: [
      { title: 'Quá lâu', url: yt('i6iSoGeo7_k'), note: 'Live · Gala Sao Mai' },
      { title: 'Em là ai', url: yt('paaQhrCaHC8'), note: 'Vinh Khuất x Sèn Hoàng Mỹ Lam x Benjamin' },
      { title: 'Em không thể đẹp hơn', url: yt('ZI-q1nUiaLk') },
    ],
    photos: [
      ndPhoto('artists/vinh-khuat-1.webp', 1280, 853, 'Ca sĩ Vinh Khuất trình diễn ca khúc “Quá lâu”.', ND_TANDA_3),
      ndPhoto('artists/vinh-khuat-2.webp', 1280, 853, 'Tác phẩm “Như bài tình ca” được Vinh Khuất thể hiện đầy cảm xúc.', ND_TANDA_3),
      ndPhoto('artists/vinh-khuat-3.webp', 1280, 853, 'Đan xen các ca khúc, ca sĩ Vinh Khuất nhiệt tình giao lưu với khán giả.', ND_TANDA_3),
      ndPhoto('artists/vinh-khuat-4.webp', 1280, 853, 'Ca khúc “Việt Nam” khuấy động sân khấu Tán Đa.', ND_TANDA_3),
    ],
    press: [
      P.ndChay,
      P.xayDung,
      { outlet: 'Báo Tuổi Trẻ', title: 'Vinh Khuất: Bị khán giả Việt chê xấu trai nhưng lại khen nhạc hay', date: '2019-11-01', url: 'https://tuoitre.vn/vinh-khuat-bi-khan-gia-viet-che-xau-trai-nhung-lai-khen-nhac-hay-20191031163747141.htm' },
      { outlet: 'VTV', title: 'Chàng trai gốc Việt “gây sốt” trên mạng xã hội khi mang cả “phòng thu” lên sân khấu Gala Sao Mai 2019', date: '2019-04-09', url: 'https://vtv.vn/truyen-hinh/chang-trai-goc-viet-gay-sot-tren-mang-xa-hoi-khi-mang-ca-phong-thu-len-san-khau-gala-sao-mai-2019-20190409154159477.htm' },
      { outlet: 'Báo Công an Nhân dân', title: 'Nghệ sĩ Vinh Khuất: Tôi có thể “chết” sau mỗi lần biểu diễn', date: '2019-11-14', url: 'https://cand.com.vn/Nhan-vat-hot/Nghe-si-Vinh-Khuat-Toi-co-the-chet-sau-moi-lan-bieu-dien-i543321/' },
    ],
    // NGUỒN: Tuổi Trẻ 01/11/2019, VTV 09/04/2019 · link bài hát theo hồ sơ "Chính.pdf" · ảnh tại Tán Đa theo Báo Nhân Dân 24/10/2026.
  },

  sloth: {
    intro:
      'Ban nhạc trẻ đến từ Hà Đông, Hà Nội, tự nhận là “tổ hợp các cháu trai gái trẻ Hà Đông”. Album đầu tay “Khi mà” phát hành cùng Sony Music Entertainment Vietnam; nhóm được biết đến qua “Tan biến”, “Vẫn vậy”, “Phất phơ”.',
    members: [
      { name: 'Nguyễn Vũ Minh Thu', role: 'Giọng ca chính' },
      { name: 'Phùng Mạnh Hùng', role: 'Sáng tác · Guitar' },
      { name: 'Nguyễn Trường Giang', role: 'Sản xuất · Guitar' },
    ],
    links: [
      { type: 'facebook', url: 'https://www.facebook.com/slothebend/' },
      { type: 'instagram', url: 'https://www.instagram.com/slothebend_' },
      { type: 'tiktok', url: 'https://www.tiktok.com/@slothebend_vn' },
      { type: 'youtube', url: 'https://www.youtube.com/@sloth6341' },
      { type: 'spotify', url: 'https://open.spotify.com/artist/0pZYFZp4sO1moiEvytkWGU' },
    ],
    songs: [
      { title: 'Vẫn vậy', url: yt('XnKm_v7iwLk'), note: 'Official MV' },
      { title: 'Khi mà', url: yt('lF2B2jBz5Yg'), note: 'Official MV' },
      { title: 'Tan biến', url: yt('XWzTOC-FIFk'), note: 'Official MV' },
    ],
    photos: [
      ndPhoto('artists/sloth-1.webp', 1280, 852, 'Nhóm nhạc Sloth trình diễn 5 bài hát: “Phất phơ”, “Ngủ quên”, “Về với tôi”, “Thuở mới tấm bé” và “Khi mà”.', ND_TANDA_3),
      ndPhoto('artists/sloth-2.webp', 1280, 862, 'Ca sĩ trẻ Minh Thu chìm đắm trong màn trình diễn.', ND_TANDA_3),
    ],
    press: [P.ndChay],
    // NGUỒN: mô tả kênh + credit album "Khi mà" trên kênh YouTube chính thức Sloth · ảnh + tiết mục tại Tán Đa theo Báo Nhân Dân 24/10/2026.
  },

  nghich: {
    intro:
      'Ban nhạc pop punk / alternative rock đến từ Hà Nội. Nhóm đã ra EP “Nghịch ngợm” và album đầu tay “Zòn Zã” (2024); năm 2025 lưu diễn trong và ngoài nước, từ Starnest Music Festival (Bangkok, Hong Kong), Beyond Borders – Asia Rock (Hà Nội, Sài Gòn) đến chuỗi diễn tại Đài Loan.',
    members: [
      { name: 'Huyền Anh', role: 'Vocal' },
      { name: 'Duy Đức', role: 'Guitar' },
      { name: 'Quang', role: 'Keyboard' },
      { name: 'Đạt', role: 'Bass' },
      { name: 'Hiếu', role: 'Trống' },
    ],
    links: [
      { type: 'facebook', url: 'https://www.facebook.com/bannhacNghich' },
      { type: 'instagram', url: 'https://www.instagram.com/toila.nghich/' },
      { type: 'youtube', url: 'https://www.youtube.com/@nghichofficial' },
      { type: 'spotify', url: 'https://open.spotify.com/artist/5Sxbs19fBAO3LohHU3j9ZB' },
      { type: 'soundcloud', url: 'https://soundcloud.com/nghichofficial' },
    ],
    songs: [
      { title: 'Chớp', url: yt('aH7QbuLSFaI'), note: 'Official MV Lyric' },
      { title: 'Xinh', url: yt('xyqoQiDCAFA'), note: 'Official MV' },
      { title: 'Ánh đèn đại lộ', url: yt('hM-vVlKJjBI'), note: 'EP “Nghịch ngợm”' },
    ],
    photos: [ndPhoto('artists/nghich-1.webp', 1280, 846, 'Huyền Anh, giọng ca chính của ban nhạc Nghịch.', ND_TANDA_3)],
    press: [
      P.ndChay,
      P.xayDung,
      { outlet: 'Báo Tuổi Trẻ', title: 'Các ban nhạc rock gen Z siêu hòa nhập', date: '2024-06-16', url: 'https://tuoitre.vn/cac-ban-nhac-rock-gen-z-sieu-hoa-nhap-20240616103428414.htm' },
    ],
    // NGUỒN: mục giới thiệu kênh YouTube chính thức Nghịch (thành viên, EP/album, lưu diễn 2025) · Tuổi Trẻ 16/06/2024.
  },
}
