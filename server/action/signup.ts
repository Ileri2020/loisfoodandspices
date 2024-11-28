"use server"

import User from "../db/mongodb/models/users.ts";
import connect from "../config/mongodb.ts";
import { hashSync } from "bcrypt-edge";
import { redirect } from "next/navigation";


const register = async ( formData : FormData) => {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log({firstName, lastName, email, password})

    let role = "user"
    if (!firstName && !lastName && !email && !password) {
         console.log("account already exist")
         return
    }

    const postUser =async ()=>{
        await connect();

        const existingUser = await User.findOne({email})

        if (existingUser) {console.log("user already exist"); redirect("account") ; return; } //throw new Error ("user already exists")
        if ( email == "adepojuololade2020@gmail.com" || email == "adepojuololade2020@gmail.com"){
            role = "admin"
        } 
        if ( email == "staff@gmail.com" || email == "rep@gmail.com"){
            role = "staff"
        } 
        const hashedPassword = await hashSync(password, 10)

        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            role: role,
        })
    }
    postUser()

};

export {register}