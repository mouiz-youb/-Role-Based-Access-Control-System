import prisma from '../utils/db.js';
import { hashPassword, comparePassword, validatePassword } from '../utils/HashPassword.js';
import {generateTokenPair,verifyRefreshToken,revokeRefreshToken,revokeAllUserTokens} from  "../utils/JWT.js"
const register =async(req,res)=>{
    const {email ,username, password }=req.body
    try {
        // check the fields
        if(!email  || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        // check if user already exist 
        const  existingUser = await prisma.user.findUnique({
            where:{email}
        })
        if(existingUser){
            return res.status(409).json({message:"User already exists"})
        }
        // hash  password 
        const HashedPassword = await hashPassword(password)
        // determinate the user role  {fist user is admin}
        const userCount = await prisma.user.count()
        const role = userCount === 0 ? 'ADMIN' : 'VISITOR'
        // create the user 
        const newUser = await prisma.user.create({
            data:{
                email , username , password :hashPassword , role :role
            }
        })
        // generate tokens 
        const {accessToken , refreshToken}= await generateTokenPair({
            userId :newUser.id,
            role:newUser.role,
            email:newUser.email
        })
        // set  accessToken inside cookies 
        res.cookie("accessToken", accessToken,{
            httpOnly:true,
            secure :process.env.NODE_ENV === 'production',
            sameSite :"strict",
            maxAge :15 * 60 * 1000, // 15min 
        })
        // set  accessToken inside cookies 
        res.cookie("refeshToken", refreshToken,{
            httpOnly:true,
            secure :process.env.NODE_ENV === 'production',
            sameSite :"strict",
            maxAge :7*24*60*60*1000 // 7 days
        })
        res.status(201).json({
            msg :"user created successfully",
            user:{
                id :newUser.id,
                email :newUser.email,
                username :newUser.username,
                role :newUser.role
            },
            accessToken ,
        })
    } catch (error) {
        console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
    }
}
const login =async(req,res)=>{
}
const refreshToken =async(req,res)=>{
}
const logout =async(req,res)=>{
}
export {register,login,refreshToken,logout}