import { useContext } from "react";
import { SupabaseContext } from "../App";
import { useNavigate } from "react-router-dom";
import '../css/Home.css'

export default function Login() {
  const { supabase } = useContext(SupabaseContext);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    const { email, password } = formObj;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    navigate("/settings");
  }

  return (
    <div className="login-page">
      <h2>Login to Your Account</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input type="text" placeholder="Email" name="email" required />
        <input type="password" placeholder="Password" name="password" required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}