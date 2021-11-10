const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const MenuItem = require('./menu_item_model')

const cookSchema = mongoose.Schema(
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

        reviews : [
        {
            review : {
                type : String
            }
        }
        ],

        openHours : {
            open : {
                type : Number,
            },
            close : {
                type : Number,
            }
        },

        rating : {
            type : Number,
            trim : true,
            validate(value){
                if(value > 5 || value < 1){
                    throw new Error('Invalid Rating value Entered . Valid values : 1,2,3,4,5')
                }
            }
        },

        tokens : [
            {
                token : {
                    type : String,
                    required : true
            }
            }
        ],

        pfp : {
            type : Buffer
        }
    },
    {
        timestamps : true
    }
)


cookSchema.virtual(
    'menuitems' , 
    {
        ref : 'MenuItem',
        localField : '_id',
        foreignField : 'cook'
    }
)


cookSchema.pre('save' , async function(){
    const cook = this
    if(cook.isModified('password')){
        cook.password = await bcrypt.hash(cook.password , 8)
    }
})

cookSchema.pre('remove' , async function(){
    const cook = this
    await MenuItem.deleteMany({cook : cook._id})
})


cookSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()} , process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    user.save()
    return token
}


cookSchema.statics.findCook = async (email , password) => {
    const cook = await Cook.findOne({email})
    if(!cook){
        throw new Error('Cook not found')
    }
    const isMatch =  await bcrypt.compare(password , cook.password)
    if(!isMatch){
        throw new Error('Incorrect password')
    }
    return cook
}


const Cook = mongoose.model('Cook' , cookSchema)

module.exports = Cook