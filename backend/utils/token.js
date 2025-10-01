import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


export function signAccessToken(payload){
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
}
export function verifyToken(token){
  return jwt.verify(token, process.env.JWT_SECRET);
}
// module.exports = { signAccessToken, verifyToken };