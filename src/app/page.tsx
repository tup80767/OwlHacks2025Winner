"use client"; // needed for hooks in the app router
import { useState, useEffect } from "react";

type LogEntry = {
  units: string;
  time: string;
};

export default function Home() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [units, setUnits] = useState("");
  const [petHappy, setPetHappy] = useState(false);
  const [hydrationInterval, setHydrationInterval] = useState<number | null>(null);
  const [hydration, setHydration] = useState(100); // default hydration
  const [started, setStarted] = useState(false); // tracks if the user answered

  useEffect(() => {
  // Request notification permission
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  // Start interval to decrease hydration every minute
  const interval = window.setInterval(() => {
    setHydration((prev) => {
      const next = Math.max(prev - 2, 0); // decrease by 2% per minute
      if (next <= 20 && Notification.permission === "granted") {
        new Notification("💧 Hydration Low!", {
          body: "Your Owl is thirsty! Drink water soon.",
        });
      }
      return next;
    });
  }, 1000 * 60); // every 1 minute

  setHydrationInterval(interval);

  // Clear interval on unmount
  return () => {
    if (interval) clearInterval(interval);
  };
}, []);
  
  useEffect(() => {
    const saved = localStorage.getItem("insulinLogs");
    if (saved) setLogs(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("insulinLogs", JSON.stringify(logs));
  }, [logs]);

  const sendHydrationReminder = () => {
    if (Notification.permission === "granted") {
      new Notification("💧 Hydration Reminder!", {
        body: "Time to drink water and keep your Owl happy!",
        icon: "/water-glass-icon.png", // optional: place icon in public folder
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!units) return;

    const newLog: LogEntry = {
      units,
      time: new Date().toLocaleTimeString(),
    };

    setLogs([newLog, ...logs]);
    setUnits("");
    setPetHappy(true);

    setTimeout(() => setPetHappy(false), 3000);
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-purple-200 p-6">
        <h1 className="text-3xl font-bold mb-6">📝 Set Your Hydration Level</h1>
        <p className="mb-6">What is your current hydration level?</p>
        <div className="flex flex-col gap-4">
          <button onClick={() => { setHydration(90); setStarted(true); }} className="bg-red-500 ...">I have to pee</button>
          <button onClick={() => { setHydration(70); setStarted(true); }} className="bg-green-500 ...">Fully hydrated</button>
          <button onClick={() => { setHydration(50); setStarted(true); }} className="bg-yellow-500 ...">I haven't had any liquids in a while</button>
          <button onClick={() => { setHydration(30); setStarted(true); }} className="bg-orange-500 ...">Dehydrated</button>
          <button onClick={() => { setHydration(10); setStarted(true); }} className="bg-red-700 ...">Actively Thirsty</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-purple-200 p-6">
      <h1 className="text-3xl font-bold mb-6">🐥 OwlHacks Pet</h1>

      <div className="text-8xl mb-4">
        {petHappy ? "😺" : "😿"}
      </div>
      <p className="mb-6">
        {petHappy ? "Your pet is happy! 🎉" : "Your pet needs care..."}
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="number"
          value={units}
          onChange={(e) => setUnits(e.target.value)}
          placeholder="Insulin units"
          className="p-2 rounded-lg border border-gray-300"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Log
        </button>
        <button
          type="button"
          onClick={() => {
            if (hydrationInterval) clearInterval(hydrationInterval); // clear old interval
            const interval = window.setInterval(sendHydrationReminder, 1000 * 60 * 20); // every 20 minutes
            setHydrationInterval(interval);
            alert("Hydration reminders started! 💧");
          }}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Start Hydration Reminders
        </button>
      </form>

      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-4">
        <h2 className="text-xl font-semibold mb-2">Your Logs</h2>
        {logs.length === 0 ? (
          <p className="text-gray-500">No logs yet.</p>
        ) : (
          <ul className="space-y-2">
            {logs.map((log, i) => (
              <li key={i} className="flex justify-between">
                <span>{log.units} units</span>
                <span className="text-gray-500">{log.time}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Hydration Meter */}
      <div className="fixed top-20 right-4 w-20 h-128 border-2 border-black rounded-lg overflow-hidden flex flex-col-reverse">
        <div
          className="bg-blue-500 w-full transition-all duration-500"
          style={{ height: `${hydration}%` }}
        ></div>
      </div>
      <p className="fixed top-10 right-2 text-sm font-semibold">{hydration}%</p>

</div>
  );
}
