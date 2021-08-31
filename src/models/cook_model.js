const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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

        tokens : [
            {
                token : {
                    type : String,
                    required : true
            }
            }
        ],
    }
)

cookSchema.pre('save' , async function(){
    const cook = this
    if(cook.isModified('password')){
        cook.password = await bcrypt.hash(cook.password , 8)
    }
})

//function to generate auth token
cookSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()} , process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    user.save()
    return token
}

//function to find user in database
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

//creating cook model
const Cook = mongoose.model('Cook' , cookSchema)

//exporting cook model
module.exports = Cook