import { useState, useEffect } from "react"

const API = import.meta.env.VITE_API_URL
function Routines() {
  const [routines, setRoutines] = useState([]);
  const [input, setInput] = useState("");

  useEffect(function() {
    loadRoutines();
  }, []);

  async function loadRoutines() {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API}/routines?token=${token}`);
    const data = await res.json();
    setRoutines(data);
  }

  async function addRoutine() {
    if (input === "") return;
    const token = localStorage.getItem("token")
    await fetch(`${API}/routines?token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: input })
    });
    setInput("");
    loadRoutines();
  }

  async function deleteRoutine(id) {
    await fetch(`${API}/routines/${id}`, {
      method: "DELETE"
    });
    loadRoutines();
  }

  async function toggleRoutine(id) {
    await fetch(`${API}/routines/${id}`, {
      method: "PATCH"
    });
    loadRoutines();
  }

  return (
    <div>
      <h2>오늘의 루틴</h2>
      <div className="input-wrap">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => { if (e.key === "Enter") addRoutine(); }}
          placeholder="새 루틴 입력..."
        />
        <button onClick={addRoutine}>추가</button>
      </div>
      <ul>
        {routines.map((routine) => (
          <li key={routine.id} style={{ textDecoration: routine.done ? "line-through" : "none" }}>
            <span onClick={() => toggleRoutine(routine.id)} style={{ cursor: "pointer" }}>
              {routine.done ? "✅" : "🌱"} {routine.name}
            </span>
            <button onClick={() => deleteRoutine(routine.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Routines;