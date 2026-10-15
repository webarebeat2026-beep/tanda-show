"""Cào thông tin các bài báo viết về Tán Đa → src/press.js + ảnh public/press/*.webp

Chạy (từ thư mục tanda-landing):   python tools/press/crawl_press.py
Cần: Python 3.9+ và Pillow (pip install pillow).

Với mỗi link trong tools/press/sources.txt, script đọc thẻ meta chuẩn của bài (og:title, og:description,
og:image, ngày xuất bản) — tức đúng tiêu đề / sapo / ảnh đại diện mà chính toà soạn công bố, không viết lại.
Bài nào không tải được sẽ bị bỏ qua và báo ở cuối, các bài khác vẫn giữ nguyên.
"""
import gzip
import html
import io
import json
import re
import subprocess
import sys
import urllib.request
from datetime import datetime, timedelta, timezone
from http.cookiejar import CookieJar
from pathlib import Path
from urllib.parse import urlparse

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SOURCES = Path(__file__).with_name('sources.txt')
OUT_JS = ROOT / 'src' / 'press.js'
IMG_DIR = ROOT / 'public' / 'press'
IMG_W, IMG_H = 640, 400  # ảnh thẻ 16:10

VN = timezone(timedelta(hours=7))

# Các đêm diễn — bài báo được gắn vào đêm sớm nhất diễn ra không quá 7 ngày trước ngày đăng bài
# (bài "nóng" đăng trước đêm diễn vẫn tính cho đêm đó). Thêm đêm mới vào đây khi có lịch.
SHOWS = [
    ('so-01', '2026-09-19', 'Số 01 · 19.09'),
    ('so-02', '2026-10-10', 'Số 02 · 10.10'),
    ('so-03', '2026-10-24', 'Số 03 · 24.10'),
]

# Tên hiển thị của cơ quan báo chí theo tên miền
OUTLETS = {
    'nhandan.vn': 'Báo Nhân Dân',
    'vietnamplus.vn': 'VietnamPlus',
    'vtv.vn': 'VTV',
    'htv.vn': 'HTV',
    'qdnd.vn': 'Báo Quân đội Nhân dân',
    'hanoimoi.vn': 'Báo Hànộimới',
    'nguoihanoi.vn': 'Tạp chí Người Hà Nội',
    'congluan.vn': 'Báo Công Luận',
    'danviet.vn': 'Báo Dân Việt',
    'phunuvietnam.vn': 'Báo Phụ nữ Việt Nam',
    'thethaovanhoa.vn': 'Thể thao & Văn hóa',
    'vntravel.org.vn': 'Tạp chí Du lịch Việt Nam',
    'soha.vn': 'Soha',
    'cafef.vn': 'CafeF',
    'afamily.vn': 'aFamily',
    'tienphong.vn': 'Báo Tiền Phong',
    'anninhthudo.vn': 'Báo An ninh Thủ đô',
    'congly.vn': 'Báo Công Lý',
    'baophapluat.vn': 'Báo Pháp luật Việt Nam',
    'baoxaydung.vn': 'Báo Xây dựng',
}

UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36'
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(CookieJar()))


def fetch(url, timeout=30):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Language': 'vi,en;q=0.8'})
    try:
        with opener.open(req, timeout=timeout) as r:
            data = r.read()
    except Exception:
        # Dự phòng bằng curl: vài báo thiếu chứng chỉ trung gian SSL hoặc chặn urllib
        data = subprocess.run(['curl', '-sSfL', '--max-time', str(timeout), '-A', UA, url],
                              capture_output=True, check=True).stdout
    return gzip.decompress(data) if data[:2] == bytes([0x1F, 0x8B]) else data  # vài CMS luôn trả gzip


def meta(page, *keys):
    for k in keys:
        k = re.escape(k)
        m = re.search(rf'<meta[^>]+(?:property|name|itemprop)=["\']{k}["\'][^>]*content=["\']([^"\']*)["\']', page, re.I) \
            or re.search(rf'<meta[^>]+content=["\']([^"\']*)["\'][^>]*(?:property|name|itemprop)=["\']{k}["\']', page, re.I)
        if m and m.group(1).strip():
            return html.unescape(m.group(1)).strip()
    return ''


def parse_date(raw):
    raw = raw.strip()
    m = re.match(r'(\d{1,2})/(\d{1,2})/(\d{4})', raw)  # dạng M/D/YYYY h:m:s AM (hanoimoi, nguoihanoi)
    if m:
        return datetime(int(m.group(3)), int(m.group(1)), int(m.group(2)), tzinfo=VN)
    dt = datetime.fromisoformat(re.sub(r'\.\d+', '', raw).replace('Z', '+00:00'))
    return (dt if dt.tzinfo else dt.replace(tzinfo=VN)).astimezone(VN)


