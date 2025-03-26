export default function Login() {
  async function handleLogin(e) {
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    const { email, password } = formObj;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
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