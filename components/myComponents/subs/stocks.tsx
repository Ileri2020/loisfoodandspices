"use client"
import stocks from "@/data/stocks"
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "@/store/cart-slice";
import {RootState} from "@/store";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAppContext } from "@/hooks/useAppContext";
import axios from "axios";
import { ProductCard } from "./productCard";
import { useCart } from "@/hooks/use-cart";

const Stocks = () => {
  const { user, setUser, cart, setCart } = useAppContext();
  const { items, addItem, removeItem, subtotal } = useCart();
  const [products, setProducts] = useState<any>([]);
  //const cartItems = useSelector((state : RootState)=>state.cart.itemsList)
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  // const cart = (name : string, id : string, price : number, img : string) => {
  //   dispatch(
  //     cartActions.addToCart({
  //       name,
  //       id,
  //       price,
  //       img,
  //     })
  //   )
  //  // console.log(cartItems)
  // }
  //const navigate = useRouter()

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/dbhandler?model=product');
      setProducts(res.data.slice().sort(()=>Math.random()-0.5));
    } catch (err) {
      alert("Failed to fetch products, please check your network connection");
      setLoading(true);
    }
  };

  useEffect(() => {
      fetchProducts()
      setLoading(false);
  }, []);

if (loading) {
  return <p>Loading...</p>;
}

if (error) {
  return <p>Error: {error}</p>;
}

// const handleAddToCart = (product) => {
//   //alert(`Adding product ${productId} to cart`);
//   setCart([...cart, {...product, quantity : 1}]);
//   console.log('cart', cart)
//   // Add actual cart logic here
// };

const handleAddToWishlist = (productId) => {
  alert(`Adding product ${productId} to wishlist`);
  // Add actual wishlist logic here
};


  return (
    <div className='h-full max-w-[500px] md:max-w-[1000px] flex gap-5 flex-wrap mx-5 p-2 self-center justify-between overflow-clip'>
      {
        products.map((stock, index)=>{
          return(
              <ProductCard 
                key={index}  
                className="w-[100vw] md:w-[200px] /h-[150px] /md:h-[300px] mb-5 flex flex-row md:flex-col overflow-clip"
                product={{ ...stock, inStock: true, originalPrice: 1000, rating: 5 }}
                onAddToCart={addItem}
                onAddToWishlist={handleAddToWishlist}
              />
          )
        })
      }
    </div>
  )
}

export default Stocks













































// <div key={index} className="w-[100vw] md:w-[200px] /h-[150px] /md:h-[300px] mb-5 flex flex-row md:flex-col overflow-clip">
            //   <Link href={`/store/${stock.id}`} className="h-full md:h-[60%] w-[30%] md:w-full mx-2 md:mx-0 flex justify-center items-center">
            //     <img src={stock.images[0]} alt="" className="h-full rounded-sm"/>
            //   </Link>
              
            //   <div className="flex flex-1 flex-col text-start md:text-center mx-2 md:mx-0 justify-between md:justify-normal md:items-center">
            //     <Link href={`/store/${stock.id}`} className="w-full md:text-center flex flex-col md:justify-center md:items-center">
            //       <div className="font-semibold">{stock.name}</div>
            //       <div className="font-semibold text-foreground/80">₦ {stock.price}</div>
            //       {/* <div className="text-foreground/80 text-sm">{stock.qty} pcs</div> */}
            //     </Link>
            //     <div className="flex flex-row gap-1 w-full px-5">
            //       <Link href={`/store/${stock.id}`}><Button className="rounded-lg flex-1 w-full font-semibold text-background hover:bg-accent/10 hover:border-2 hover:border-accent hover:text-accent">view</Button></Link>
            //       <Button onClick={() => cart(stock.name, stock._id, stock.price, stock.img)} variant={"outline"} className="rounded-lg flex-1 w-full font-semibold text-accent-secondary border-accent-secondary hover:bg-accent-secondary/60 hover:text-background border-2">cart</Button>
            //     </div>
            //   </div>
            // </div>