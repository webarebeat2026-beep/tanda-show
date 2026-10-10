import { MapPin } from 'lucide-react'
import { ORGANIZERS, SLOGAN } from '../data'
import logoTanDa from '../assets/logo/tan-da.webp'

export default function Footer() {
  return (
    <footer className="relative border-t border-line bg-night-2 pb-10 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <a href="#top" className="inline-flex rounded-sm" aria-label="Tán Đa Show — về đầu trang">
              <img src={logoTanDa} alt="Tán Đa Show" width="720" height="326" loading="lazy" className="h-auto w-[150px] sm:w-[170px]" />
            </a>
            <p className="mt-5 max-w-sm font-serif text-2xl italic leading-snug text-cream/90">{SLOGAN}</p>
            <p className="mt-5 flex items-center gap-2 text-sm text-muted">
              <MapPin size={16} className="text-amber" aria-hidden="true" /> 71 Hàng Trống, Hoàn Kiếm, Hà Nội
            </p>
          </div>

          {/* Đơn vị tổ chức: ngang hàng khối Tán Đa, mỗi nhãn 1 dòng, logo cùng chiều cao thị giác */}
          <dl className="grid gap-10 md:grid-cols-3 md:gap-6 lg:col-span-8 lg:self-center">
            {ORGANIZERS.map((o) => (
              <div key={o.role}>
                <dt className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em] text-amber">{o.role}</dt>
                <dd className="mt-4 flex min-h-12 flex-wrap items-center gap-x-5 gap-y-3">
                  {o.names.map((n) =>
                    n.logo ? (
                      <img
                        key={n.name}
                        src={n.logo}
                        alt={n.name}
                        width={n.w}
                        height={n.h}
                        loading="lazy"
                        className={`w-auto ${n.h / n.w > 0.32 ? 'h-12' : 'h-9'}`}
                      />
                    ) : (
                      <span key={n.name} className="text-lg font-semibold text-cream">{n.name}</span>
                    )
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="mt-14 border-t border-line pt-6 text-xs text-muted">
          © 2026 Tán Đa Show. Báo Nhân Dân × BEAT Network.
        </p>
      </div>
    </footer>
  )
}
