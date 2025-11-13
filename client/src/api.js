export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export async function predictImageBlob(blob) {
  const fd = new FormData();
  fd.append("image", blob, "capture.jpg");

  const res = await fetch(`${API_BASE}/api/predict`, {
    method: "POST",
    body: fd,
  });

  return await res.json();
}

export async function bookConsult(data) {
  const res = await fetch(`${API_BASE}/api/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function sendSMS(body, phone) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/api/send-sms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined
    },
    body: JSON.stringify({ body, to: phone })
  });
  return await res.json();
}

export async function sendWhatsApp(body, phone) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/api/send-whatsapp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined
    },
    body: JSON.stringify({ body, to: `whatsapp:${phone}` })
  });
  return await res.json();
}

export async function logLocation(coords) {
  fetch(`${API_BASE}/api/log-location`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(coords),
  });
}
