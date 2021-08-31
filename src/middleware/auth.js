const jwt = require('jsonwebtoken')
const Cook = require('../models/cook_model')


const auth = async (req,res,next) => {
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

module.exports = auth