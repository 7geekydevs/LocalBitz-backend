
const express = require('express')


const menuRouter = require('./src/routes/menu_item_routes')
const cookRouter = require('./src/routes/cook_routes')
const customerRouter = require('./src/routes/customer_routes')
const orderRouter = require('./src/routes/order_routes')


require('./src/db/db_connection')

const app = express()

app.use(express.json())

app.use(menuRouter)
app.use(cookRouter)
app.use(customerRouter)
app.use(orderRouter)

// const port = process.env.PORT

// app.listen(port , () => {
//     console.log('server up on ' + port)
// })

module.exports = app
