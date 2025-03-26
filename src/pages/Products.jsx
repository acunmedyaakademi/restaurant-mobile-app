import { useContext, useEffect, useState } from "react"
import { SupabaseContext } from "../App"

export default function Products() {
  const { supabase } = useContext(SupabaseContext);
  const [categories, setCategories] = useState([]);

  
  useEffect(() => {
    async function getProducts() {
      let { data, error } = await supabase
      .from('categories')
      .select('*')
      setCategories(data);
      console.log(data);
    }
    getProducts();

  }, [])

  return (
    <>
    Products
    </>
  )
}