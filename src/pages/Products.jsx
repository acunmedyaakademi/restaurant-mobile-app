import { useContext, useEffect, useState } from "react"
import { SupabaseContext } from "../App"

export default function Products() {
  const { supabase, cart, setCart, cartObj, setCartObj } = useContext(SupabaseContext);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    async function getProducts() {
      let { data: categories, error } = await supabase
        .from('categories')
        .select('*')
      setCategories(categories);
      
      let { data: productsList, err } = await supabase
      .from('products')
      .select('*')

      setAllProducts(productsList);
      // filterProducts(categories[0].id) 
      setProducts(productsList.filter(x => x.category_id == categories[0].id));
    }
    getProducts();

  }, [])

  
  useEffect(() => {
    if (!Array.isArray(cart)) return; 

    const newCartObj = {};
    cart.forEach(item => {
      if (newCartObj[item.name]) {
        newCartObj[item.name].quantity++;
      } else {
        newCartObj[item.name] = {
          name: item.name,
          id: item.id,
          quantity: 1,
          price: item.price,
        };
      }
    });
    
    setCartObj(newCartObj);

    localStorage.setItem("cartObj", JSON.stringify(newCartObj));
  }, [cart]);

  function filterProducts(filter) {
    setProducts(allProducts.filter(x => x.category_id == filter));
  }
  

  function addProductToCart(product) {
    setCart((prev) => {
      const updatedCart = [...prev, product];
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Güncellenmiş sepeti localStorage'a kaydet
      return updatedCart;
    });
  }

  function handleQuantityIncrease() {

  }

  function handleQuantityDecrease() {
    
  }

  return (
    <>
      <h2>Products</h2>
      <a href="/cart">Cart</a>
      <div className="categories">
        <button onClick={() => setProducts(allProducts)}>All</button>
        {
          categories.map(x => x.length != 0 && <button onClick={() => filterProducts(x?.id)}>{x.name}</button>)
        }
      </div>
      <div className="products-cont">
        {
          products.map(x => <div className="product-list-item">
            <img src={x.img} alt="" />
            <h3>{x.name}</h3>
            <h4>{x.price}</h4>
            
            {/* ekle / çıkara dönüşsün */}
            {
              Object.keys(cartObj).includes(x.name)
              ? 
              <>
                <button>-</button>
                  {cartObj[x.name].quantity}
                <button>+</button>
              </>
              : <button onClick={() => addProductToCart(x)}>+</button>
            }
            
            </div>)
        }
      </div>

    </>
  )
}