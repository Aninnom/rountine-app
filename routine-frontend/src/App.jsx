import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home"
import Routines from "./pages/Routines"

function App() {
  return (
    <div>
      <nav>
        <Link to="/">홈</Link>
        <Link to="/routines">루틴</Link>
      </nav>

      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/routines"  element={<Routines />} />
      </Routes>
    </div>
  );
}

export default App;