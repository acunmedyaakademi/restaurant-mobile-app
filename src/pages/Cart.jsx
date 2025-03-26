import { useContext, useEffect, useState } from "react"
import { SupabaseContext } from "../App"
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { supabase, cart, setCart, cartObj, setCartObj } = useContext(SupabaseContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

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
  
  async function completeOrder() {
    const { data, error } = await supabase
    .from('orders')
    .insert([
      { paid_price: calculatePrice(), status_id: 1 },
    ])
    .select()

    console.log(data);

    const orderDetails = cart.map(item =>{ return {
      order_id: data[0].id, 
      product_id: item.id
    }})
    
    const { data:order_details, err } = await supabase
    .from('order_details')
    .insert(orderDetails)
    .select()

    localStorage.clear();
    navigate("/");
  }

  function calculatePrice() {
    let fullPrice = 0;
    cart.map(x => fullPrice = fullPrice + x.price);
    setTotalPrice(fullPrice);
    return fullPrice;
  }
  
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
      <button onClick={completeOrder}>Sipariş Ver</button>
    </>
  )
}