import express from 'express';
import bycrypt from 'bcryptjs';
import User from '../models/User.js';
import Task from '../models/Task.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.js';
import { signAccessToken } from '../utils/token.js';
import { body, validationResult } from 'express-validator';


const router=express.Router();

router.post('/register',[
    body('name').isLength({min:2}),
    body('email').isEmail(),
    body('password').isLength({min:6})
    ],async(req,res,next)=>{
        try{
            const errors=validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors:errors.array()});
            }
            // console.log(req.body);
            const{name,email,password,role}=req.body;
            const existingUser=await User.findOne({email});
            if(existingUser){
                return res.status(409).json({ message: 'Email exists' });
            }

            const hashPass=await bycrypt.hash(password,12);
            const newUser=new User({name,email,password:hashPass,role});
            await newUser.save();
            res.status(201).json({message:'User registered successfully'});
        }catch(err){
            next(err);
        }

})

router.patch('/:id', authMiddleware, async (req, res, next) => {
    try {
        const userId = req.params.id;
        // console.log(req.user);
        // console.log(userId);
        if (req.user.id !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (err) { 
        next(err);
    }
});


// login
router.post('/login', [body('email').isEmail(),
    body('password').exists()
    ], async (req, res, next) => {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const {email,password}=req.body;
            const user=await User.findOne({email});
            if(!user){
                return res.status(401).json({message:'Invalid email or password'});
            }

            const isMatch=await bycrypt.compare(password,user.password);
            if(!isMatch){
                return res.status(401).json({message:'Invalid email or password'});
            }

            const token=signAccessToken({id:user._id,role:user.role});
            const cookieOptions={
                httpOnly:true,
                secure:process.env.NODE_ENV==='production' || process.env.COOKIE_SECURE==='true',
                sameSite:'lax',
                maxAge: (process.env.REFRESH_TOKEN_EXPIRES_IN ? parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN) : 7*24*60*60) * 1000
            };
            res.cookie('token',token,cookieOptions);
            res.json({token,message:'Login successful',user:{id:user._id,name:user.name,email:user.email,role:user.role}});

        }catch(err){
            next(err);
        }
})

router.post('/logout',(req,res)=>{
    res.clearCookie('token',{ httpOnly:true, secure:process.env.COOKIE_SECURE==='true' });
    res.json({message:'Logged out successfully'});
})
router.get('/me', authMiddleware, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');  
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    }       
    catch (err) {
        next(err);
    }       
});

export default router;