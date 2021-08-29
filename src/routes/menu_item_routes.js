//packages
const express = require('express')

//router
const router = express.Router()

//models
const menuItemModel = require('../models/menu_item_model')

router.get('/menu' , (req, res) =>{
    res.send('get menu endpoint')
})

router.post('/menu' , async (req, res) =>{

    const menuItem = new menuItemModel(req.body)

    try{
        await menuItem.save()
        res.status(201).send(menuItem)
    }catch(e){
        res.status(400).send(e)
    }

})

router.patch('/menu' , (req, res) =>{
    res.send(req.body)
})

router.delete('/menu' , (req, res) =>{
    res.send('delete menu endpoint')
})



module.exports = router