//packages
const express = require('express')

//router
const router = express.Router()

//models
const menuItem = require('../models/menu_item_model')

router.get('/menu' , async (req, res) =>{
    const items = await menuItem.find({})
    res.send(items)
})

router.post('/menu' , async (req, res) =>{

    const item = new menuItem(req.body)

    try{
        await item.save()
        res.status(201).send(item)
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
        const item = await menuItem.findById(req.params.id)
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
        await menuItem.findByIdAndDelete(req.params.id)
        res.send()
    }catch(e){
        res.status(400).send(e)
    }
})



module.exports = router