const jwt = require('jsonwebtoken')
const Cook = require('../models/cook_model')
const Customer = require('../models/customer_model')

const cookAuth = async (req,res,next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ' , '')
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        const cook = await Cook.findOne({_id : decoded._id , 'tokens.token' : token})
        if(!cook){
            throw new Error('Cook not found')
        }
        req.token = token
        req.cook = cook
        next()
    }catch(e){
        res.status(401).send({error : 'Please authenticate'})
    }
}

const customerAuth = async (req,res,next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ' , '')
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        const customer = await Customer.findOne({_id : decoded._id , 'tokens.token' : token})
        if(!customer){
            throw new Error('Customer not found')
        }
        req.token = token
        req.customer = customer
        next()
    }catch(e){
        res.status(401).send({error : 'Please authenticate'})
    }
}

module.exports = {customerAuth , cookAuth}