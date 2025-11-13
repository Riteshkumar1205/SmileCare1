import React from "react";

export default function ConfidenceBars({ data }) {
  return (
    <div className="mt-3">
      {Object.entries(data).map(([label, conf]) => (
        <div key={label} className="mb-2">
          <div className="flex justify-between">
            <span>{label}</span>
            <span>{conf.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded">
            <div
              style={{ width: `${conf}%` }}
              className="h-2 bg-brand-500 rounded"
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
