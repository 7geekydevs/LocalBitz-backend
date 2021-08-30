//packages
const express = require('express')

//router
const router = express.Router()

//models
const Cook = require('../models/cook_model')

router.get('/cooks' , async(req , res) => {
    const cooks = await Cook.find({})
    res.send(cooks)
})

router.post('/cooks' , async(req,res)=>{
    const cook = new Cook(req.body)
    try{
        await cook.save()
        res.status(201).send(cook)
    }catch(e){
        res.status(400).send(e)
    }
})

router.patch('/cooks/:id' , async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name' , 'email' , 'password']
    const isOperationValid = updates.every((update) => allowedUpdates.includes(update))
    if(!isOperationValid){
        res.status(400).send({'Error' : 'Invalid Updates'})
    }
    try{
        const cook = await Cook.findById(req.params.id)
        updates.forEach(
            (update) =>{
                cook[update] = req.body[update]
            }
        )
        await cook.save()
        return res.send(cook)
        }catch(e){
            res.status(500).send(e)
        }
    
})

router.delete('/cooks/:id' , async(req,res)=>{
    try{
        await Cook.findByIdAndDelete(req.params.id)
        res.send()
    }
    catch(e){
        res.send(e)
    }
})

module.exports = router