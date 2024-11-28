"use client"
import { motion } from "framer-motion"
import { Filters, Gallery, Footer} from "@/components/myComponents/subs"


const Home = () => {
  return (
    <motion.section
      initial = {{ opacity: 0 }}
      animate = {{
        opacity : 1,
        transition : { delay: 0.5, duration: 0.6, ease: "easeIn"}
      }}
      className="w-[100vw] min-h-full overflow-clip flex flex-col"
    >
      <Filters />
      <div className="flex-1 flex justify-center items-center w-full md:w-[85%] overflow-clip mx-auto">
        <Gallery />
      </div>
      <Footer />
    </motion.section>
  )
}

export default Home
