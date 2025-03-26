import { useContext } from "react";
import { SupabaseContext } from "../App";
import { useNavigate } from "react-router-dom";

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

    navigate("/");
  }

  return (
    <>
    <form onSubmit={handleLogin}>
      <input type="text" placeholder="email" name="email" />
      <input type="password" name="password" />
      <button>Submit</button>
    </form>
    </>
  )
}