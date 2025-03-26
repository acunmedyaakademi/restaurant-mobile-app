import { useContext, useEffect, useState } from "react"
import { SupabaseContext } from "../App"

export default function Cart() {
  const { supabase, cart, setCart, cartObj, setCartObj } = useContext(SupabaseContext);

  useEffect(() => {
    if (!Array.isArray(cart)) return; 

    const newCartObj = {};
    cart.forEach(item => {
      if (newCartObj[item.name]) {
        newCartObj[item.name].quantity++;
      } else {
        newCartObj[item.name] = {
          name: item.name,
          id: item.id,
          quantity: 1,
          price: item.price,
        };
      }
    });

    console.log("Yeni CartObj:", newCartObj);
    
    setCartObj(newCartObj);

    localStorage.setItem("cartObj", JSON.stringify(newCartObj));
  }, [cart]);
  
  
  
  return (
    <>
      <h2>Cart</h2>
      <a href="/products">Products</a>
      {
        Object.keys(cartObj)?.map(x => <div>
          <h3>{cartObj[x]?.name}</h3>
          <p>fiyat: {cartObj[x]?.price}</p>
          <p>miktar: {cartObj[x]?.quantity}</p>
        </div>)
      }
      <button>Sipariş Ver</button>
    </>
  )
}