import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home"
import Routines from "./pages/Routines"
import Login from "./pages/Login"

function App() {
  return (
    <div>
      <nav>
        <Link to="/">홈</Link>
        <Link to="/routines">루틴</Link>
        <Link to="/login">로그인</Link>
      </nav>

      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/routines"  element={<Routines />} />
        <Route path="/login"     element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;