import { useContext, useEffect, useState } from "react"
import { SupabaseContext } from "../App"
import { useNavigate } from "react-router-dom";

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
    getUserData();
  }, [userId])

  return (
    <>
      <div className="page-container-with-navbar">
        <div className="profile-header">
          <h2>Hesap Bilgileri</h2>
          <a href="/Settings">Ayarlar</a>
        </div>
        <div className="profile-info-cont">
          <h3>{userInfo?.name} {userInfo?.surname}</h3>
          <p>Eposta: <span>{userInfo?.email}</span></p>
          <p>Telefon numarası: <span>{userInfo?.phone}</span></p>
          <button>Bilgileri Düzenle</button>
        </div>
      </div>
    </>
  )
}