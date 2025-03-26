import { createContext, useContext, useEffect, useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { createClient } from '@supabase/supabase-js'

// Todo:
// login-sign up-sign out
// sign up: isim-soyisim, tel no (auth ve users tablosu)
// kategorilerine ürünleri sıralama
// carta ekleme
// checkout dedikten sonra adres kısmı kontrolü
// orders ve order_details tablolarına ürün gönderme
// ekstralar: notifications

export const supabase = createClient('https://sxkbwpcardxrhfuqzvzc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4a2J3cGNhcmR4cmhmdXF6dnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzQ3MjAsImV4cCI6MjA1ODA1MDcyMH0.f6pWVT3SGve_Xmcs_m2lH0YDX9anp3hI915eNgjfgTI')

export const SupabaseContext = createContext(null)

function App() {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      
      if (event === 'SIGNED_IN') {
        setAuthUser(session.user.user_metadata);
      }

      if (event === 'SIGNED_OUT') {
        setAuthUser(null);
      }
    })


    return () => data.subscription.unsubscribe();
  }, []);


  return (
    <>
    <SupabaseContext.Provider value={supabase}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </SupabaseContext.Provider>
      
    </>
  )
}

export default App
