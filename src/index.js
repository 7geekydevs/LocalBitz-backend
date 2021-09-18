
const express = require('express')


const menuRouter = require('./routes/menu_item_routes')
const cookRouter = require('./routes/cook_routes')
const customerRouter = require('./routes/customer_routes')


require('./db/db_connection')

const app = express()

app.use(express.json())

app.use(menuRouter)
app.use(cookRouter)
app.use(customerRouter)

const port = process.env.PORT

app.listen(port , () => {
    console.log('server up on ' + port)
})
