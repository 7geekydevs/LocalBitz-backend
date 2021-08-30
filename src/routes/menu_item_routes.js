//packages
const express = require('express')

//router
const router = express.Router()

//models
const MenuItem = require('../models/menu_item_model')

router.get('/menu' , async (req, res) =>{
    const items = await MenuItem.find({})
    res.send(items)
})

router.post('/menu' , async (req, res) =>{

    const item = new MenuItem(req.body)

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

    if(!isOperationValid){
        res.status(400).send({'Error' : 'Invalid Updates'})
    }

    try{
        const item = await MenuItem.findById(req.params.id)
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
        await MenuItem.findByIdAndDelete(req.params.id)
        res.send()
    }catch(e){
        res.status(400).send(e)
    }
})



module.exports = router