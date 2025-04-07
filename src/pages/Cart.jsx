import { useContext, useEffect, useState } from "react";
import { SupabaseContext } from "../App";
import { useNavigate } from "react-router-dom";
import "../css/Cart.css";
import { plusSvg, minusSvg } from "./Products.jsx";

export default function Cart() {
  const { cart, setCart, cartObj, setCartObj } = useContext(SupabaseContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    calculatePrice();
    updateCartObj();
  }, [cart]);

  function calculatePrice() {
    const fullPrice = cart.reduce((acc, curr) => acc + curr.price, 0);
    setTotalPrice(fullPrice);
  }

  function updateCartObj() {
    const newObj = {};
    cart.forEach((item) => {
      if (newObj[item.name]) {
        newObj[item.name].quantity++;
      } else {
        newObj[item.name] = {
          name: item.name,
          id: item.id,
          quantity: 1,
          price: item.price,
          img: item.img,
        };
      }
    });
    setCartObj(newObj);
    localStorage.setItem("cartObj", JSON.stringify(newObj));
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function handleQuantityIncrease(item) {
    const updatedCart = [...cart, item];
    setCart(updatedCart);
  }

  function handleQuantityDecrease(item) {
    const index = cart.findIndex((x) => x.id === item.id);
    if (index !== -1) {
      const updatedCart = [...cart];
      updatedCart.splice(index, 1);
      setCart(updatedCart);
    }
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
              <div className="cart-item-price">
                <button
                  className="decrease-btn"
                  onClick={() => handleQuantityDecrease(cartObj[x])}
                >
                  {minusSvg}
                </button>
                <span>{cartObj[x]?.quantity}</span>
                <button
                  className="increase-btn"
                  onClick={() => handleQuantityIncrease(cartObj[x])}
                >
                  {plusSvg}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bottom-cart">
        <div className="price-info">Toplam Fiyat : ₺{totalPrice}</div>
        <button
          className="order-button"
          disabled={cart.length === 0}
          onClick={() => navigate("/checkout")}
        >
          Sipariş Ver
        </button>
      </div>
    </div>
  );
}
