"use client"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
//import { useLocation} from "react-router-dom"
import Link from "next/link"
import { CiMenuFries } from "react-icons/ci"
import Links from "../../data/links";
import { ModeToggle } from '@/components/ui/mode-toggle'
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAppContext } from "@/hooks/useAppContext";
import { signOut } from "next-auth/react";

const Sidenav = () => {
    const pathname = usePathname();    
    const {user, setUser } = useAppContext();             
  return (
    <Sheet>
        <SheetTrigger className="flex justify-center items-center text-[32px] text-accent">
            <CiMenuFries />
        </SheetTrigger>
        <SheetHeader></SheetHeader>
        <SheetTitle></SheetTitle>
        <SheetContent className="flex flex-col justify-between items-center">
            <nav className="flex flex-col justify-center items-center gap-8 text-xl">
                {Links.Links.map((link, index) => {
                    return (
                        <Link href={link.path} key={index} className={`${ link.path === pathname && "text-accent border-b-2 border-accent"} capitalize font-medium hover:text-accent transition-all`}>
                        {link.name}
                        </Link>
                     )
                })}
            </nav>
            {user?.id !== "nil" ? (
                <Button
                    className="bg-red border-2 h-12 border-red-500 text-red-600 w-full flex-1"
                    variant="outline"
                    onClick={() => {
                    signOut({ callbackUrl: "/" });
                    setUser({
                        username: "visitor",
                        id: "nil",
                        email: "nil",
                        avatarUrl:
                        "https://res.cloudinary.com/dc5khnuiu/image/upload/v1752627019/uxokaq0djttd7gsslwj9.png",
                        role: "user",
                        department: "nil",
                        contact: "xxxx",
                    });
                    }}
                >
                    Logout
                </Button>
                ) : (
                <Link href="/account" className="w-full max-w-52">
                    <Button
                    className="h-12 px-8 w-full border-2 border-accent text-accent transition-colors duration-200"
                    size="lg"
                    variant="outline"
                    >
                    Login
                    </Button>
                </Link>
                )}

            <div className="my-5 w-full flex flex-row">
                <div className="flex w-full flex-1"></div>
                <ModeToggle />
            </div>
        </SheetContent>
    </Sheet>
  )
}

export default Sidenav
