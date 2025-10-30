import bycrypt from 'bcryptjs';
const saltRounds = 10;
// hash password function  
const hashPassword = async (password) => {
    const hashedPassword = await bycrypt.hash(password, saltRounds);
    return hashedPassword;
}
// compare password function 
const comparePassword = async (password, hashedPassword) =>{
    return await bycrypt.compare(password, hashedPassword)
}
export {hashPassword,comparePassword};