import express from "express";
import Task from '../models/Task.js';
import {authMiddleware} from '../middlewares/auth.js';

const router = express.Router();


router.post("/",authMiddleware,async(req,res,next)=>{
      console.log("POST /tasks called with:");

    try{
        const newTask=new Task({...req.body,owner:req.user.id});
            console.log("Task created:");

        await newTask.save();
        res.status(201).json({message:"Task created successfully",task:newTask});
    }catch(err){
            console.error("Error creating task:", err);

        next(err);
    }
})

router.get("/",authMiddleware,async(req,res,next)=>{
      console.log("GET /tasks called"); // Log endpoint hit

    try{
        const tasks=await Task.find({owner:req.user.id});  
        console.log(`Fetched ${tasks.length} tasks`); 
        res.json({tasks});
    }catch(err){
            console.error("Error fetching tasks:", err);

        next(err);
    }
})

router.patch("/:id",authMiddleware,async(req,res,next)=>{
        console.log(`PATCH /tasks/:id called with:`, req.body);
    try{
        const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true});
        console.log("Task updated:");
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        res.json({message:"Task updated successfully",task});
    }catch(err){
        next(err);
    }
})


router.delete("/:id",authMiddleware,async(req,res,next)=>{
        console.log(`DELETE /tasks/:id called`);
    try{
        const task=await Task.findByIdAndDelete(req.params.id);
        console.log("Task deleted:");
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        res.json({message:"Task deleted successfully"});
    }catch(err){
        next(err);
    }
})


export default router;