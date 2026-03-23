import { useState, useEffect } from "react"

const API = "http://localhost:8000"

function Routines() {
  const [routines, setRoutines] = useState([]);
  const [input, setInput] = useState("");

  useEffect(function() {
    loadRoutines();
  }, []);

  async function loadRoutines() {
    const res = await fetch(`${API}/routines`);
    const data = await res.json();
    setRoutines(data);
  }

  async function addRoutine() {
    if (input === "") return;
    await fetch(`${API}/routines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: input })
    });
    setInput("");
    loadRoutines();
  }

  return (
    <div>
      <h2>오늘의 루틴</h2>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyUp={(e) => { if (e.key === "Enter") addRoutine(); }}
        placeholder="새 루틴 입력..."
      />
      <button onClick={addRoutine}>추가</button>
      <ul>
        {routines.map((routine) => (
          <li key={routine.id}>🌱 {routine.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Routines;