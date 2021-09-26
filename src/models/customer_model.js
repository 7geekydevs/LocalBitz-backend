const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Order = require('./order_model')

const customerSchema = mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
            trim : true
        },

        email : {
            type : String,
            required : true,
            trim: true,
            unique : true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error('Invalid Email')
                }
            }
        },

        password : {
            type : String,
            required : true,
            trim : true,
            minlength : 7,
        },

        address : {
            state_UT : {
                type : String,
                trim : true,
                default : ''
            },
            city : {
                type : String,
                trim : true,
                default : ''
            },
            postalCode : {
                type : Number,
                default : 0
            },
            addressLine1 : {
                type : String,
                trim : true,
                default : ''
            },
            addressLine2 : {
                type : String,
                trim : true,
                default : ''
            }
        },

        favouriteItems : [
            {
                menuItemId : mongoose.Schema.Types.ObjectId
            }
        ],

        tokens : [
            {
                token : {
                    type : String,
                    required : true
            }
            }
        ],
    },
    {
        timestamps : true
    }   
)

customerSchema.virtual(
    'orders',
    {
        ref : 'Order',
        localField : '_id',
        foreignField : 'customer'
    }
)

customerSchema.pre('save' , async function(){
    const customer = this
    if(customer.isModified('password')){
        customer.password = await bcrypt.hash(customer.password , 8)
    }
})

customerSchema.pre('remove' , async function(){
    const customer = this
    await Order.deleteMany({customer : customer._id})
})

customerSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()} , process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    user.save()
    return token
}

customerSchema.statics.findCustomer = async (email , password) => {
    const customer = await Customer.findOne({email})
    if(!customer){
        throw new Error('Customer not found')
    }
    const isMatch =  await bcrypt.compare(password , customer.password)
    if(!isMatch){
        throw new Error('Incorrect password')
    }
    return customer
}

const Customer = mongoose.model('Customer' , customerSchema)

module.exports = Customer