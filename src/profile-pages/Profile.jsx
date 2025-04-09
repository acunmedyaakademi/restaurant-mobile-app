import { useContext, useEffect, useRef, useState } from "react"
import { SupabaseContext } from "../App"

export default function Profile() {
  const { supabase, authUser, userId } = useContext(SupabaseContext);
  const [userInfo, setUserInfo] = useState({});
  const editProfileRef = useRef(null);

  useEffect(() => {
    async function getUserData() {
      let { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .eq("id", userId)
      setUserInfo(profiles?.at(0))
        
    }
    getUserData() ;
  }, [userId])

  return (
    <>
      <div className="page-container-with-navbar settings-page">
        <h2>Hesap Bilgileri</h2>
        <div className="profile-info-cont">
          <h3>{userInfo?.name} {userInfo?.surname}</h3>
          <p>Eposta: {userInfo?.email}</p>
          <p>Telefon numarası: {userInfo?.phone}</p>
          <button 
          onClick={() => editProfileRef.current.showModal()}
          className="setting-btn red-btn wide-btn" >Bilgileri Düzenle</button>
        </div>
      </div>
      <EditProfileDialog userId={userId} editProfileRef={editProfileRef} userInfo={userInfo} supabase={supabase} />
    </>
  )
}

function EditProfileDialog({ userId, editProfileRef, userInfo, supabase }) {
  

  async function editProfile(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    const { email, phone } = formObj;
    const { data, error } = await supabase
    .from('profiles')
    .update({ email, phone })
    .eq('id', userId)
    .select()

    editProfileRef.current.close();
  }
 
  return (
    <dialog ref={editProfileRef}>
      <h3>Profil Bilgilerini Düzenle</h3>
      <form onSubmit={editProfile}>
        <input type="text" name="email" defaultValue={userInfo?.email} />
        <input type="text" name="phone" defaultValue={userInfo?.phone} />
        <button className="dialog-btn profile-edit-btn">Güncelle</button>
      </form>
    </dialog>
  )
}