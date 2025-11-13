import React from "react";

export default function DoctorCard({ doctor }) {
  return (
    <div className="card flex flex-col gap-3 text-center items-center">
      <img src={doctor.photo} alt={doctor.name} className="w-24 h-24 rounded-full object-cover" />
      <h3 className="font-semibold text-lg">{doctor.name}</h3>
      <p className="text-sm text-gray-500">{doctor.speciality}</p>

      <div className="flex gap-2 mt-2">
        <button
          className="btn btn-primary"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("openBooking", { detail: { doctor } }))
          }
        >
          Book
        </button>

        <button
          className="btn btn-ghost"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("openCall", { detail: { doctor } }))
          }
        >
          Call
        </button>
      </div>
    </div>
  );
}
