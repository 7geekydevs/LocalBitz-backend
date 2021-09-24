const mongoose = require('mongoose')

const orderSchema = mongoose.Schema(
    {
        customer : {
            type : mongoose.Schema.Types.ObjectId,
            required : true
        },

        cook : {
            type : mongoose.Schema.Types.ObjectId,
            required : true
        },

        status : {
            type : String,
            enum : ['ONGOING', 'COMPLETED', "CANCELLED"],
            trim : true,
            default : 'ONGOING'
        },

        menuItems : [
            {
                menuItem : {
                    id : {
                        type : mongoose.Schema.Types.ObjectId,
                    },

                    quantity : {
                        type : Number
                    },
                            }
            }
        ],

        bill : {
            type : Number
        }
    },
    {
        timestamps : true
    }
)

const Order = mongoose.model('Order' , orderSchema)

module.exports = Order