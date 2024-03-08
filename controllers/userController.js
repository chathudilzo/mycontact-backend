const User=require('../models/userModel');
const bcrypt=require("bcrypt");
const asyncHandler=require('express-async-handler')

//@desc regitser user
//@route Post api/users/register
//access publid


const registerUser=asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body;
    if(!username||!email||!password){
        res.status(400);
        throw new Error("All fields are mandatory")
    }
    const userExists=await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error("Email already exists");
    }
    //hash
    const hashedPassword=await bcrypt.hash(password,10);
    console.log(hashedPassword);

    const user=await User.create({
        username,
        email,
        password:hashedPassword
    });

    console.log(`User created with ${user}`);
    if(user){
        res.status(201).json({_id:user.id,email:user.email});
    }else{
        res.status(400);
        throw new Error("Userdata is not valid");
    }
    
});

//@desc login user
//@route Post api/users/login
//public
const loginUser=asyncHandler(async(req,res)=>{
    res.json({message:"Login User"});
})

//@desc get current user
//@route Get api/users/current
//private

const currentUser=asyncHandler(async(req,res)=>{
    res.json({message:"Current loged in user"})
})


module.exports={registerUser,loginUser,currentUser}