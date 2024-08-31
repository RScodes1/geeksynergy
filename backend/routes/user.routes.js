const express = require('express');
const {UserModel} = require('../model/user.model');
const {auth} = require('../middleware/authmiddleware');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userRoute = express.Router();

userRoute.get('/', async(req, res)=>{
     try {
        const userDetail = await UserModel.find();
         if(!userDetail){
            res.sendFile(path.join(__dirname, '../frontend/register.html'));
         } 
         else 
           res.status(200).json({msg : "sucessful", userDetail});
     } catch (error) {
         console.log(error);
     }
});

userRoute.post('/register', async(req, res)=>{
     const {email, username, password, phone, profession} = req.body;
     try {
         const newUser = await UserModel.findOne({email});
         if(newUser){ 
            res.status(401).json({msg : "user already exists" })
         } else {
             bcrypt.hash(password, 8, async(err, hash)=>{
                if(err){
                    res.status(403).json({msg : "error hashing password"});
                } else if(hash){
                    const saveUser = new UserModel({
                        email,
                        password : hash,
                        username,
                        phone,
                        profession
                    });
                     await new saveUser.save();
                     res.status(200).json({"new user registered" : saveUser})
                }
             })
         }
     } catch (error) {
        res.status(410).json({msg : "error while registering", error});
     }
})

userRoute.post('/login', async(req, res)=>{
    const {email, password} =req.body;
    try {
          const existingUser = await UserModel.findOne({email});
          if(!existingUser){
            res.send({msg: "user doesnt exist"});
          } else{
            bcrypt.compare(password, existingUser.password, (err,result)=> {
                if(result){
                    const token = jwt.sign({userID : existingUser._id}, process.env.JWT_SECRET);
                    res.send({msg: "login successful", token});
                } else if(err){
                    res.send({msg: "wrong credentials", err});
                }
            })
          }
    } catch (error) {
        res.send(error);
    }
});

userRoute.patch('/:id', async(req,res)=>{
    const {id} = req.params
    try {
         await UserModel.findByIdAndUpdate({_id:id}, req.body);
         res.send({"msg" : "updated the user"});
    } catch (err) {
       res.send({"error":err});
    }
});

userRoute.delete('/delete', async (req, res) => {
    const userId = req.user._id;  

    try {
        const existingUser = await UserModel.findByIdAndDelete(userId);
        if (!existingUser) {
            res.status(404).json({ msg: "User not found" });
        } else {
            res.status(200).json({ msg: "User deleted successfully" });
        }
    } catch (error) {
        res.status(500).json({ msg: "Error deleting user", error });
    }
});

module.exports = {
    userRoute
}