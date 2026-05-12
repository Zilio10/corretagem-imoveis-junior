const express = require('express')
const router = express.Router()

const ImagemImovelController = require('../Controllers/ImagemImovelController')
const authMiddleware = require('../Middlewares/AuthMiddleware')

// Private
router.post('/', authMiddleware, ImagemImovelController.Create)
router.put('/:id', authMiddleware, ImagemImovelController.Update)
router.delete('/:id', authMiddleware, ImagemImovelController.Delete)
// Public
router.get('/:idImovel', ImagemImovelController.GetByImovel)
router.get('/:idImovel/:posicao', ImagemImovelController.GetByPosicao)

module.exports = router