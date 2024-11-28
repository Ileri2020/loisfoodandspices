"use client"
import { motion } from "framer-motion"
import {Signup} from "@/components/myComponents/subs"
import dynamic from 'next/dynamic'
const Login = dynamic(() => import('@/components/myComponents/subs').then((e) => e.Login),{ssr: false,})
import { Button } from "@/components/ui/button"
import { BiPencil } from "react-icons/bi"
import { useEffect } from "react"
import Link from "next/link"

const Account = () => {

  return (
    <motion.section
      initial = {{ opacity: 0 }}
      animate = {{
        opacity : 1,
        transition : { delay: 0.5, duration: 0.6, ease: "easeIn"}
      }}
      className="w-[100vw] min-h-full overflow-clip"
    >
      <Signup />
      <Login />
      <div className="w-full h-full flex flex-col items-center">
        <div className="w-full h-[60vw] max-w-[280px] max-h-[280px] rounded-full overflow-clip mb-10 mx-2 flex justify-center items-center"><img src={"./placeholderFemale.webp"} className="w-full" alt="" /></div>
        <div className="flex flex-col gap-2 w-full max-w-xl">
          <div className="w-full px-3">
            <div className="flex flex-row gap-3 items-center">
              <div className="w-14 h-14">icon</div>
              <div className="flex-1 flex flex-col">
                <div className="text-sm text-foreground/70">Name</div>
                <div className="text-lg font-semibold">Tobi Bola</div>
              </div>
              <div className="text-3xl text-accent"><BiPencil /></div>
            </div>
          </div>
          <div className="w-full px-3">
            <div className="flex flex-row gap-3">
              <div className="w-14 h-14">icon</div>
              <div className="flex-1">
                <div className="text-sm text-foreground/70">Username</div>
                <div className="text-lg font-semibold">Tobi246</div>
              </div>
            </div>
          </div>
          <div className="w-full px-3">
            <div className="flex flex-row gap-3">
              <div className="w-14 h-14">icon</div>
              <div className="flex-1">
                <div className="text-sm text-foreground/70">Admission no</div>
                <div className="text-lg font-semibold">849290047</div>
              </div>
            </div>
          </div>
          <div className="w-full px-3">
            <div className="flex flex-row gap-3">
              <div className="w-14 h-14">icon</div>
              <div className="flex-1">
                <div className="text-sm text-foreground/70">Email</div>
                <div className="text-lg font-semibold">tobi@gmail.com</div>
              </div>
            </div>
          </div>
          <div className="w-full px-3">
            <div className="flex flex-row gap-3">
              <div className="w-14 h-14">icon</div>
              <div className="flex-1">
                <div className="text-sm text-foreground/70">Contact</div>
                <div className="text-lg font-semibold">0849290047</div>
              </div>
            </div>
          </div>
        </div>
        <div><Button>Logout</Button></div>
      </div>
    </motion.section>
  )}

export default Account




