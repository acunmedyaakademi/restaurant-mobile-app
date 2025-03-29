import { useContext, useEffect, useState } from "react"
import { SupabaseContext } from "../App"

export default function Profile() {
  const { supabase, authUser, userId } = useContext(SupabaseContext);
  const [userInfo, setUserInfo] = useState({});

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
      <div className="page-container-with-navbar">
        <h2>Hesap Bilgileri</h2>
        <div className="profile-info-cont">
          <h3>{userInfo?.name} {userInfo?.surname}</h3>
          <p>Eposta: {userInfo?.email}</p>
          <p>Telefon numarası: {userInfo?.phone}</p>
          <button>Bilgileri Düzenle</button>
        </div>
      </div>
    </>
  )
}