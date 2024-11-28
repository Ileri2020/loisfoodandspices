"use client"
import { motion } from "framer-motion"
import { useSelector } from "react-redux"; //useDispatch, 
import { RootState } from "@/store";
import { CartItems } from '@/components/myComponents/subs/index';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PayDrawer } from "@/components/myComponents/paydrawer";

const Cart = () => {
  const cartItems = useSelector((state : RootState)=>state.cart.itemsList)
  // const dispatch = useDispatch();
  // const cart = (name : string, id : number, price : number) => {
  //   dispatch(
  //     cartActions.addToCart({
  //       name,
  //       id,
  //       price,
  //     })
  //   )
  //   console.log(cartItems)
  // }

  let total = 0

  cartItems.forEach((item)=>{ total = total + item.totalPrice})

  return (
    <motion.section
      initial = {{ opacity: 0 }}
      animate = {{
        opacity : 1,
        transition : { delay: 0.5, duration: 0.6, ease: "easeIn"}
      }}
      className="w-[100vw] overflow-clip"
    >
      <ScrollArea className="mx-auto max-w-3xl max-h-[65vh] flex flex-col">
        {cartItems.length < 1 ?
          <div>No stock in cart</div>
          :
          cartItems.map((stock, index)=>{
            return(
              <CartItems name={stock.name} price={stock.price} qty={stock.quantity} id={stock.id} totalPrice={stock.totalPrice} img={stock.img} key={index}/>
            )
          })}
      </ScrollArea>
      <div>
        <div className="mx-auto max-w-3xl flex flex-col mt-5 gap-2">
          <div className="flex flex-row justify-between items-center">
            <div>total : <span className="text-accent text-xl font-semibold">₦ {total}</span></div>
            <div className="flex flex-row gap-2"><Button>book</Button><Button variant={"outline"} className="border-2 border-accent-secondary">order</Button></div>
            <div>
              <PayDrawer />
            </div>
          </div>
          <div>
            
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default Cart
