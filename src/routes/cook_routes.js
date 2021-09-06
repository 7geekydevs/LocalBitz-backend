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
    // const cooks = await Cook.find({})
    res.send(req.cook)
})

//get profile of any cook
router.get('/cooks' , async(req , res) => {
    let query = {}
    let counter = 0
    let newCookList = []
    if(req.query.name){
        query.name = req.query.name
    }
        if(req.query.email){
        query.email = req.query.email
    }
    try{
        const cookList = await Cook.find(query)
        if(cookList.length === 0){
            throw new Error('Cook not found')
        }
        for(counter ; counter < cookList.length ; counter++){
            const newCook =  {
                _id :cookList[counter]._id , 
                name : cookList[counter].name ,
                email : cookList[counter].email,
                address : cookList[counter].address
            }
            newCookList = newCookList.concat(newCook)
        }
        res.send(newCookList)
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
    const allowedUpdates = ['name' , 'email' , 'password' , 'address']
    const isOperationValid = updates.every((update) => allowedUpdates.includes(update))
    if(!isOperationValid){
        res.status(400).send({'Error' : 'Invalid Updates'})
    }
    try{
        // const cook = await Cook.findById(req.params.id)
        updates.forEach(
            (update) =>{
                req.cook[update] = req.body[update]
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