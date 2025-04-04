import { useContext, useEffect, useState } from "react"
import { SupabaseContext } from "../App"

export default function Products() {
  const { supabase, cart, setCart, cartObj, setCartObj } = useContext(SupabaseContext);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [currentCategoryId, setCurrentCategoryId] = useState(1);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    async function getProducts() {
      let { data: categories, error } = await supabase
        .from('categories')
        .select('*')
      setCategories(categories);
      setCategoryName(capitalize(categories[0].name));

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
          img: item.img
        };
      }
    });

    setCartObj(newCartObj);

    localStorage.setItem("cartObj", JSON.stringify(newCartObj));
  }, [cart]);

  function filterProducts(filter) {
    setProducts(allProducts.filter(x => x.category_id == filter.id));
    setCurrentCategoryId(filter.id);
    setCategoryName(capitalize(filter.name));
  }


  function addProductToCart(product) {
    setCart((prev) => {
      const updatedCart = [...prev, product];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  }

  function handleQuantityIncrease(product) {
    setCart((prev) => {
      const updatedCart = [...prev, product];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  }

  function handleQuantityDecrease(product) {
    setCart((prev) => {
      const updatedCart = [...prev];
      const productToRemoveIndex = updatedCart.findIndex(x => x.id === product.id);
      if (productToRemoveIndex !== -1) {
        updatedCart.splice(productToRemoveIndex, 1);
      }
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    })
  }

  function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1);
  }

  return (
    <>
      <div className="product-page-container page-container-with-navbar">
        <h2>Ürünler</h2>
        {/* <a href="/cart">Cart</a> */}
        <div className="categories">
          {/* <button onClick={() => setProducts(allProducts)}>All</button> */}
          {
            categories.map(x =>
              <button
                className={x.id == currentCategoryId
                  ? "current-category"
                  : ""}
                onClick={() => filterProducts(x)}>
                {capitalize(x.name)}
              </button>)
          }
        </div>
        <div className="products-cont">
          <h3>{categoryName}</h3>
          <div className="products-list">
            {
              products.map(x => <div className="product-list-item">
                <div className="product-item-img">
                  <img src={x.img} />
                </div>
                <h4>{x.name}</h4>
                <div className="product-item-footer">
                  <h5>₺{x.price}</h5>
                  <div className="quantity-controls">
                    {
                      Object.keys(cartObj).includes(x.name)
                        ?
                        <>
                          <button className="cart-decrease-btn cart-quantity-control" onClick={() => handleQuantityDecrease(x)}>{minusSvg}</button>
                          <span className="cart-quantity">{cartObj[x.name].quantity}</span>
                          <button className="cart-increase-btn cart-quantity-control" onClick={() => handleQuantityIncrease(x)}>{plusSvg}</button>
                        </>
                        : <button className="add-to-cart-btn" onClick={() => addProductToCart(x)}>{plusSvg}</button>
                    }
                  </div>
                </div>

              </div>)
            }
          </div>
        </div>
      </div>

    </>
  )
}

export const plusSvg = <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12H20M12 4V20" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>

export const minusSvg = <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12L18 12" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>