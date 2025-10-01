import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();    

export const authMiddleware=(req,res,next)=>{
    // console.log(req.headers);
    // console.log(req.headers.authorization);
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message:'No token provided'});
    }
    // console.log("head",authHeader);
    const token=authHeader.split(' ')[1];
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET); 
        req.user=decoded;
        next();
    }catch(err){    
        return res.status(401).json({message:'Invalid token'});
    }
}

export const adminMiddleware=(req,res,next)=>{
    if(req.user.role !=='admin'){
        return res.status(403).json({message:'Access denied - Admins only'});
    }
    next();
}

