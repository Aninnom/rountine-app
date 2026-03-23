import { useState, useEffect } from "react"

const API = "http://localhost:8000"

function App() {
  const [routines, setRoutines] = useState([]);
  const [input, setInput] = useState("");

  // 페이지 열릴 때 루틴 목록 불러오기
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

    // FastAPI에 POST 요청
    await fetch(`${API}/routines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: input })
    });

    setInput("");
    loadRoutines();  // 추가 후 목록 다시 불러오기
  }

  return (
    <div>
      <h1>🌱 루틴 나무</h1>

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

export default App;