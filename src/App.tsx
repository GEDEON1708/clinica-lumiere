import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const AdminBookings = lazy(() => import('./pages/AdminBookings'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="luxury-shell min-h-screen flex flex-col">
        <Navbar />
        <main className="grow">
          <Suspense fallback={<div className="px-6 py-32 text-center text-sm text-brown/60">Carregando página...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sobre-nos" element={<About />} />
              <Route path="/servicos" element={<Services />} />
              <Route path="/depoimentos" element={<TestimonialsPage />} />
              <Route path="/agendamento" element={<BookingPage />} />
              <Route path="/painel-reservas" element={<AdminBookings />} />
              <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
