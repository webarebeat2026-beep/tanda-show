import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About, { SloganMarquee } from './components/About'
import Artists from './components/Artists'
import Vote from './components/Vote'
import NextShow from './components/NextShow'
import Press from './components/Press'
import Footer from './components/Footer'
import { ToastProvider } from './components/ui'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <div className="grain">
          <a href="#main" className="sr-only z-[80] rounded-full bg-amber px-5 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
            Bỏ qua tới nội dung chính
          </a>
          <Navbar />
          <main id="main">
            <Hero />
            <SloganMarquee />
            <About />
            <Artists />
            <Vote />
            <NextShow />
            <Press />
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </MotionConfig>
  )
}
