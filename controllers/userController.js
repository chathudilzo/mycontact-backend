const User=require('../models/userModel');
const bcrypt=require("bcrypt");
const asyncHandler=require('express-async-handler')
const jwt=require("jsonwebtoken");

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
    const {email,password}=req.body;
    if(!email||!password){
        res.status.apply(400);
        throw new Error("All fields are mandatory");
    }
    const user=await User.findOne({email});
    if(user && (await bcrypt.compare(password,user.password))){
        const accessToken=jwt.sign(
            {
            user:{
                username:user.username,
                email:user.email,
                id:user.id
            },   },
            process.env.ACCESS_TOKEN_SECREAT,
            {expiresIn:"45m"}
            );
        res.status(200).json({accessToken});
    }else{
        res.status(401);
        throw new Error("Invalid Credentials!")
    }

})

//@desc get current user
//@route Get api/users/current
//private

const currentUser=asyncHandler(async(req,res)=>{
    res.json(req.user);
})


module.exports={registerUser,loginUser,currentUser}