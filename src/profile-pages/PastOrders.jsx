import { useContext, useEffect, useState } from "react"
import { SupabaseContext } from "../App"

export default function PastOrders() {
  const { supabase, authUser, userId } = useContext(SupabaseContext);
  const [orders, setOrders] = useState([]);

  const statusList = {
    1: "Sipariş Alındı",
    2: "Sipariş Hazırlanıyor",
    3: "Sipariş Hazır",
    4: "Sipariş İptal Edildi"
  }

  useEffect(() => {
    async function getData() {
      let { data, error } = await supabase
        .from("orders")
        .select(`
        id,
        created_at,
        status_id,
        paid_price,
        order_details ( 
          product_id,
          products ( name )
        )
      `)
        .order('created_at', { ascending: false })
        .eq("user_id", userId);
      setOrders(data)
    }

    getData();
  }, [userId])

  function groupItems(orderDetails) {
    const itemMap = {};
    orderDetails.forEach(({ product_id, products }) => {
      if (itemMap[product_id]) {
        itemMap[product_id].count += 1;
      } else {
        const productName = products.name
        itemMap[product_id] = { productName, count: 1 };
      }
    });
    return Object.values(itemMap);
  };


  return (
    <>
      <div className="page-container-with-navbar settings-page past-orders-page">
        <h2>Geçmiş Siparişler</h2>
        <div className="past-orders-list">
          {orders && orders?.map((x) => (
            <div className="past-order-item" key={x?.id}>
              <h3>Sipariş No. #{x?.id}</h3>
              <p>{new Date(x?.created_at).toLocaleString()}</p>
              <p>Toplam: {x?.paid_price}₺</p>
              <p>{statusList[x?.status_id]}</p>
              <p className="past-order-products">
                {groupItems(x?.order_details).map((item, index) => (
                  <span key={index}> {item?.productName} ({item?.count} Adet)</span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}