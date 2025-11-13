import React, { useState } from "react";
import CameraPanel from "../components/CameraPanel";
import ConfidenceBars from "../components/ConfidenceBars";
import { useNavigate } from "react-router-dom";

export default function AssessFlow() {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  function handleResult(res, blob) {
    setResult({ ...res, imageBlob: blob });
    if (res?.disease_label)
      navigate("/result", { state: { res, blob } });
  }

  return (
    <div className="container py-10">
      <h2 className="text-2xl font-semibold mb-3">Dental Assessment</h2>

      <CameraPanel onResult={handleResult} />

      {result?.all_predictions && <ConfidenceBars data={result.all_predictions} />}
    </div>
  );
}
