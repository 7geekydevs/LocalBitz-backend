//packages
const express = require('express')

//router
const router = express.Router()

//models
const Cook = require('../models/cook_model')

//middleware
const auth = require('../middleware/auth')

//get my profile
router.get('/cooks/me' , auth , async(req , res) => {
    res.send(req.cook)
})

//get profile of any cook
router.get('/cooks' , async(req , res) => {

    // let query = new Map()
    let query = {}


    //populating query object
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
        const cookList = await Cook.find( query , {tokens : 0 , password : 0})
        if(cookList.length === 0){
            throw new Error('Cook not found')
        }
        res.send(cookList)
    }catch(e){
        res.status(400).send(e.toString())
    }
}
)

//sign up cook
router.post('/cooks' , async(req,res)=>{
    const cook = new Cook(req.body)
    try{
        await cook.save()
        const token = await cook.generateAuthToken()
        res.status(201).send({cook , token})
    }catch(e){
        res.status(400).send(e)
    }
})

//login cook
router.post('/cooks/login' , async (req , res) => {
    try{
        const cook = await Cook.findCook(req.body.email , req.body.password)
        const token = await cook.generateAuthToken()
        res.send({cook , token})
    }
    catch(e){
        res.status(400).send(e.toString())
    }
})

//update cook
router.patch('/cooks/me' , auth , async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name' , 'email' , 'password' , 'address' , 'reviews' , "rating" , "openHours"]
    const isOperationValid = updates.every((update) => allowedUpdates.includes(update))
    if(!isOperationValid){
        res.status(400).send({'Error' : 'Invalid Updates'})
    }
    try{
        updates.forEach((update) => {
            if(update === 'reviews' && req.cook[update].length > 0){
                req.body[update].map(
                    (review) =>{
                        req.cook[update] = req.cook[update].concat(review)
                    }
                )
            }
            else{
                req.cook[update] = req.body[update]
            }
            
        }
        )
        await req.cook.save()
        return res.send(req.cook)
        }catch(e){
            res.status(500).send(e.toString())
        }
    
})

//delete cook
router.delete('/cooks/me' , auth ,async(req,res)=>{
    try{
        // await Cook.findByIdAndDelete(req.params.id)
        await req.cook.remove()
        res.send(req.cook)
    }
    catch(e){
        res.send(e.toString())
    }
})

//export router
module.exports = router