import { useContext, useEffect, useState } from "react";
import { SupabaseContext } from "../App";
import { useNavigate } from "react-router-dom";
import "../css/Cart.css";

export default function Cart() {
  const { supabase, cart, setCart, cartObj, setCartObj, userId } =
    useContext(SupabaseContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    calculatePrice();
  }, [cart])

  function calculatePrice() {
    let fullPrice = 0;
    cart.map((x) => (fullPrice += x.price));
    setTotalPrice(fullPrice);
    return fullPrice;
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">Sepet</h2>
      <a href="/products" className="product-link">
        Ürünlere Geri Dön
      </a>
      <div className="cart-items">
        {Object.keys(cartObj)?.map((x) => (
          <div className="cart-item" key={x}>
            <img src={cartObj[x]?.img} alt={cartObj[x]?.name} />
            <div>
              <h3>{cartObj[x]?.name}</h3>
              <p>Fiyat: {cartObj[x]?.price} ₺</p>
              <p>Miktar: {cartObj[x]?.quantity}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="price-info">
        ₺{totalPrice}
      </div>
      <button
        className="order-button"
        disabled={cart.length === 0}
        // onClick={completeOrder}
        onClick={() => navigate("/checkout")}
      >
        Sipariş Ver
      </button>
    </div>
  );
}
