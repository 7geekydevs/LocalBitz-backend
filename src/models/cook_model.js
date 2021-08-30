const mongoose = require('mongoose')
const validator = require('validator')

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
        }

    }
)

const Cook = mongoose.model('Cook' , cookSchema)

module.exports = Cook