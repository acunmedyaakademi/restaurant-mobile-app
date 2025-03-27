import { useContext, useEffect, useState } from "react";
import { SupabaseContext } from "../App";
import { useNavigate } from "react-router-dom";
import "../css/Cart.css";

export default function Cart() {
  const { supabase, cart, setCart, cartObj, setCartObj } =
    useContext(SupabaseContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  async function completeOrder() {
    const { data, error } = await supabase
      .from("orders")
      .insert([{ paid_price: calculatePrice(), status_id: 1 }])
      .select();

    console.log(data);

    const orderDetails = cart.map((item) => {
      return {
        order_id: data[0].id,
        product_id: item.id,
      };
    });

    await supabase.from("order_details").insert(orderDetails).select();

    localStorage.clear();
    navigate("/");
  }

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
      <button
        className="order-button"
        disabled={cart.length === 0}
        onClick={completeOrder}
      >
        Sipariş Ver
      </button>
    </div>
  );
}
