import React from "react";
import { bookConsult } from "../api";

export default function BookingModal({ visible, doctor, onClose }) {
  if (!visible) return null;

  async function submit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      datetime: fd.get("datetime"),
      symptoms: fd.get("symptoms"),
      doctor: doctor?.name
    };
    const res = await bookConsult(payload);
    alert("Booking created!");
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-md w-full">
        <h2 className="text-xl font-semibold mb-3">Book Consultation</h2>

        {doctor && <p className="mb-2 text-sm">Doctor: <b>{doctor.name}</b></p>}

        <form onSubmit={submit} className="flex flex-col gap-2">
          <input name="name" className="p-2 border rounded" placeholder="Name" required />
          <input name="email" type="email" className="p-2 border rounded" placeholder="Email" required />
          <input name="datetime" type="datetime-local" className="p-2 border rounded" required />
          <textarea name="symptoms" className="p-2 border rounded" placeholder="Symptoms..." />

          <button className="btn btn-primary mt-2">Submit</button>
        </form>

        <button className="btn-ghost mt-3" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
