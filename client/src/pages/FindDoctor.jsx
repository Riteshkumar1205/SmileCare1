import React from "react";
import DoctorCard from "../components/DoctorCard";
import MapView from "../components/MapView";

const DOCTORS = [
  { name: "Dr. Rohan Sharma", speciality: "Oral Surgeon", photo: "https://i.pravatar.cc/120?img=11" },
  { name: "Dr. Meera Verma", speciality: "Periodontist", photo: "https://i.pravatar.cc/120?img=22" },
  { name: "Dr. Kunal Gupta", speciality: "Endodontist", photo: "https://i.pravatar.cc/120?img=33" }
];

export default function FindDoctor() {
  return (
    <div className="container py-10">
      <h2 className="text-3xl font-semibold mb-6">Find a Dentist</h2>

      <MapView lat={28.61} lng={77.20} zoom={10} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {DOCTORS.map((d) => (
          <DoctorCard key={d.name} doctor={d} />
        ))}
      </div>
    </div>
  );
}
