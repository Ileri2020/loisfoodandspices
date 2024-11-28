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

const NotificationForm = (props: {method : string,}) => {
  const [details, setDetails] = useState({
    username : "",
    email : "",
    emailto : "",
    category : "",
    message : "",
  })
  
  interface RefObject<T> {
  readonly current: T | null
}
    
    const form = useRef<HTMLFormElement>(null);

    const sendMessage =async (e : FormEvent) => {
      e.preventDefault();
      const payment = {}

      const submitToServer =async ()=>{
        await fetch("/api/v1/post/upload", {
          //mode: 'no-cors',  mode: 'no-cores'   mode: 'cores'
          method: `${props.method}`,
          // headers: {
          //     "Content-Type": "application/json",
          // },
          body: JSON.stringify(payment),
          // body: JSON.stringify(form)
        })
        .then((response) => response.json())
        .then((data) => {form.current?.reset(); 
          setDetails({
            username : "",
            email : "",
            emailto : "",
            category : "",
            message : "",
          }); 
        alert("Message sent successfully")})
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
        <DrawerContent className='flex flex-col justify-center items-center py-5 /bg-red-500 max-w-5xl mx-auto'>
          <form ref={form  as RefObject<HTMLFormElement>} onSubmit={sendMessage}  className="flex flex-col gap-6 p-5 my-1 bg-secondary rounded-xl">
      {/* onSubmit={sendEmail} */}
      <DrawerHeader>
            <DrawerTitle className="text-xl /text-accent mb-2 text-center font-semibold">{props.method} Notification from <span className='text-accent'>Succo</span></DrawerTitle>
            <DrawerDescription>Message Other Users or Notify All</DrawerDescription>
          </DrawerHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input type="firstname" name="username" placeholder="Username" className="rounded-sm bg-background" />
        <Input type="email" name="email" placeholder="Email address" className="rounded-sm bg-background" />
        <Input type="text" name="emailto" placeholder="Email address message is for" className="rounded-sm bg-background" />
        </div>
        <select name="category" value={details.category} onChange={handleChange} className='bg-secondary border-2 border-border h-8 ring-1 rounded-sm ring-accent/30'>
                <option value="suggestion"> Suggestion </option>
                <option value="complaint"> Complaint</option>
                <option value="advert"> Advert </option>
                <option value="appreciate">Appreciate</option>
                <option value="reply">Reply</option>
                <option value="general">General</option>
        </select>
        <Textarea className="h-[120px]" name="message" placeholder="Type your message here" />
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

// const notificationSchema = new mongoose.Schema({
//   from: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
//   to: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
//   category: { type:String, enum: ['suggestion', 'complaint', 'advertise', 'comment', "reply", "general"], required: true },
//   message: { type: String},
//   read: { type: Boolean, default: false },
// });

export default NotificationForm
