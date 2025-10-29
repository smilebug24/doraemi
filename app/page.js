//\app\page.js

"use client";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [ledState, setLedState] = useState({ red: false, green: false, blue: false });

  const fetchData = async () => {
    const res = await fetch("/api/data");
    const data = await res.json();
    setTemperature(data.temperature);
    setHumidity(data.humidity);
  };

  const fetchLED = async () => {
    const res = await fetch("/api/led");
    const data = await res.json();
    setLedState(data);
  };

  const toggleLED = async (color) => {
    const state = ledState[color] ? "off" : "on";
    await fetch("/api/led", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color, state }),
    });
    setLedState((prev) => ({ ...prev, [color]: !prev[color] }));
  };

  useEffect(() => {
    fetchData();
    fetchLED();
    const interval = setInterval(() => { fetchData(); fetchLED(); }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{ textAlign: "center", fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>ESP32 Dashboard</h1>
      <p>Temperature: {temperature.toFixed(1)} °C</p>
      <p>Humidity: {humidity.toFixed(1)} %</p>

      <h2>LED Control</h2>
      <div style={{ marginTop: "1rem" }}>
        {["red","green","blue"].map((color) => (
          <button
            key={color}
            onClick={() => toggleLED(color)}
            style={{
              padding: "10px 20px",
              margin: "5px",
              color: "white",
              border: "none",
              cursor: "pointer",
              background: ledState[color] ? `dark${color}` : color
            }}
          >
            {color.toUpperCase()}
          </button>
        ))}
      </div>
    </main>
  );
}
