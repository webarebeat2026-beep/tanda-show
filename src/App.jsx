import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About, { SloganMarquee } from './components/About'
import Artists from './components/Artists'
import Vote from './components/Vote'
import Register from './components/Register'
import NextShow from './components/NextShow'
import News from './components/News'
import Press from './components/Press'
import Footer from './components/Footer'
import FloatingNotes from './components/FloatingNotes'
import { ToastProvider } from './components/ui'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <div className="grain">
          <a href="#main" className="sr-only z-[80] rounded-full bg-amber px-5 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
            Bỏ qua tới nội dung chính
          </a>
          <FloatingNotes fixed />
          <Navbar />
          <main id="main">
            <Hero />
            <SloganMarquee />
            <About />
            <Artists />
            <Vote />
            <Register />
            <NextShow />
            <News />
            <Press />
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </MotionConfig>
  )
}
