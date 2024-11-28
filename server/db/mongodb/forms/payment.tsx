"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import {serveraddr} from "@/data/env"
import placeholder from '@/assets/placeholderFemale.webp';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const PaymentForm = (props: {method : string,}) => {
  const [details, setDetails] = useState({
    orderId : "",
    amount : 0,
    transactionId : "",
    paymentMethod : "",
    paymentStatus : "",
  })

  const [render, setRender] = useState(0);

  useEffect(() => {
  }, [render]);

  interface RefObject<T> {
    readonly current: T | null
  }

    const form = useRef<HTMLFormElement>(null);

    const addProduct =async (e : FormEvent) => {
      e.preventDefault();
      const payment = {}

      const submitToServer =async ()=>{
        await fetch(`${serveraddr + "/api/v1/post/upload"}`, {
          //mode: 'no-cors',  mode: 'no-cores'   mode: 'cores'
          method: `${props.method}`,
          // headers: {
          //     "Content-Type": "application/json",
          // },
          body: JSON.stringify(payment),
          // body: JSON.stringify(form)
        })
        .then((response) => response.json())
        .then((data) => {form.current?.reset();  setRender((prevRender) => (prevRender++)); alert("stock successfully uploaded")})
        .catch((error) => console.error(error));
      }
      console.log(`about to send to server ${details}`)
      
      submitToServer()
    };


    const handleChange = (e : any)=>{
      const { name, value, files } = e.target;

      if (name === 'file') {
        setDetails((prevFormData) => ({ ...prevFormData, file: files[0] }));
      } else {
        setDetails((prevFormData) => ({ ...prevFormData, [name]: value }));
      }
    }

    
  return (
    <div className='inline'>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">{props.method}</Button>
        </DrawerTrigger>
        <DrawerContent className='flex flex-col justify-center items-center py-5 my-1 /bg-red-500 max-w-5xl mx-auto'>
          <form ref={form  as RefObject<HTMLFormElement>} onSubmit={addProduct} className="flex flex-col gap-4 p-10 bg-secondary rounded-xl max-w-xl">
          <DrawerHeader>
            <DrawerTitle className="text-xl /text-accent mb-4 text-center font-semibold">{props.method} User from <span className='text-accent'>Succo</span></DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Input type="text" name='orderId' onChange={handleChange} placeholder="Order ID" className="rounded-sm bg-background" />
          <Input type="text" name="amount" onChange={handleChange} placeholder="Amount" className="rounded-sm bg-background" />
          <Input type="text" name="transactionId" onChange={handleChange} placeholder="Transaction ID" className="rounded-sm bg-background" />
        </div>
        <select name="paymentMethod" value={details.paymentMethod} onChange={handleChange} className='bg-secondary border-2 border-border h-8 ring-1 rounded-sm ring-accent/30'>
                <option value="gateway"> Gateway </option>
                <option value="Transfer"> Transfer</option>
                <option value="Cash"> Cash </option>
                <option value="Expense">Expense</option>
        </select>
        <select name="paymentStatus" value={details.paymentStatus} onChange={handleChange} className='bg-secondary border-2 border-border h-8 ring-1 rounded-sm ring-accent/30'>
                <option value="paid"> Paid </option>
                <option value="unpaid"> Unpaid</option>
        </select>
        <DrawerFooter className="flex flex-row w-full gap-2 mt-2">
                  {/* <Button>Submit</Button> */}
                  <DrawerClose className='flex-1' asChild>
                    <Button className='flex-1' variant="outline">Cancel</Button>
                  </DrawerClose>
                  <Button type="submit" className="flex-1 before:ani-shadow w-full">Submit</Button>
                </DrawerFooter>
    </form>
          {/* <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter> */}
        </DrawerContent>
      </Drawer>
    </div>
  )
}

// const paymentSchema = new mongoose.Schema({
//   orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Orders' },
//   paymentMethod: { type: String},
//   paymentStatus: { type: String, enum: ['paid', 'unpaid'] },
//   amount: { type: Number},
//   transactionId: { type: String},
// });

export default PaymentForm
