const express = require('express')
const mysql = require('mysql2/promise')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(express.json())

app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173'
  ]
}))

const DBconfig = mysql.createPool({
    connectionLimit: process.env.DATABASE_CONNECTION_LIMIT,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME
})
module.exports = DBconfig

app.use('/imoveis', require('./Routes/Imovel.routes'))
app.use('/imagens', require('./Routes/ImagemImovel.routes'))
app.use('/usuarios', require('./Routes/Usuario.routes'))

const porta = process.env.PORT
app.listen(porta, () => console.log("SERVER RUNNING ON PORT: " + porta))

