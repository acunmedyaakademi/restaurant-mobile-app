import { useContext, useEffect } from "react";
import { useState } from "react"
import { SupabaseContext } from "../App";

export default function Addresses() {
  const { supabase, userId } = useContext(SupabaseContext);
  const [addresses, setAddresses] = useState([]);
  const [addNew, setAddNew] = useState(false);

  useEffect(() => {
    async function getAddresses() {
      let { data, error } = await supabase
      .from('addresses')
      .select('*')
      setAddresses(data);
              
    }

    getAddresses();
  }, [])


  return (
    <>
      <div className="page-container-with-navbar">
        <h2>Adresler</h2>
        {
          addNew
            ? <NewAddressForm setAddNew={setAddNew} />
            : <>
              <button onClick={() => setAddNew(true)}>+ Yeni Adres Ekle</button>
              <div className="addresses-list">
                {
                  addresses.length == 0
                    ? <div>Kayıtlı Adres Bulunamadı.</div>
                    : <>
                    {
                      addresses.map(x => <div>
                        <h3>{x.adres_basligi}</h3>
                        <p>{x.mahalle}, {x.ilce}, {x.il}</p>
                        <button>Sil</button>
                        <button>Düzenle</button>
                      </div>)
                    }
                    </>
                }
              </div>
            </>
        }
      </div>
    </>
  )
}

function NewAddressForm({ setAddNew }) {
  const { supabase, userId } = useContext(SupabaseContext);

  async function handleAddNewAddress(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    const { adres_basligi, il, ilce, mahalle, adres } = formObj;

    const { data, error } = await supabase
    .from('addresses')
    .insert([
      { user_id: userId, adres_basligi, il, ilce, mahalle, adres },
    ])
    .select()
    setAddNew(false);
            
  }

  return (
    <>
      <button onClick={() => setAddNew(false)}>Geri Dön</button>
      <form className="new-address-form" onSubmit={handleAddNewAddress}>
        <input type="text" name="adres_basligi" placeholder="adres başlığı" />
        <input type="text" name="il" placeholder="il" />
        <input type="text" name="ilce" placeholder="ilçe" />
        <input type="text" name="mahalle" placeholder="mahalle" />
        <input type="text" name="adres" placeholder="adres" />
        <button>Adres Ekle</button>
      </form>
    </>
  )
}