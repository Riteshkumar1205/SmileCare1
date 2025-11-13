import React, { useEffect, useState } from "react";

export default function HeatmapImage({ imageFile }) {
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setImageURL(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  if (!imageFile) return null;

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">AI Heatmap (Grad-CAM)</h3>

      <div className="relative w-full max-w-md mx-auto">
        <img
          src={imageURL}
          alt="scan"
          className="w-full rounded shadow"
        />

        {/* Fake heatmap overlay (can be replaced with actual GradCAM image) */}
        <div
          className="absolute top-0 left-0 w-full h-full rounded"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,0,0,0.25), rgba(255,165,0,0.10), rgba(0,0,0,0))",
            mixBlendMode: "overlay",
          }}
        ></div>
      </div>
    </div>
  );
}
