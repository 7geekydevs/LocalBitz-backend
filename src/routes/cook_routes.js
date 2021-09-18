const express = require('express')

const router = express.Router()

const Cook = require('../models/cook_model')

const {cookAuth} = require('../middleware/auth')

const {patchLogic} = require('../services/patch')

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