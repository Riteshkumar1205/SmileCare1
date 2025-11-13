import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import VoiceAssistant from "./VoiceAssistant";

export default function Header({ onBook, onCall }) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b shadow-sm">
      <div className="container py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 flex items-center justify-center bg-brand-500 text-white rounded-lg font-bold">
            SC
          </div>
          <span className="text-xl font-semibold text-brand-700 dark:text-white">SmileCare1</span>
        </Link>

        <nav className="hidden md:flex gap-4">
          <Link to="/" className="header-link">Home</Link>
          <Link to="/assess" className="header-link">Assess</Link>
          <Link to="/find-doctor" className="header-link">Find Doctor</Link>
          <Link to="/ambulance" className="header-link">Ambulance</Link>
          <Link to="/reports" className="header-link">Reports</Link>
          <Link to="/login" className="header-link">Login</Link>
          <Link to="/signup" className="header-link">Signup</Link>
        </nav>

        <div className="flex items-center gap-3">
          <VoiceAssistant onTranscript={(t) => alert("Transcript: " + t)} />
          <ThemeToggle />
          <button className="btn btn-primary" onClick={onCall}>Consult</button>
        </div>
      </div>
    </header>
  );
}
