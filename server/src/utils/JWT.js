import jwt from'jsonwebtoken';
import crypto from'crypto';
import prisma from "../utils/db.js"
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';
// Generate Access Token
// The payload usually contains: { userId, email, role }
export const generateAccessToken =(payload)=>{
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}
// Generate Refresh Token
export const generateRefreshToken=async(userId)=>{
    // generate a random token string
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const expiryDate = new Date();
    // calculate the expiry date
    expiryDate.setDate(expiryDate.getDate() + 7); // 7 days expiry
    // storing hte refresh token inside daata base 
    await prisma.refreshToken.create({
        data:{
            token: refreshToken,
            userId: userId,
            expiresAt: expiryDate
        }
    })
    return refreshToken;
}
// generate both tokens Used during login or signup
const generateTokenPair = async (payload) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload.userId);
  return { accessToken, refreshToken };
};
// verufy Access Token
const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (error) {
         throw new Error('Invalid or expired access token');
    }
}
// verify Refresh Token
const verifyRefreshToken = async (token) => {
    const refreshTokenRecord = await prisma.refreshToken.findUnique({
        where:{token}, 
        include:{user:true}
    })
    // check if the token exists in the database
    if (!refreshTokenRecord) {
        throw new Error('Invalid refresh token');
    }
    // check if the token has expired
    if(refreshTokenRecord.expiresAt <new Date()){
        await prisma.refreshToken.delete({
            where:{id : refreshTokenRecord.id}
        })
        throw new Error('Refresh token has expired');
    }
    // check if the still active 
    if(!refreshTokenRecord.user.isActive){
        throw new Error('User account is deactivated');
    }
    return {
        userId:refreshTokenRecord.userId,
        email:refreshTokenRecord.user.email,
        role:refreshTokenRecord.user.role
    }
}
module.exports={
    generateAccessToken,
    generateRefreshToken,
    generateTokenPair,
    verifyAccessToken,
    verifyRefreshToken
}