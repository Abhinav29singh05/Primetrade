import express from 'express';
import User from '../models/User.js';
import Task from '../models/Task.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.js';

const router=express.Router();


// admin-get all users with their tasks
router.get('/users', authMiddleware, adminMiddleware,async(req,res,next)=>{
        console.log("GET /users called");
    try{
        const users=await User.find().select('-password');
            console.log(`Fetched ${users.length} users`);
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
        console.log(`DELETE /users/${req.params.id} called`);
    try{
        const userId=req.params.id;
        console.log(userId);
        const user=await User.findByIdAndDelete(userId);   

        await Task.deleteMany({user:userId});
        console.log("User and associated tasks deleted successfully");
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        res.json({message:'User and associated tasks deleted successfully'});
    }catch(err){
        next(err);
    }
})

router.patch("/makeAdmin/:id", async (req, res) => {
    console.log(`PATCH /makeAdmin/:id called`);
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: "admin" },
      { new: true }
    );
        console.log("User role updated to admin");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User promoted to admin", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update role" });
  }
});

export default router;