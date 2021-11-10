const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const Customer = require('../models/customer_model')
const {customerAuth} = require('../middleware/auth')
const {patchLogic} = require('../services/patch')

const router = express.Router()

const upload = new multer({
    //if destination isnt provided to upload object then the image in request is forwarded to the function which executes for that route.
    // dest : 'pfp',
    limits : { 
        fileSize : 1000000,
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpeg|jpg|png)$/)){
            return cb( new Error('Please upload an Image'))
        }
        cb(undefined , true)
    }
})

router.get('/customers/me' , customerAuth , (req , res) => {
    const customerObject = req.customer.toObject()
    delete customerObject.pfp
    res.send(customerObject)
})

router.post('/customers' , async(req,res) =>{
    const customer = Customer(req.body)
    try{
        await customer.save()
        const token = await customer.generateAuthToken()
        res.status(201).send({customer , token})
    }
    catch(e){
        res.status(400).send(e.toString()) 
    }
}
)

router.post('/customers/me/pfp', customerAuth , upload.single('pfp') , async (req , res) => {
    const buffer = await sharp(req.file.buffer).png().resize({height : 250 , width : 250}).toBuffer()
    req.customer.pfp = buffer
    await req.customer.save()
    res.send()
} , 
//this function runs if there are errors in middle wre function (here file filter)
(error , req , res , next) => {
    res.status(400).send(error.message)
} )

//get my profile picture
router.get('/customers/me/pfp', customerAuth , async (req , res) =>{
        res.set('Content-Type','image/png')
        res.send(req.customer.pfp)
})


router.post('/customers/login' , async (req , res) =>{
    try{
        const customer = await Customer.findCustomer(req.body.email , req.body.password)
        const token = await customer.generateAuthToken()
        res.send({customer , token})

    }catch(e){
        res.status(400).send(e.toString())
    }
})

router.post('/customers/logout' , customerAuth , async(req,res) => {
    try{    
        req.customer.tokens = []
        await req.customer.save()
        res.send()
    }catch(e)
    {
        res.send(e.toString())
    }
})

router.patch('/customers/me' , customerAuth , async (req , res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name" , "email" , "password" , "address" , "favouriteItems"]
    const listAttributes = ['favouriteItems']
    const nestedAttributes = ['address']
    patchLogic(updates, allowedUpdates, listAttributes, nestedAttributes, req)
    if(req["error"]){
        return res.status(400).send(req["error"])
    }
    await req.customer.save()
    return res.send(req.customer) 
})

router.delete('/customers/me' , customerAuth , async(req,res) => {
    try{
        await req.customer.remove()
        res.send(req.customer)
    }
    catch(e){
        res.send(e.toString())
    }
})

module.exports = router