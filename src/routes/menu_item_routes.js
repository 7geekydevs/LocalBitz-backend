const express = require('express')

const router = express.Router()

router.get('/menu' , (req, res) =>{
    res.send('get menu endpoint')
})

router.post('/menu' , (req, res) =>{
    res.send('post menu endpoint')
})

router.patch('/menu' , (req, res) =>{
    res.send('patch menu endpoint')
})

router.delete('/menu' , (req, res) =>{
    res.send('delete menu endpoint')
})



module.exports = router