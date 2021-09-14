const express = require('express')

const router = express.Router()

const MenuItem = require('../models/menu_item_model')

const {cookAuth} = require('../middleware/auth')


router.get('/menu' , async (req, res) =>{
    const items = await MenuItem.find({cook : req.query.cook})  
    res.send(items)
})

router.get('/menu/me' , cookAuth , async (req,res) => {
    await req.cook.populate(
        {
            path : 'menuitems',
        }
    )
    res.send(req.cook.menuitems)
}
)

router.post('/menu' , cookAuth , async (req, res) =>{
    const item = new MenuItem(
    {    
        ...req.body,
        cook : req.cook._id
    }
        )

    try{
        await item.save()
        res.status(201).send(item)
    }catch(e){
        res.status(400).send(e)
    }

})

router.patch('/menu/:id' , cookAuth , async (req, res) =>{

    const allowedUpdates = ['name' , 'price' , 'rating' , 'dietType' , 'ingrediants' , 'reviews']
    const updates = Object.keys(req.body)
    const isOperationValid = updates.every((update) => allowedUpdates.includes(update))
    const listAttributes = ['reviews' , 'ingrediants']

    if(!isOperationValid){
        res.status(400).send({'Error' : 'Invalid Updates'})
    }

    try{
        const item = await MenuItem.findOne({ _id : req.params.id , cook : req.cook._id})
        if(item === null){
            throw new Error('No Menu Item found!')
        }
        updates.forEach((update) => {
            if((listAttributes.includes(update)) && item[update].length > 0){
                req.body[update].map(
                    (review) =>{
                        item[update] = item[update].concat(review)
                    }
                )
            }
            else{
                item[update] = req.body[update]
            }
            
        }
        )
        await item.save()
        return res.send(item)
    }catch(e){
        res.status(404).send(e.toString())
    }
}
)

router.delete('/menu/:id' , cookAuth , async (req, res) =>{
    try{
        const item = await MenuItem.findOne({ _id : req.params.id , cook : req.cook._id})
        if(item === null){
            throw new Error('No Menu Item found!')
        }
        await item.remove()
        res.send(item)
    }catch(e){
        res.status(404).send(e.toString())
    }
})



module.exports = router