const express = require('express')

const menuRouter = require('./routes/menu_item_routes')

const app = express()

app.use(menuRouter)

const port = process.env.PORT || 3000

app.listen(port , () => {
    console.log('server up on ' + port)
})