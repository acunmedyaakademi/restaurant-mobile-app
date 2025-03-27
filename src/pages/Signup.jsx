import '../css/Home.css'

export default function Signup() {
  return (
    <div className="signup-page">
      <h2>Sign Up Page</h2>
      <form className="signup-form" autoComplete='off'>
        <input type="text" placeholder="Name" />
        <input type="text" placeholder="Surname" />
        <input type="text" placeholder="Phone No" />
        <input type="text" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button>Sign Up</button>
      </form>
    </div>
  );
}
