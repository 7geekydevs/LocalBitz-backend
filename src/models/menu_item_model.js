const mongoose = require('mongoose')

const menuItemSchema = new mongoose.Schema({
    cookId : {
        // type : mongoose.Schema.Types.ObjectId,
        type : String,
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
            if(value > 5){
                throw new Error('Rating annot exceed 5')
            }
        }
    },

}
)

const MenuItem = mongoose.model('MenuItem' , menuItemSchema)

module.exports = MenuItem