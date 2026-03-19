import { useState } from "react"

function App() {
  const [routines, setRoutines] = useState([
    "아침 조깅", "독서 15분"
  ]);
  const [input, setInput] = useState("");

  function addRoutine() {
    if (input === "") return;
    setRoutines([...routines, input]);
    setInput("");
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
        {routines.map((routine, index) => (
          <li key={index}>🌱 {routine}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;