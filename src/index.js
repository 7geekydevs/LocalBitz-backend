//packages
const express = require('express')

//router files
const menuRouter = require('./routes/menu_item_routes')

//db connection
require('./db/db_connection')

const app = express()

app.use(express.json())

app.use(menuRouter)

const port = process.env.PORT

app.listen(port , () => {
    console.log('server up on ' + port)
})


//bugs
//validation doesnt run in patch
//type in models isnt validation but it automatically changes data to specified type