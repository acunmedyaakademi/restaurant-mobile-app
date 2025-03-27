import { useContext } from "react";
import { useNavigate } from "react-router-dom"
import { SupabaseContext } from "../App";
import '../css/Home.css'

export default function Home() {
  const { authUser } = useContext(SupabaseContext);
  const navigate = useNavigate();

  return (
    <>
      <div className="home-page">
        <img src="" alt="" />
        <h2>Welcome to our restaurant</h2>
        <div className="user-controls">
          {
            authUser
              ? <p>{authUser?.name}</p>
              : <>
                <button onClick={() => navigate("/login")}>Login</button>
                <button onClick={() => navigate("/signup")}>Signup</button>
              </>
          }

        </div>
      </div>
    </>
  )
}