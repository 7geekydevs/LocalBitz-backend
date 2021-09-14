const express = require('express')

const router = express.Router()

const Cook = require('../models/cook_model')

const {cookAuth} = require('../middleware/auth')

router.get('/cooks/me' , cookAuth , async(req , res) => {
    res.send(req.cook)
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
            else if(update === 'address' || update === 'openHours'){
                const parent = update
                const updates = Object.keys(req.body[update])
                const allowedUpdates = ['state_UT' , 'city' , 'postalCode' , 'addressLine1' , 'addressLine2' , 'open' , 'close']
                const isOperationValid = updates.every(
                    (update) => allowedUpdates.includes(update)    
                )
                if(!isOperationValid){
                    return res.status(400).send({'Error' : 'Invalid Updates'})
                }
                try{
                    req.cook[parent] = {...req.cook[parent] , ...req.body[update]}
                    
                }catch(e){
                    console.log('error in address/openhours update')
                }

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