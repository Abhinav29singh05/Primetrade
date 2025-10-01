import express from "express";
import Task from '../models/Task.js';
import {authMiddleware} from '../middlewares/auth.js';

const router = express.Router();


router.post("/",authMiddleware,async(req,res,next)=>{
    try{
        const newTask=new Task({...req.body,owner:req.user.id});
        await newTask.save();
        res.status(201).json({message:"Task created successfully",task:newTask});
    }catch(err){
        next(err);
    }
})

router.get("/",authMiddleware,async(req,res,next)=>{
    try{
        const tasks=await Task.find({owner:req.user.id});   
        res.json({tasks});
    }catch(err){
        next(err);
    }
})

router.patch("/:id",authMiddleware,async(req,res,next)=>{
    try{
        const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        res.json({message:"Task updated successfully",task});
    }catch(err){
        next(err);
    }
})


router.delete("/:id",authMiddleware,async(req,res,next)=>{
    try{
        const task=await Task.findByIdAndDelete(req.params.id);
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        res.json({message:"Task deleted successfully"});
    }catch(err){
        next(err);
    }
})


export default router;