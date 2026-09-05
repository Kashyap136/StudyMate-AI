import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import { ToastProvider } from './components/Toast'
import { ThemeProvider } from './components/ThemeContext'
import Home from './pages/Home'
import About from './pages/About'
import Features from './pages/Features'
import Tools from './pages/Tools'
import Contact from './pages/Contact'

function Layout() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
          <Navbar />
          <main className="flex-1">
            <Layout />
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </ThemeProvider>
  )
}
