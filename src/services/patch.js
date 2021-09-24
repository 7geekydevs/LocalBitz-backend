const chalk = require("chalk")
const patchLogic = (updates, allowedUpdates, listAttributes, nestedAttributes, req, parent = undefined) => {
    let model;
    if(req.cook && req.item){
        model = req.item
    }
    else if(req.customer && req.order){
        model = req.order
    }
    else if(req.cook){
        model = req.cook
    }
    else if(req.customer){
        model = req.customer
    }
    const isOperationValid = updates.every((update) => allowedUpdates.includes(update))
    if(!isOperationValid){
        req["error"] = {"Error" : "operation isnt valid"}
    }
    else{
        try{
            updates.forEach((update) => {
                if(listAttributes.includes(update) && model[update].length > 0){
                    req.body[update].map(
                        (review) =>{
                            model[update] = model[update].concat(review)
                        }
                    )
                }
                else if(nestedAttributes.includes(update)){
                    const updates = Object.keys(req.body[update])
                    const allowedUpdates = ['state_UT' , 'city' , 'postalCode' , 'addressLine1' , 'addressLine2' , 'open' , 'close']
                    patchLogic(updates, allowedUpdates, listAttributes, nestedAttributes, req , update)
                }
                else{
                    if(parent){
                        model[parent] = {...model[parent] , ...req.body[parent]}
                    }
                    else{
                            model[update] = req.body[update]  
                    }
                }  
            }
            )
            }catch(e){
                req["error"] = {"Error" : `${e.toString()}`}
            }
    }
}

module.exports = {patchLogic}