import React from "react";
import { useLocation } from "react-router-dom";

export default function ResultPage() {
  const { state } = useLocation();
  if (!state?.res) return <p>No data</p>;

  const { res } = state;

  return (
    <div className="container py-10">
      <h2 className="text-3xl font-bold mb-4">{res.disease_name}</h2>

      <p className="text-gray-600 dark:text-gray-300 mt-2">{res.disease_report.summary}</p>

      <h3 className="text-xl font-semibold mt-6">Symptoms</h3>
      <ul className="list-disc ml-6 mt-2">
        {res.disease_report.symptoms.map((s, i) => <li key={i}>{s}</li>)}
      </ul>

      <h3 className="text-xl font-semibold mt-6">Care & Precautions</h3>
      <ul className="list-disc ml-6 mt-2">
        {res.disease_report.care_and_precautions.map((s, i) => <li key={i}>{s}</li>)}
      </ul>

      <h3 className="text-xl font-semibold mt-6">Treatment</h3>
      <ul className="list-disc ml-6 mt-2">
        {res.disease_report.treatment.map((s, i) => <li key={i}>{s}</li>)}
      </ul>
    </div>
  );
}
