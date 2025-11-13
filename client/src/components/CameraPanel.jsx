import React, { useRef, useState } from "react";
import { predictImageBlob } from "../api";
import LoadingSpinner from "./LoadingSpinner";
import HeatmapImage from "./HeatmapImage";

export default function CameraPanel({ onResult }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageBlob, setImageBlob] = useState(null);

  async function startCamera() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = s;
      setStream(s);
    } catch {
      alert("Camera permission denied");
    }
  }

  function stopCamera() {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
  }

  async function capture() {
    setLoading(true);
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const blob = await new Promise(res => canvas.toBlob(res, "image/jpeg", 0.9));
    setImageBlob(blob);
    const result = await predictImageBlob(blob);
    setLoading(false);
    onResult(result, blob);
  }

  return (
    <div className="card">
      <h3 className="font-semibold mb-2">Live Camera Detection</h3>

      <video ref={videoRef} autoPlay className="w-full bg-black rounded mb-2" />

      <div className="flex gap-2">
        <button className="btn btn-primary" onClick={startCamera} disabled={stream}>Start</button>
        <button className="btn btn-ghost" onClick={stopCamera} disabled={!stream}>Stop</button>
        <button className="btn btn-primary" onClick={capture} disabled={!stream || loading}>
          {loading ? "Analyzing..." : "Capture & Analyze"}
        </button>
      </div>

      {loading && <LoadingSpinner size={30} />}

      {imageBlob && <HeatmapImage imageFile={imageBlob} />}
    </div>
  );
}
