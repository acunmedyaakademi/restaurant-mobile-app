import { useContext, useEffect, useRef } from "react";
import { useState } from "react"
import { SupabaseContext } from "../App";

export default function Addresses() {
  const { supabase, userId } = useContext(SupabaseContext);
  const [addresses, setAddresses] = useState([]);
  const [addNew, setAddNew] = useState(false);
  const editDialogRef = useRef(null);
  const deleteDialog = useRef(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    async function getAddresses() {
      let { data, error } = await supabase
        .from('addresses')
        .select('*')
      setAddresses(data);

    }

    getAddresses();
  }, [])

  async function deleteAddress(e) {
    e.preventDefault();
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', selectedAddressId)
    deleteDialog.current.close();

  }


  return (
    <>
      <div className="page-container-with-navbar">
        <div className="addresses-header">
          <h2>Adresler</h2>
          <a href="/Settings">Ayarlar</a>
        </div>

        {
          addNew
            ? <NewAddressForm setAddNew={setAddNew} />
            : <>
              <button className="new-address-button" onClick={() => setAddNew(true)}>+ Yeni Adres Ekle</button>
              <div className="addresses-list">
                {
                  addresses.length == 0
                    ? <div>Kayıtlı Adres Bulunamadı.</div>
                    : <>
                      {
                        addresses.map(x =>
                          <div className="address-list-item">
                            <h3>{x.adres_basligi}</h3>
                            <p>{x.mahalle}, {x.ilce}, {x.il}, {x.adres}</p>
                            <button onClick={() => { deleteDialog.current.showModal(); setSelectedAddressId(x.id) }}>Sil</button>
                            <button onClick={() => editDialogRef.current.showModal()}>Düzenle</button>
                          </div>)
                      }
                    </>
                }
              </div>
            </>
        }
        <dialog ref={deleteDialog}>
          <h3>Seçili Adres Silinecek. Emin Misiniz?</h3>
          <button onClick={(e) => deleteAddress(e)}>Adresi Sil</button>
          <button onClick={() => deleteDialog.current.close()}>Vazgeç</button>

        </dialog>
        <EditDialog editDialogRef={editDialogRef} selectedAddressId={selectedAddressId} setSelectedAddressId={setSelectedAddressId} />
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

function EditDialog({ editDialogRef, selectedAddressId, setSelectedAddressId }) {
  const { supabase, userId } = useContext(SupabaseContext);
  const [address, setAddress] = useState({});

  useEffect(() => {
    async function getCurrentAddress() {

      let { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('id', selectedAddressId)
      setAddress(data)
      console.log(data);


    }

    getCurrentAddress();

  }, [])


  async function handleEditAddress(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    const { adres_basligi, il, ilce, mahalle, adres } = formObj;
    const { data, error } = await supabase
      .from('addresses')
      .update({ adres_basligi, il, ilce, mahalle, adres })
      .eq('user_id', userId)
      .select()

    editDialogRef.current.close();
  }

  return (
    <dialog ref={editDialogRef}>
      Güncelle
      <form onSubmit={handleEditAddress}>
        <input type="text" name="adres_basligi" placeholder="adres başlığı" defaultValue={address?.adres_basligi} />
        <input type="text" name="il" placeholder="il" defaultValue={address?.il} />
        <input type="text" name="ilce" placeholder="ilçe" defaultValue={address?.ilce} />
        <input type="text" name="mahalle" placeholder="mahalle" defaultValue={address?.mahalle} />
        <input type="text" name="adres" placeholder="adres" defaultValue={address?.adres} />
        <button>Adresi Güncelle</button>
      </form>
    </dialog>
  )
}
