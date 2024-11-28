"use client"
import stocks from "@/data/stocks"
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "@/store/cart-slice";
import {RootState} from "@/store";
import { serveraddr } from '@/data/env';
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const Stocks = () => {
  type stockCategory = {
    _id: string;
    name: string;
    description: string;
    img: string;
    price: number;
    cost: number;
    qty: number;
    __v: number;
  };
  //const cartItems = useSelector((state : RootState)=>state.cart.itemsList)
  const dispatch = useDispatch();
  const [data, setData] = useState<stockCategory[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const cart = (name : string, id : string, price : number, img : string) => {
    dispatch(
      cartActions.addToCart({
        name,
        id,
        price,
        img,
      })
    )
   // console.log(cartItems)
  }
  //const navigate = useRouter()

  useEffect(() => {
    fetch(`${serveraddr + "/api/v1/post/stocks"}`)
      .then(response => response.json())
      .then(data => data.slice().sort(()=>Math.random()-0.5))
      .then(data => {
        setData(data);
        // data.forEach((obj : any) => {
        //   console.log(obj._id, obj.name, obj.price);
        // });
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        alert("unable to connect to server please check your network connection");
        setLoading(true);
      });
  }, []);

if (loading) {
  return <p>Loading...</p>;
}

if (error) {
  return <p>Error: {error}</p>;
}

  return (
    <div className='h-full max-w-[500px] md:max-w-[1000px] flex gap-5 flex-wrap mx-5 p-2 self-center justify-between overflow-clip'>
      {
        data.map((stock, index)=>{
          return(
            <div key={index} className="w-[100vw] md:w-[200px] /h-[150px] /md:h-[300px] mb-5 flex flex-row md:flex-col overflow-clip">
              <Link href={`/store/${stock._id}`} className="h-full md:h-[60%] w-[30%] md:w-full mx-2 md:mx-0 flex justify-center items-center">
                <img src={stock.img} alt="" className="h-full rounded-sm"/>
              </Link>
              
              <div className="flex flex-1 flex-col text-start md:text-center mx-2 md:mx-0 justify-between md:justify-normal md:items-center">
                <Link href={`/store/${stock._id}`} className="w-full md:text-center flex flex-col md:justify-center md:items-center">
                  <div className="font-semibold">{stock.name}</div>
                  <div className="font-semibold text-foreground/80">₦ {stock.price}</div>
                  {/* <div className="text-foreground/80 text-sm">{stock.qty} pcs</div> */}
                </Link>
                <div className="flex flex-row gap-1 w-full px-5">
                  <Link href={`/store/${stock._id}`}><Button className="rounded-lg flex-1 w-full font-semibold text-background hover:bg-accent/10 hover:border-2 hover:border-accent hover:text-accent">view</Button></Link>
                  <Button onClick={() => cart(stock.name, stock._id, stock.price, stock.img)} variant={"outline"} className="rounded-lg flex-1 w-full font-semibold text-accent-secondary border-accent-secondary hover:bg-accent-secondary/60 hover:text-background border-2">cart</Button>
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default Stocks
