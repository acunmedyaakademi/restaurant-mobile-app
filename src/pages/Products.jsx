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
      <div className="product-page-container">
        <h2>Products</h2>
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
          <h2>{categoryName}</h2>
          <div className="products-list">
            {
              products.map(x => <div className="product-list-item">
                <img src={x.img} />
                <h3>{x.name}</h3>
                <h4>₺{x.price}</h4>
                <div className="quantity-controls">
                  {
                    Object.keys(cartObj).includes(x.name)
                      ?
                      <>
                        <button className="cart-decrease-btn cart-quantity-control" onClick={() => handleQuantityDecrease(x)}>-</button>
                        <span className="cart-quantity">{cartObj[x.name].quantity}</span>
                        <button className="cart-increase-btn cart-quantity-control" onClick={() => handleQuantityIncrease(x)}>+</button>
                      </>
                      : <button className="add-to-cart-btn" onClick={() => addProductToCart(x)}>+</button>
                  }
                </div>
              </div>)
            }
          </div>
        </div>
      </div>

    </>
  )
}