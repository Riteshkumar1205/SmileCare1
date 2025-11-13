import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Features from "./pages/Features";
import AssessFlow from "./pages/AssessFlow";
import ResultPage from "./pages/ResultPage";
import FindDoctor from "./pages/FindDoctor";
import Ambulance from "./pages/Ambulance";
import Reports from "./pages/Reports";
import AuthLogin from "./pages/AuthLogin";
import AuthSignup from "./pages/AuthSignup";

import BookingModal from "./components/BookingModal";
import CallModal from "./components/CallModal";

export default function App() {
  const [bookingVisible, setBookingVisible] = useState(false);
  const [callVisible, setCallVisible] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [callDoctor, setCallDoctor] = useState(null);

  useEffect(() => {
    function onOpenBooking(e) {
      setBookingDoctor(e?.detail?.doctor || null);
      setBookingVisible(true);
    }
    function onOpenCall(e) {
      setCallDoctor(e?.detail?.doctor || null);
      setCallVisible(true);
    }
    window.addEventListener("openBooking", onOpenBooking);
    window.addEventListener("openCall", onOpenCall);
    return () => {
      window.removeEventListener("openBooking", onOpenBooking);
      window.removeEventListener("openCall", onOpenCall);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onBook={() => setBookingVisible(true)} onCall={() => setCallVisible(true)} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/assess" element={<AssessFlow />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/find-doctor" element={<FindDoctor />} />
          <Route path="/ambulance" element={<Ambulance />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/login" element={<AuthLogin />} />
          <Route path="/signup" element={<AuthSignup />} />
        </Routes>
      </main>

      <Footer />

      <BookingModal visible={bookingVisible} doctor={bookingDoctor} onClose={() => setBookingVisible(false)} />
      <CallModal visible={callVisible} doctor={callDoctor} onClose={() => setCallVisible(false)} />
    </div>
  );
}
