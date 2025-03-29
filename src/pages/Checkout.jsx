import { useContext, useEffect, useRef, useState } from "react";
import { SupabaseContext } from "../App";
import { useNavigate } from "react-router-dom";

// calculatePrice ve totalPrice useState'i app.jsx'e taşınabilir

export default function Checkout() {
  const { supabase, cart, setCart, cartObj, setCartObj, userId } = useContext(SupabaseContext);
  const [addresses, setAddresses] = useState([]);
  const [chosenAddress, setChosenAddress] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const addressSelectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getAddr() {
      let { data, error } = await supabase
        .from('addresses')
        .select('*')
      setAddresses(data);
      setChosenAddress(data[0]);

    }
    getAddr();
    console.log(cart, cartObj)
  }, [])

  async function completeOrder() {
    const addrId = chosenAddress.id;
    const { data, error } = await supabase
      .from("orders")
      .insert([{
        paid_price: calculatePrice(),
        status_id: 1,
        address_id: addrId
      }])
      .select();

    console.log(data);
    console.log(error);

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

  function handleAddressSelection(addr) {
    setChosenAddress(addr);
    addressSelectionRef.current.close();
  }

  return (
    <>
      <div className="page-container-with-navbar">
        <h2>Siparişi Önizlemesi</h2>
        <h3>Ürünler</h3>
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
        <h3>Adres</h3>
        <div>
          {chosenAddress?.adres_basligi}
          <button onClick={() => addressSelectionRef.current.showModal()}>Adresi Değiştir</button>
        </div>
        <h3>Ödeme Yöntemi</h3>
        <div className="payment-method">
          Mastercard **34
        </div>
        <button className="order-button" onClick={completeOrder}>Siparişi Tamamla</button>
        
        <dialog ref={addressSelectionRef}>
          {
            addresses?.map(x => <div>
              <h4>{x?.adres_basligi}</h4>
              <p>{x.mahalle}, {x.ilce}, {x.il}</p>

              <button onClick={() => handleAddressSelection(x)}>Bu adresi seç</button>
            </div>)
          }
        </dialog>

      </div>
    </>
  )
}