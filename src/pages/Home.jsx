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
        <img src="" alt="" />
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
        <div className="preview-products">
          <div className="preview-header">
            <h3>Ürünler</h3>
            <a href="/products">Göz atın</a>
          </div>
          <div className="products-list">
            {
              previewProducts.map(x => <div className="product-list-item">
                <div className="product-item-img">
                  <img src={x?.img} />
                </div>
                <h4>{x?.name}</h4>
                <span>₺{x?.price}</span>
              </div>)
            }
          </div>

        </div>
      </div>
    </>
  )
}