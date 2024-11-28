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

const UserForm = (props: {method : string,}) => {
  const [details, setDetails] = useState({
    firstName : "",
    lastName : "",
    email : "",
    password : "",
    role : "",
    file : "",
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
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('firstName', details.firstName);
      formDataToSubmit.append('lastName', `${details.lastName}`);
      formDataToSubmit.append('email', `${details.email}`);
      formDataToSubmit.append('password', `${details.password}`);
      formDataToSubmit.append('role', details.role);
      formDataToSubmit.append('file', details.file);

      const submitToServer =async ()=>{
        await fetch(`${serveraddr + "/api/v1/post/upload"}`, {
          //mode: 'no-cors',  mode: 'no-cores'   mode: 'cores'
          method: `${props.method}`,
          // headers: {
          //     "Content-Type": "application/json",
          // },
          body: formDataToSubmit,
          // body: JSON.stringify(form)
        })
        .then((response) => response.json())
        .then((data) => {form.current?.reset();  setRender((prevRender) => (prevRender++)); alert("stock successfully uploaded")})
        .catch((error) => console.error(error));
      }
      console.log(`about to send to server ${details}`)
      for (const [key, value] of formDataToSubmit.entries()) {
        console.log(key, value);
        if (key === 'file') {
          console.log('File is present in FormData');
        }
      }
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
        <DrawerContent className='flex flex-col justify-center items-center py-10 /bg-red-500 max-w-5xl mx-auto'>
          <form ref={form  as RefObject<HTMLFormElement>} onSubmit={addProduct} className="flex flex-col gap-4 p-5 my-1 bg-secondary rounded-xl max-w-xl">
          <DrawerHeader>
            <DrawerTitle className="text-xl /text-accent mb-2 text-center font-semibold">{props.method} User from <span className='text-accent'>Succo</span></DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input type="text" id='firstName' name='firstName' onChange={handleChange} placeholder="Firstname" className="rounded-sm bg-background w-56" />
                  
                    <Input type="text" id="lastName" name="lastName" onChange={handleChange} placeholder="Lastname" className="rounded-sm bg-background w-56" />
                  
                    <Input type="email" id="email" name="email" onChange={handleChange} placeholder="example@gmail.com" className="rounded-sm bg-background w-56" />
                
                    <Input type="password" id='password' name='password' onChange={handleChange} placeholder="*********" className="rounded-sm bg-background w-56" />
                </div> 
                <select name="role" value={details.role} onChange={handleChange} className='bg-secondary border-2 border-border ring-1 rounded-sm ring-accent/30 h-8'>
                    <option value="food"> Food </option>
                    <option value="drink"> Drink</option>
                    <option value="snacks"> Snacks </option>
                    <option value="suplement"> Suplement</option>
                </select>
                <Label htmlFor="img">Profile image:</Label>
                <Input name='file' onChange={handleChange} id="img" type="file" className="rounded-sm bg-background h-16" />
                <DrawerFooter className="flex flex-row w-full gap-2 mt-2">
                  {/* <Button>Submit</Button> */}
                  <DrawerClose className='flex-1' asChild>
                    <Button className='flex-1' variant="outline">Cancel</Button>
                  </DrawerClose>
                  <Button type="submit" className="flex-1 before:ani-shadow w-full">Submit</Button>
                </DrawerFooter>
            </div>
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

// export const userSchema = new mongoose.Schema({
//   firstName: { type: String},
//   lastName: { type: String},
//   userName: { type: String},
//   email: { type: String, unique: true, required: true },
//   password: { type: String},
//   role: { type: String, enum: ['admin', 'user', "staff"] },
//   address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
//   image: { type: String},
//   authProviderId: { type: String},
// });

export default UserForm
