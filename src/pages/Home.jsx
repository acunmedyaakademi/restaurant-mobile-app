import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
    <div className="home-page">
      <img src="" alt="" />
      <div>Welcome to our restaurant</div>
      <a href="/products">products</a>
      <div className="user-controls">
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/signup")}>Signup</button>
      </div>
    </div>
    </>
  )
}