import { useState } from "react"
import { useNavigate } from "react-router-dom"

const API = import.meta.env.VITE_API_URL

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isSignup, setIsSignup] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit() {
    const url = isSignup ? `${API}/signup` : `${API}/login`
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()

    if (!isSignup && data.token) {
      localStorage.setItem("token", data.token)  // 토큰 저장
      navigate("/routines")                        // 루틴 페이지로 이동
    } else {
      alert(isSignup ? "회원가입 완료! 로그인해주세요." : "로그인 실패")
      if (isSignup) setIsSignup(false)
    }
  }

  return (
    <div>
      <h2>{isSignup ? "회원가입" : "로그인"}</h2>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="아이디"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
      />
      <button onClick={handleSubmit}>{isSignup ? "회원가입" : "로그인"}</button>
      <button onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? "로그인으로" : "회원가입으로"}
      </button>
    </div>
  )
}

export default Login