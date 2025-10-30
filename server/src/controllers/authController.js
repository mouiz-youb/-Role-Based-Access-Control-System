import prisma from '../lib/prismaClient.js';
import { hashPassword, comparePassword, validatePassword } from '../utils/HashPassword.js';
import {generateTokenPair,verifyRefreshToken,revokeRefreshToken,revokeAllUserTokens} from  "../utils/JWT.js"
const register =async(req,res)=>{
}
const login =async(req,res)=>{
}
const refreshToken =async(req,res)=>{
}
const logout =async(req,res)=>{
}
export {register,login,refreshToken,logout}