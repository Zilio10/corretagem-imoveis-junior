const express = require('express') // Utiliza-se o Express para o Req e Res
const router = express.Router()

const ImovelController = require('../Controllers/ImovelController')
const authMiddleware = require('../Middlewares/AuthMiddleware')

// Private
router.post('/', authMiddleware, ImovelController.Create)
router.put('/:id', authMiddleware, ImovelController.Update)
router.delete('/:id', authMiddleware, ImovelController.Delete)
// Public
router.get('/', ImovelController.GetAll)
router.get('/filter', ImovelController.GetAllFiltered)
router.get('/cidades', ImovelController.GetCidades)

module.exports = router