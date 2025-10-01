import express from 'express';
import User from '../models/User.js';
import Task from '../models/Task.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.js';

const router=express.Router();


// admin-get all users with their tasks
router.get('/users', authMiddleware, adminMiddleware,async(req,res,next)=>{
    try{
        const users=await User.find().select('-password');
        const userWithTasks=await Promise.all(
            users.map(async(u)=>{
                const tasks = await Task.find({owner: u._id});
                return{...u.toObject(), tasks};
            })
        )
        res.json({users:userWithTasks});
    }catch(err){
        next(err);
    }
})


// admin-delete a user
router.delete('/deleteUser/:id', authMiddleware, adminMiddleware,async(req,res,next)=>{
    try{
        const userId=req.params.id;
        const user=await User.findByIdAndDelete(userId);    
        await Task.deleteMany({user:userId});
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        res.json({message:'User and associated tasks deleted successfully'});
    }catch(err){
        next(err);
    }
})

router.patch("/makeAdmin/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: "admin" },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User promoted to admin", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update role" });
  }
});

export default router;