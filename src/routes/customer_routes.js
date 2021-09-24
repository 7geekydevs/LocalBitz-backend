const express = require('express')
const Customer = require('../models/customer_model')
const {customerAuth} = require('../middleware/auth')
const {patchLogic} = require('../services/patch')

const router = express.Router()

router.get('/customers/me' , customerAuth , (req , res) => {
    res.send(req.customer)
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