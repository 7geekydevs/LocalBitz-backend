//packages
const express = require('express')

//router
const router = express.Router()

//models
const menuItemModel = require('../models/menu_item_model')

router.get('/menu' , async (req, res) =>{
    const menuitems = await menuItemModel.find({})
    res.send(menuitems)
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


router.patch('/menu/:id' , async (req, res) =>{

    const allowedUpdates = ['name' , 'price' , 'rating']
    const updates = Object.keys(req.body)

    const isOperationValid = updates.every((update) => allowedUpdates.includes(update))

    // await menuItemModel.findByIdAndUpdate(req.params.id , req.body)
    // const menuItem = await menuItemModel.findById(req.params.id)

    if(!isOperationValid){
        res.status(400).send({'Error' : 'Invalid Updates'})
    }

    try{
        const item = await menuItemModel.findById(req.params.id)
        updates.forEach((update) => {
            item[update] = req.body[update]
        }
        )
        await item.save()
        return res.send(item)
    }catch(e){
        res.status(500).send(e)
    }

})

router.delete('/menu/:id' , async (req, res) =>{
    try{
        await menuItemModel.findByIdAndDelete(req.params.id)
        res.send()
    }catch(e){
        res.status(400).send(e)
    }
})



module.exports = router