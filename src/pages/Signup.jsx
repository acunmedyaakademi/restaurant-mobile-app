import { useContext } from 'react';
import '../css/Home.css'
import { SupabaseContext } from '../App';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const { supabase, authUser } = useContext(SupabaseContext);
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    const { name, surname, email, phone, password } = formObj;
    const nameSurname = name.trim() + " " + surname.trim();
    const options = {data: {name: nameSurname }};
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options
    })

    
    await supabase
    .from('profiles').insert([
      { name, surname, email, phone },
    ]).select()

    navigate("/settings");
        
  }

  return (
    <div className="signup-page">
      <h2>Sign Up Page</h2>
      <form onSubmit={handleSignup} className="signup-form" autoComplete='off'>
        <input type="text" required placeholder="Name" name="name" />
        <input type="text" required placeholder="Surname" name="surname" />
        <input type="text" required placeholder="Email" name="email" />
        <input type="number" required placeholder="Phone No" name="phone" />
        <input type="password" required placeholder="Password" name="password" />
        <button>Sign Up</button>
      </form>
    </div>
  );
}
