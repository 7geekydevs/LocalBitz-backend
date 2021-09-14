const express = require('express')
const Customer = require('../models/customer_model')
const {customerAuth} = require('../middleware/auth')

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
    const allowedUpdates = ['email' , 'name', 'password' , 'address' , 'favouriteItems']
    const updates = Object.keys(req.body)
    const isOperationValid = updates.every(
        (update) => allowedUpdates.includes(update)
    )
    if(!isOperationValid){
        return res.status(400).send({'Error' : 'Invalid Updates'})
    }

    try{
        updates.forEach((update) => {
            if(update === 'favouriteItems' && req.customer[update].length > 0){
                req.body[update].map(
                    (favouriteItem) =>{
                        req.customer[update] = req.customer[update].concat(favouriteItem)
                    }
                )
            }
            if(update === 'address'){
                const parent = update
                const updates = Object.keys(req.body[update])
                const allowedUpdates = ['state_UT' , 'city' , 'postalCode' , 'addressLine1' , 'addressLine2']
                const isOperationValid = updates.every(
                    (update) => allowedUpdates.includes(update)    
                )
                if(!isOperationValid){
                    return res.status(400).send({'Error' : 'Invalid Updates'})
                }
                try{
                    req.customer[parent] = {...req.customer[parent] , ...req.body[update]}
                    
                }catch(e){
                    console.log('error in address update')
                }

            }
            else{
                req.customer[update] = req.body[update]
            }
            
        }
        )
        await req.customer.save()
        return res.send(req.customer)
        }catch(e){
            res.status(500).send(e.toString())
        }

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