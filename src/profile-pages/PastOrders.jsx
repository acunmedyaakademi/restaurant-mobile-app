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
      <div className="page-container-with-navbar">
        <div className="past-orders-header">
          <h2>Geçmiş Siparişler</h2>
          <a href="/Settings">Ayarlar</a>
        </div>
        <div className="past-order-items">
          {orders && orders?.map((x) => (
            <div key={x?.id}>
              <div className="past-order-item">
                <h3>Sipariş No. #{x?.id}</h3>
                <p className="past-order-item-date">{new Date(x?.created_at).toLocaleString()}</p>
                <p className="past-order-item-price">Toplam: {x?.paid_price}₺</p>
                <p className="past-order-item--status">{statusList[x?.status_id]}</p>
                <h4>Sipariş İçeriği</h4>
                <p className="past-order-products">
                  {groupItems(x?.order_details).map((item, index) => (
                    <p key={index} className="past-order-product"> {item?.productName} ({item?.count} Adet)</p>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}