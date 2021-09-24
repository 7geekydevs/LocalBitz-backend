const express = require('express')
const Order = require('../models/order_model')
const {customerAuth} = require('../middleware/auth')
const router = express.Router()
const {patchLogic} = require('../services/patch')


router.get('/orders/me' ,customerAuth, async (req,res) => {

   await req.customer.populate(
      {
         path : 'orders'
      }
      )

   res.send(req.customer.orders)    
})

router.post('/orders' , customerAuth ,async (req, res) => {
   const order = Order(req.body)
   try{
      await order.save()
      return res.status(201).send(order)
   }catch(e){
      res.status(400).send(e.toString())
   }
})

router.patch('/orders/:id', customerAuth, async (req, res) => {
   const allowedUpdates = ['status']
   const updates = Object.keys(req.body)
   const listAttributes = []
   const nestedAttributes = []

   const order = await Order.findOne({_id : req.params.id , customer : req.customer._id})
   if(order === null){
      return res.send({"Error" : "Order not found!"})
   }
   req.order = order

   patchLogic(updates, allowedUpdates, listAttributes, nestedAttributes, req)

   if(req["error"]){
      return res.status(400).send(req["error"])
   }

   await req.order.save()
   return res.send(req.order)
})


module.exports = router