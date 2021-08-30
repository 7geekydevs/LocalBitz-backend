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

router.patch('/cooks' , async(req,res)=>{
    res.send('patch cooks')
})

router.delete('/cooks' , async(req,res)=>{
    res.send('delete cooks')
})

module.exports = router