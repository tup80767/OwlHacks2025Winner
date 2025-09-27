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

  useEffect(() => {
    const saved = localStorage.getItem("insulinLogs");
    if (saved) setLogs(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("insulinLogs", JSON.stringify(logs));
  }, [logs]);

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-purple-200 p-6">
      <h1 className="text-3xl font-bold mb-6"> Hydrate or Die-drate!</h1>
      <h2 className="mb-6">Input the amount of water you drank to hydrate your cat!</h2>
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
          placeholder="Enter amount here"
          className="p-2 rounded-lg border border-gray-300"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Log
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
                <span>{log.units} oz</span>
                <span className="text-gray-500">{log.time}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
