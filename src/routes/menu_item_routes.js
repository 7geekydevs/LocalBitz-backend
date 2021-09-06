//packages
const express = require('express')

//router
const router = express.Router()

//models
const MenuItem = require('../models/menu_item_model')

//middleware
const auth = require('../middleware/auth')

//---------------------------------------------------------------------------------------------------------

//get all menu items for a particular cook
router.get('/menu' , async (req, res) =>{
    const items = await MenuItem.find({cook : req.query.cook})
    res.send(items)
})

//get current user menu items
router.get('/menu/me' , auth , async (req,res) => {
    await req.cook.populate(
        {
            path : 'menuitems',
        }
    )
    res.send(req.cook.menuitems)
}
)

//post menu
router.post('/menu' , auth , async (req, res) =>{
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

//update menu item
router.patch('/menu/:id' , auth , async (req, res) =>{

    const allowedUpdates = ['name' , 'price' , 'rating' , 'dietType' , 'ingrediants' , 'reviews']
    const updates = Object.keys(req.body)
    const isOperationValid = updates.every((update) => allowedUpdates.includes(update))

    if(!isOperationValid){
        res.status(400).send({'Error' : 'Invalid Updates'})
    }

    try{
        const item = await MenuItem.findOne({ _id : req.params.id , cook : req.cook._id})
        if(item === null){
            throw new Error('No Menu Item found!')
        }
        updates.forEach((update) => {
            if((update === 'reviews' || update === 'ingrediants') && item[update].length > 0){
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

//delete menu item
router.delete('/menu/:id' , auth , async (req, res) =>{
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

//---------------------------------------------------------------------------------------------------------


module.exports = router