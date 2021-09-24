const express = require('express')
const Order = require('../models/order_model')
const {customerAuth} = require('../middleware/auth')

const router = express.Router()

//orders/me
//orders post
//orders:/id patch
//orders/:id delete


//in future
//orders/:id get particular order

 router.get('/orders/me' ,customerAuth, (req,res) => {

    // await req.customer.populate(
    //     {
    //         path : 'orders'
    //     }
    //     )

    // res.send(req.customer.orders)    
    res.send('my orders')
 })

module.exports = router