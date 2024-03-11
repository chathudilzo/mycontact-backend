const asyncHandler=require('express-async-handler');
const Contact=require('../models/contactModel');



//@decs Get all contacts
//@route Get /api/contacts
//@access private
const getContacts=asyncHandler(async (req,res)=>{
    const contacts=await Contact.find({user_id:req.user.id});
    res.status(200).json(contacts);
})

//@decs Get a contact
//@route Get /api/contacts/:id
//@access private
const getContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(contact)
})

//@decs Create a contact
//@route Post /api/contacts
//@access private
const createContact=asyncHandler(async(req,res)=>{
    console.log('Requist body is',req.body);
    const {name,email,phone}=req.body;
    if(!name||!email||!phone){
        res.status(400);
        throw new Error("Please add all fields");
    }
    const contact=await Contact.create({
        name,
        email,
        phone,
        user_id:req.user.id
    })
    res.status(201).json(contact)
})

//@decs Update a contact
//@route Put /api/contact/:id
//@access private
const updateContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString()!==req.user.id){
        res.status(400);
        throw new Error("User dont have permission to update other user contact")
    }

    const updatedContact=await Contact.findByIdAndUpdate(
        req.params.id,req.body,{new:true}
        );

    res.status(200).json(updatedContact);
})

//@decs Delete a contact
//@route Delete /api/contact/:id
//@access public
const deleteContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    if(contact.user_id.toString()!==req.user.id){
        res.status(400);
        throw new Error("User dont have permission to delete other user contact")
    }
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json(contact);
})


module.exports={getContacts,getContact,createContact,updateContact,deleteContact};
