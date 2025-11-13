import React from "react";

export default function LoadingSpinner({ size = 40 }) {
  return (
    <div className="flex justify-center my-4">
      <div
        className="border-4 border-blue-400 border-t-transparent rounded-full animate-spin"
        style={{ width: size, height: size }}
      ></div>
    </div>
  );
}
