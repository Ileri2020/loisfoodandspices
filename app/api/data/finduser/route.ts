import { NextApiRequest, NextApiResponse } from 'next';
import connect from '@/server/config/mongodb';
import User from '@/server/db/mongodb/models/users';
import { NextResponse } from 'next/server';
import { Types } from 'mongoose';

export const GET = async (req: Request) => { //, res: NextApiResponse
  try {
    const {searchParams} = new URL(req.url)
    const useremail = searchParams.get("email")
    console.log(useremail)
    if (!useremail){
      return new NextResponse(
        JSON.stringify({ message: "invalid credentials"}),
        { status: 400}
      )
    }

  //   const userData = await fetchUserDataFromDatabase(userId);

  await connect()

  let user    

  try {
      user = await User.findOne({ email : useremail }).select("+password +role")
  } catch (error) {
      // users = mongoose.model('users', userSchema)
      console.log("unable to get user from database")
  }


    return new NextResponse(JSON.stringify(user), {status: 200});
  } catch (error) {
    return new NextResponse(JSON.stringify({error: error.message}), {status: 500});
  }
};

// const fetchUserDataFromDatabase = async (userId: string) => {
//   // Replace this with your actual database query
//   // For example, using Mongoose:
//   // const User = mongoose.model('User');
//   // const user = await User.findById(userId).select('+password');
//   // return user;

//   // For demonstration purposes, return a mock user object
//   return {
//     id: userId,
//     name: 'John Doe',
//     email: 'john.doe@example.com',
//   };
// };




export const POST = async (req: Request) => {
  try{
    const body =await req.json()
    await connect();
    const user = new User(body)
    await user.save()
    return new NextResponse(JSON.stringify({message : "user created"}), {status: 200})
  } catch (error) {
    return new NextResponse(JSON.stringify({error : error}), {status: 500})
  }
}


export const PATCH = async (req: Request) => {
  try{
    const body =await req.json()
    const { userId, newUsername } = body
    await connect();
    if (!userId || !newUsername){
      return new NextResponse(
        JSON.stringify({ message: "invalid credentials"}),
        { status: 400}
      )
    }
    if (!Types.ObjectId.isValid(userId)){
      return new NextResponse(
        JSON.stringify({ message: "invalid id"}),
        { status: 400}
      )
    }
    const updatedUser = await User.findOneAndUpdate(
      {_id: new Types.ObjectId(userId)},  //new ObjectId(userId)
      {username: newUsername},
      {new: true},
    )
    if(!updatedUser){
      return new NextResponse(JSON.stringify({message : "user not found"}), {status: 400})
    }
    return new NextResponse(JSON.stringify({message : "user updated", user: updatedUser}), {status: 200})
  } catch (error) {
    return new NextResponse(JSON.stringify({error : error}), {status: 500})
  }
}


export const DELETE = async (req: Request) => {
  try{
    const {searchParams} = new URL(req.url)
    const userId = searchParams.get("userId")
    if (!userId){
      return new NextResponse(
        JSON.stringify({ message: "input your user id"}),
        { status: 400}
      )
    }
    if (!Types.ObjectId.isValid(userId)){
      return new NextResponse(
        JSON.stringify({ message: "invalid id"}),
        { status: 400}
      )
    }
    await connect();
    const deletedUser = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    )
    if (!deletedUser){
      return new NextResponse(
        JSON.stringify({ message: "user not found"}),
        { status: 400}
      )
    }
    return new NextResponse(JSON.stringify({message : "user deleted"}), {status: 200})
  } catch (error) {
    return new NextResponse(JSON.stringify({error : error}), {status: 500})
  }
}