import React, { useState } from "react";
import { logLocation } from "../api";

export default function Ambulance() {
  const [coords, setCoords] = useState(null);

  function requestGPS() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setCoords(c);
        logLocation(c);
        alert("Location sent to emergency center!");
      },
      () => alert("Please allow GPS access"),
      { enableHighAccuracy: true }
    );
  }

  return (
    <div className="container py-10">
      <h2 className="text-3xl font-semibold mb-4">Emergency Ambulance</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        In a dental emergency, send your GPS coordinates to the nearest facility.
      </p>

      <button className="btn btn-primary" onClick={requestGPS}>
        Send My Location
      </button>

      {coords && (
        <p className="mt-4">
          Sent: {coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}
        </p>
      )}
    </div>
  );
}