def outlet_of(url):
    host = urlparse(url).hostname.removeprefix('www.')
    for domain, name in OUTLETS.items():
        if host == domain or host.endswith('.' + domain):
            return name
    return host


def show_of(day):
    for sid, d, _ in SHOWS:
        if datetime.fromisoformat(d).date() >= day - timedelta(days=7):
            return sid
    return SHOWS[-1][0]


def clean(s):
    return re.sub(r'\s+', ' ', s).replace(' ,', ',').replace('“ ', '“').replace(' ”', '”').strip()


def crawl(line):
    parts = [p.strip() for p in line.split('|')]
    url = parts[0]
    page = fetch(url).decode('utf-8', 'ignore')
    title = clean(meta(page, 'og:title') or re.search(r'<title>(.*?)</title>', page, re.S).group(1))
    kind = 'article'
    m = re.match(r'\[(Video|Ảnh|Infographic|Podcast)\]\s*', title, re.I)
    if m:
        kind = {'video': 'video', 'ảnh': 'photo'}.get(m.group(1).lower(), 'article')
        title = title[m.end():]
    raw_date = meta(page, 'article:published_time', 'datePublished', 'pubdate', 'dc.created')
    if not raw_date:
        m = re.search(r'"datePublished"\s*:\s*"([^"]+)"', page)
        raw_date = m.group(1) if m else ''
    date = parse_date(raw_date)
    desc = clean(re.sub(r'^(VTV\.vn|ANTD\.VN|\((?:HTV|CLO)\))\s*-?\s*', '', meta(page, 'og:description', 'description')))
    slug = re.sub(r'[^a-z0-9]+', '-', urlparse(url).hostname.removeprefix('www.').split('.')[0] + '-' + urlparse(url).path.lower())[-60:].strip('-')
    image = ''
    img_url = meta(page, 'og:image') or meta(page, 'twitter:image')
    try:  # ảnh lỗi (CDN của báo trả 404...) thì vẫn giữ bài, thẻ hiện dạng chữ
        im = Image.open(io.BytesIO(fetch(img_url))).convert('RGB')
        scale = max(IMG_W / im.width, IMG_H / im.height)
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
        left, top = (im.width - IMG_W) // 2, (im.height - IMG_H) // 2
        im.crop((left, top, left + IMG_W, top + IMG_H)).save(IMG_DIR / f'{slug}.webp', 'WEBP', quality=70, method=6)
        image = f'press/{slug}.webp'
    except Exception as e:
        print(f'      (không lấy được ảnh: {e.__class__.__name__}) {img_url}')
    return {
        'url': url,
        'outlet': parts[1] if len(parts) > 1 and parts[1] else outlet_of(url),
        'title': title,
        'excerpt': desc,
        'date': date.strftime('%Y-%m-%d'),
        'showId': parts[2] if len(parts) > 2 and parts[2] else show_of(date.date()),
        'kind': kind,
        'image': image,
    }


def main():
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    lines = [l.strip() for l in SOURCES.read_text(encoding='utf-8').splitlines() if l.strip() and not l.lstrip().startswith('#')]
    items, failed = [], []
    for i, line in enumerate(lines, 1):
        try:
            items.append(crawl(line))
            print(f'[{i}/{len(lines)}] OK  {items[-1]["outlet"]} — {items[-1]["title"][:70]}')
        except Exception as e:  # bài lỗi: báo lại, không chặn các bài khác
            failed.append((line, e))
            print(f'[{i}/{len(lines)}] LỖI {line}\n      {e}')
    items.sort(key=lambda a: (a['date'], a['url']), reverse=True)
    used = {Path(a['image']).name for a in items if a['image']}
    for f in IMG_DIR.glob('*.webp'):
        if f.name not in used:
            f.unlink()
    shows = [{'id': sid, 'label': label} for sid, _, label in SHOWS if any(a['showId'] == sid for a in items)]
    OUT_JS.write_text(
        '/* TỰ SINH bởi tools/press/crawl_press.py — đừng sửa tay.\n'
        '   Thêm bài: dán link vào tools/press/sources.txt rồi chạy  python tools/press/crawl_press.py */\n'
        f'export const PRESS_UPDATED = {json.dumps(datetime.now(VN).strftime("%Y-%m-%d"))}\n\n'
        f'export const PRESS_SHOWS = {json.dumps(shows, ensure_ascii=False, indent=2)}\n\n'
        f'export const PRESS = {json.dumps(items, ensure_ascii=False, indent=2)}\n',
        encoding='utf-8',
    )
    print(f'\nĐã ghi {len(items)} bài vào {OUT_JS.relative_to(ROOT)} · ảnh ở {IMG_DIR.relative_to(ROOT)}')
    if failed:
        print(f'{len(failed)} bài không tải được — kiểm tra lại link:')
        for line, e in failed:
            print('  -', line, '→', e)
        sys.exit(1)


if __name__ == '__main__':
    main()
