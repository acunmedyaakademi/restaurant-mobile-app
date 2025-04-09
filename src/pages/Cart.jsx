import { useContext, useEffect, useState } from "react";
import { SupabaseContext } from "../App";
import { useNavigate } from "react-router-dom";
import "../css/Cart.css";
import { plusSvg, minusSvg } from "./Products.jsx";
import { leftChevron } from "../Svg.jsx";

export default function Cart() {
  const { supabase, cart, setCart, cartObj, setCartObj, userId } =
    useContext(SupabaseContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    calculatePrice();
    updateCartObj();
  }, [cart])

  function calculatePrice() {
    let fullPrice = 0;
    cart.map((x) => (fullPrice += x.price));
    setTotalPrice(fullPrice);
    return fullPrice;
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

  function handleQuantityIncrease(product) {
    setCart((prev) => {
      const updatedCart = [...prev, product];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  }

  function handleQuantityDecrease(product) {
    setCart((prev) => {
      const updatedCart = [...prev];
      const productToRemoveIndex = updatedCart.findIndex(x => x.id === product.id);
      if (productToRemoveIndex !== -1) {
        updatedCart.splice(productToRemoveIndex, 1);
      }
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    })
  }

  return (
    <>
      <div className="cart-container">
        <h2 className="cart-title">Sepet</h2>
        <div className="cart-container-content">
          <div className="cart-items">
            {Object.keys(cartObj)?.map((x) => (
              <div className="cart-item" key={x}>
                <img src={cartObj[x]?.img} alt={cartObj[x]?.name} />
                <div>
                  <h3>{cartObj[x]?.name}</h3>
                  <p>Fiyat: {cartObj[x]?.price} ₺</p>
                  <div className="cart-item-price">
                    <button 
                    onClick={() => handleQuantityDecrease(cartObj[x])}
                    className="decrease-btn">{minusSvg}</button>
                    <span>{cartObj[x]?.quantity}</span>
                    <button 
                    onClick={() => handleQuantityIncrease(cartObj[x])}
                    className="increase-btn">{plusSvg}</button>

                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bottom-cart">
            <div className="price-info">
              Toplam Fiyat : ₺{totalPrice}
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
        </div>

      </div>

    </>
  );
}
