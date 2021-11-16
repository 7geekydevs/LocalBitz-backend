const express = require('express')
const cors = require('cors')

const menuRouter = require('./src/routes/menu_item_routes')
const cookRouter = require('./src/routes/cook_routes')
const customerRouter = require('./src/routes/customer_routes')
const orderRouter = require('./src/routes/order_routes')

require('./src/db/db_connection')

const app = express()

app.use(express.json())
app.use(cors())

app.use(menuRouter)
app.use(cookRouter)
app.use(customerRouter)
app.use(orderRouter)

// //This is for production
module.exports = app
