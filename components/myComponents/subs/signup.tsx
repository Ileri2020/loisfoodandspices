"use client"
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
// const AlertDialog = dynamic(() => import('@/components/ui/alert-dialog').then((e) => e.AlertDialog),{ssr: false,})
// const AlertDialogAction = dynamic(() => import('@/components/ui/alert-dialog').then((e) => e.AlertDialogAction),{ssr: false,})
// const AlertDialogCancel = dynamic(() => import('@/components/ui/alert-dialog').then((e) => e.AlertDialogCancel),{ssr: false,})
// const AlertDialogContent = dynamic(() => import('@/components/ui/alert-dialog').then((e) => e.AlertDialogContent),{ssr: false,})
// const AlertDialogDescription = dynamic(() => import('@/components/ui/alert-dialog').then((e) => e.AlertDialogDescription),{ssr: false,})
// const AlertDialogFooter = dynamic(() => import('@/components/ui/alert-dialog').then((e) => e.AlertDialogFooter),{ssr: false,})
// const AlertDialogHeader = dynamic(() => import('@/components/ui/alert-dialog').then((e) => e.AlertDialogHeader),{ssr: false,})
// const AlertDialogTitle = dynamic(() => import('@/components/ui/alert-dialog').then((e) => e.AlertDialogTitle),{ssr: false,})
// const AlertDialogTrigger = dynamic(() => import('@/components/ui/alert-dialog').then((e) => e.AlertDialogTrigger),{ssr: false,})
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
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { serveraddr } from '@/data/env'
import { Label } from '@/components/ui/label'
import { register } from '@/server/action/signup'

const Signup = () => {
  const [details, setDetails] = useState({
    firstName : "",
    lastName : "",
    email : "",
    password : "",
  })

  // const [render, setRender] = useState(0);

  // useEffect(() => {
  // }, [render]);

  interface RefObject<T> {
    readonly current: T | null
  }

    const form = useRef<HTMLFormElement>(null);


    const handleChange = (e : any)=>{
      const { name, value } = e.target;

      setDetails((prevFormData) => ({ ...prevFormData, [name]: value }));
    }

  return (
    <div className='inline'>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Sign up</Button>
        </DrawerTrigger>
        <DrawerContent className='flex flex-col justify-center items-center py-10 /bg-red-500 max-w-5xl mx-auto'>

          <DrawerHeader>
            <DrawerTitle className='w-full text-center'>Create an account with <span className='text-accent'>Succo</span></DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <form ref={form  as RefObject<HTMLFormElement>} action={register} className="flex flex-col gap-4 p-10 bg-secondary rounded-xl max-w-xl">
            <div className="/grid /grid-cols-1 /md:grid-cols-2 /gap-2 flex flex-col gap-2">
              <div className='flex flex-row justify-between items-center'>
                <Label htmlFor="firstName">First Name :</Label>
                <Input type="text" id='firstName' name='firstName' onChange={handleChange} placeholder="Firstname" className="rounded-sm bg-background w-56" />
              </div>
              
              <div className='flex flex-row justify-between items-center'>
                <Label htmlFor="lastName">Last Name</Label>
                <Input type="text" id="lastName" name="lastName" onChange={handleChange} placeholder="Lastname" className="rounded-sm bg-background w-56" />
              </div>

              <div className='flex flex-row justify-between items-center'>
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" name="email" onChange={handleChange} placeholder="example@gmail.com" className="rounded-sm bg-background w-56" />
              </div>

              <div className='flex flex-row justify-between items-center'>
                <Label htmlFor="password">Password</Label>
                <Input type="password" id='password' name='password' onChange={handleChange} placeholder="*********" className="rounded-sm bg-background w-56" />
              </div>
            </div>
            
            <DrawerFooter className="flex flex-row w-full gap-2 mt-2">
              {/* <Button>Submit</Button> */}
              <DrawerClose className='flex-1' asChild>
                <Button className='flex-1' variant="outline">Cancel</Button>
              </DrawerClose>
              <Button type="submit" className="flex-1 before:ani-shadow w-full">Sign up &rarr;</Button>
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

export default Signup


