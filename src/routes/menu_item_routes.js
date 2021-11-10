const express = require('express')
const multer = require('multer')
const sharp = require('sharp')

const router = express.Router()

const MenuItem = require('../models/menu_item_model')

const {cookAuth} = require('../middleware/auth')

const {patchLogic} = require('../services/patch')

const upload = new multer({
    //if destination isnt provided to upload object then the image in request is forwarded to the function which executes for that route.
    // dest : 'photo',
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

router.get('/menu' , async (req, res) =>{
    const items = await MenuItem.find({cook : req.query.cook} , {photo : 0})  
    res.send(items)
})

router.get('/menu/me' , cookAuth , async (req,res) => {
    await req.cook.populate(
        {
            path : 'menuitems',
        }
    )
    res.send(req.cook.menuitems)
}
)

router.post('/menu' , cookAuth , async (req, res) =>{
    const item = new MenuItem(
    {    
        ...req.body,
        cook : req.cook._id
    }
        )

    try{
        await item.save()
        res.status(201).send(item)
    }catch(e){
        res.status(400).send(e)
    }

})

router.post('/menu/:id/photo', cookAuth , upload.single('photo') , async (req , res) => {
    const buffer = await sharp(req.file.buffer).png().resize({height : 250 , width : 250}).toBuffer()
    const item = await MenuItem.findOne({ _id : req.params.id , cook : req.cook._id})
    if(item === null){
        return res.send({"Error" : "Menu Item not found!"})
    }
    item.photo = buffer
    await item.save()
    res.send()
} , 
//this function runs if there are errors in middle ware function (here file filter)
(error , req , res , next) => {
    res.status(400).send(error.message)
} )

//get profile picture
router.get('/menu/:id/photo' , async (req , res) =>{
    try{
        const item = await MenuItem.findById(req.params.id)
        if(!item || !item.photo){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(item.photo)
    }
    catch(e){
        res.status(404).send()
    }
})


router.patch('/menu/:id' , cookAuth , async (req, res) =>{

    const allowedUpdates = ['name' , 'price' , 'rating' , 'dietType' , 'ingrediants' , 'reviews']
    const listAttributes = ['reviews' , 'ingrediants']
    const nestedAttributes = []
    const updates = Object.keys(req.body)
    const item = await MenuItem.findOne({ _id : req.params.id , cook : req.cook._id})
    if(item === null){
        return res.send({"Error" : "Menu Item not found!"})
    }
    req.item = item
    patchLogic(updates, allowedUpdates, listAttributes, nestedAttributes, req)
    
    if(req["error"]){
        return res.status(400).send(req["error"])
    }
    await req.item.save()
    return res.send(req.item) 
}
)

router.delete('/menu/:id' , cookAuth , async (req, res) =>{
    try{
        const item = await MenuItem.findOne({ _id : req.params.id , cook : req.cook._id})
        if(item === null){
            throw new Error('No Menu Item found!')
        }
        await item.remove()
        res.send(item)
    }catch(e){
        res.status(404).send(e.toString())
    }
})



module.exports = router