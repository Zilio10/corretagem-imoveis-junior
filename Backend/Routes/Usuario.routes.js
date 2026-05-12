const express = require('express')
const router = express.Router()

const UsuarioController = require('../Controllers/UsuarioController')
const authMiddleware = require('../Middlewares/AuthMiddleware')

router.post('/', authMiddleware, UsuarioController.Create)
router.get('/:id', authMiddleware,  UsuarioController.GetById)
router.put('/:id', authMiddleware, UsuarioController.Update)
router.delete('/:id', authMiddleware, UsuarioController.Delete)

router.post('/login', UsuarioController.Login)
router.get('/dataFooter/:nivel', UsuarioController.GetDataAdm)

module.exports = router