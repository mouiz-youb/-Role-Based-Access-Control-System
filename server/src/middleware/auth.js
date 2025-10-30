import {verifyAccessToken } from '../utils/jwt.js'
// authentication with acccess token 
const isAuthenticated = async (req, res, next) => {
    try {
        // get from cookie or authorization header
        const token = req.cookies.accessToken ||
            req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({message: "Unauthorized"})
        }
        // verify token 
        const decoded = await verifyAccessToken(token);
        req.user = decoded
        next();
    } catch (error) {
        if (error.name === "Invalid or expired access token") {
            return res.status(401).json({ message: "Access token expired" });
        }
        return res.status(401).json({ 
            error: 'Invalid access token',
            code: 'INVALID_TOKEN'
        });
    }
}
export default isAuthenticated;