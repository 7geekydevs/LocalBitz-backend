const express = require('express')
const multer = require('multer')
const sharp = require('sharp')

const router = express.Router()

const Cook = require('../models/cook_model')

const {cookAuth} = require('../middleware/auth')

const {patchLogic} = require('../services/patch')

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

router.get('/cooks/me' , cookAuth , async(req , res) => {
    const cookObject = req.cook.toObject()
    delete cookObject.pfp
    res.send(cookObject)
})

router.get('/cooks' , async(req , res) => {

    let query = {}

    if(req.query.name){
        query.name = req.query.name
    }
    if(req.query.email){
        query.email = req.query.email
    }
    if(req.query.rating){
        query.rating = req.query.rating
    }
    if(req.query.open){
        query['openHours.open']= req.query.open
    }
    if(req.query.close){
        query['openHours.close'] = req.query.close
    }
    if(req.query.state_UT){
        query['address.state_UT'] = req.query.state_UT
    }
    if(req.query.city){
        query['address.city'] = req.query.city
    }
    if(req.query.postalCode){
        query['address.postalCode'] = req.query.postalCode
    }

    try{
        const cookList = await Cook.find( query , {tokens : 0 , password : 0 , pfp : 0})
        if(cookList.length === 0){
            throw new Error('Cook not found')
        }
        res.send(cookList)
    }catch(e){
        res.status(400).send(e.toString())
    }
}
)

router.post('/cooks' , async(req,res)=>{
    const cook = new Cook(req.body)
    try{
        await cook.save()
        const token = await cook.generateAuthToken()
        res.status(201).send({cook , token})
    }catch(e){
        res.status(400).send(e.toString())
}
})

router.post('/cooks/me/pfp', cookAuth , upload.single('pfp') , async (req , res) => {
    const buffer = await sharp(req.file.buffer).png().resize({height : 250 , width : 250}).toBuffer()
    req.cook.pfp = buffer
    await req.cook.save()
    res.send()
} , 
//this function runs if there are errors in middle wre function (here file filter)
(error , req , res , next) => {
    res.status(400).send(error.message)
} )

//get profile picture
router.get('/cooks/:id/pfp' , async (req , res) =>{
    try{
        const cook = await Cook.findById(req.params.id)
        if(!cook || !cook.pfp){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(cook.pfp)
    }
    catch(e){
        res.status(404).send()
    }
})

router.post('/cooks/login' , async (req , res) => {
    try{
        const cook = await Cook.findCook(req.body.email , req.body.password)
        const cookObject = cook.toObject()
        delete cookObject.pfp
        const token = await cook.generateAuthToken()
        res.send({cookObject , token})
    }
    catch(e){
        res.status(400).send(e.toString())
    }
})

router.post('/cooks/logout' , cookAuth , async(req,res) => {
    try{    
        req.cook.tokens = []
        await req.cook.save()
        res.send()
    }catch(e)
    {
        res.send(e.toString())
    }
})

router.patch('/cooks/me' , cookAuth , async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name' , 'email' , 'password' , 'address' , 'reviews' , "rating" , "openHours"]
    const listAttributes = ['reviews']
    const nestedAttributes = ['address' , 'openHours']
    patchLogic(updates, allowedUpdates, listAttributes, nestedAttributes, req)
    if(req["error"]){
        return res.status(400).send(req["error"])
    }
    await req.cook.save()
    return res.send(req.cook)  
})

router.delete('/cooks/me' , cookAuth ,async(req,res)=>{
    try{
        await req.cook.remove()
        res.send(req.cook)
    }
    catch(e){
        res.send(e.toString())
    }
})

module.exports = router