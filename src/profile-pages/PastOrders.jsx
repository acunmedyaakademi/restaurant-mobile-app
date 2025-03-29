import { useContext, useEffect, useState } from "react"
import { SupabaseContext } from "../App"

export default function PastOrders() {
  const { supabase, authUser, userId } = useContext(SupabaseContext);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);

  // const statusList = [
  //   {
  //     id: 1,
  //     name: "Sipariş Alındı"
  //   },{
  //     id: 2,
  //     name: "Sipariş Hazırlanıyor"
  //   },{
  //     id: 3,
  //     name: "Sipariş Hazır"
  //   },{
  //     id: 4,
  //     name: "Sipariş İptal Edildi"
  //   },
  // ]
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
        .eq("user_id", userId);
      setOrders(data);
      console.log(data)


    }

    getData();
  }, [userId])

  return (
    <>
      <div className="page-container-with-navbar">
        <h2>Geçmiş Siparişler</h2>
        <div>
          {
            orders?.map(x => <div>
              <h3>{x?.created_at.split("T")[0]}</h3>
              <span>{statusList[x?.status_id]}</span>
              <p>
                {
                  x?.order_details.map((x, i) => <span> {x?.products?.name}</span>)
                }
              </p>
              <h4>₺{x?.paid_price}</h4>
            </div>)
          }
        </div>
      </div>
    </>
  )
}