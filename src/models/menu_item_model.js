const mongoose = require('mongoose')

const menuItemSchema = new mongoose.Schema({
    cook : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    
    name : {
        type : String,
        trim : true,
        required : true,
        validate(value){
            if(value.length > 30){
                throw new Error('Name length cannot exceed 30 characters')
            }
        }
    },

    price : {
        type : Number,
        trim : true,
        required : true
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

},
{
    timestamps : true
}
)

const MenuItem = mongoose.model('MenuItem' , menuItemSchema)

module.exports = MenuItem