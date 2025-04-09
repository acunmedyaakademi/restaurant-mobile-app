import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { SupabaseContext } from "../App";
import '../css/Home.css'

export default function Home() {
  const { authUser, supabase } = useContext(SupabaseContext);
  const [previewProducts, setPreviewProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getProducts() {
      let { data, error } = await supabase
        .from('products')
        .select('*')
        .range(0, 5)
      setPreviewProducts(data);
    }

    getProducts();
  }, [])

  return (
    <>
      <div className="home-page">
        <img src="/images/burgers.webp" alt="" />
        <h2>Hızlı, Sıcak, Lezzetli!</h2>
        <div className="user-controls">
          {
            authUser
              ? <p>Merhaba, {authUser?.name}</p>
              : <>
                <button onClick={() => navigate("/login")}>Login</button>
                <button onClick={() => navigate("/signup")}>Signup</button>
              </>
          }

        </div>
        <button 
        onClick={() => navigate("/products")}
        className="settings-logout-btn setting-btn see-more-btn">Ürünlere Göz At</button>
        
      </div>
    </>
  )
}