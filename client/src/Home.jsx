import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-brand-700 dark:text-white">
          SmileCare1 — AI Dental Health Screening
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Real-time dental disease detection using AI + Smart assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/assess" className="card">
          <h3 className="text-xl font-semibold">🦷 Start Assessment</h3>
          <p>Use your phone camera to detect dental issues instantly.</p>
        </Link>

        <Link to="/find-doctor" className="card">
          <h3 className="text-xl font-semibold">👨‍⚕️ Find Doctor</h3>
          <p>Consult nearby dental specialists via SMS, WhatsApp, or video.</p>
        </Link>

        <Link to="/ambulance" className="card">
          <h3 className="text-xl font-semibold">🚑 Ambulance</h3>
          <p>Emergency assistance with GPS-based location tracking.</p>
        </Link>
      </div>
    </div>
  );
}
