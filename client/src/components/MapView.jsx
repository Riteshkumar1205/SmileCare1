import React from "react";

const GOOGLE_KEY = import.meta.env.VITE_MAPS_KEY;

export default function MapView({ lat, lng, zoom = 12 }) {
  const mapURL = `https://www.google.com/maps/embed/v1/view?key=${GOOGLE_KEY}&center=${lat},${lng}&zoom=${zoom}`;

  return (
    <div className="w-full h-64 rounded overflow-hidden shadow bg-gray-200 dark:bg-gray-800">
      {!GOOGLE_KEY || GOOGLE_KEY === "your_google_maps_key" ? (
        <div className="p-4 text-center text-red-500">
          ⚠️ Google Maps API Key missing  
          <br />
          Add it in `/client/.env`:  
          <br />
          <code>VITE_MAPS_KEY=YOUR_KEY</code>
        </div>
      ) : (
        <iframe
          title="map"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={mapURL}
        ></iframe>
      )}
    </div>
  );
}
