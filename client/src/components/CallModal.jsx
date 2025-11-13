import React, { useState } from "react";

export default function CallModal({ visible, doctor, onClose }) {
  const [stream, setStream] = useState(null);

  async function start() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      document.getElementById("callPreview").srcObject = s;
      setStream(s);
    } catch {
      alert("Camera/Mic permission denied");
    }
  }

  function stop() {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-md w-full">
        <h2 className="text-xl font-semibold mb-3">Live Consultation</h2>

        {doctor && <p className="mb-2 text-sm"><b>{doctor.name}</b></p>}

        <video id="callPreview" muted autoPlay playsInline className="w-full rounded bg-black h-48" />

        <div className="flex gap-2 mt-3">
          <button className="btn btn-primary" onClick={start}>Start</button>
          <button className="btn-ghost" onClick={stop}>Stop</button>
        </div>

        <button className="btn-ghost mt-3" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
