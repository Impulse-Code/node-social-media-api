import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import _ from 'lodash';


const router =express.Router();

// update user
router.put('/:id',async (req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
         if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt);
            }
            catch(err){
                return res.status(500).json(err);
            }
         }
         try{
            const user = await User.findByIdAndUpdate(req.params.id,{$set:req.body,});
            res.status(200).json('Account has been updated successfully');
         }
         catch(err){
            return res.status(500).json(err);
         }

    } else{
        return res.status(403).json('You can update only your account');
    }
   
});

// delete a user
router.delete('/:id',async(req,res) =>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json(`Account of user ${user.username} has been deleted `);
           }
           catch(err){
               return res.status(500).json(err);
           }
    }else{
        return res.status(403).json('You can only delete your account');
    }
});

// get a user
router.get('/:id',async (req,res) =>{
    try{
        const user = await User.findById(req.params.id);
        // const {password,updatedAt,...others} = user._doc;
        // res.status(200).json(others);

        res.status(200).json(_.pick(user,['isAdmin','username','email',
            'followers','followings','_id',
            'profilePicture','coverPicture']));
    }
    catch(err){
        res.json(err);

    }
});

// follow a user
router.put("/:id/follow",async (req,res) =>{
    if (req.body.userId !== req.params.id){
       try{
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if(!user.followers.includes(req.body.userId)){
            await user.updateOne({$push:{followers:req.body.userId}});
            await user.updateOne({$push:{followings:req.params.id}});
            res.status(200).json(`you have started following ${user.username}`);
         } else{
            res.status(403).json('You already follow this user');
        }
    }catch(err){
        res.status(500).json(err);
    }
   }else{
    res.status(403).json('You can not follow yourself')
   } 
});

// unfollow a user
router.put("/:id/follow",async (req,res) =>{
    if (req.body.userId == req.params.id){
       try{
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if(user.followers.includes(req.body.userId)){
            await user.updateOne({$pull:{followers:req.body.userId}});
            await user.updateOne({$push:{followings:req.params.id}});
            res.status(200).json(`you have unfollowed ${user.username}`);
         } else{
            res.status(403).json(`You do not follow ${user.username}`);
        }
    }catch(err){
        res.status(500).json(err);
    }
   }else{
    res.status(403).json('You can not unfollow yourself')
   } 
});

export default router;
