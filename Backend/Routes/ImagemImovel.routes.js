const express = require('express')
const router = express.Router()
const upload = require('../Middlewares/UploadMiddleware')

const ImagemImovelController = require('../Controllers/ImagemImovelController')
const authMiddleware = require('../Middlewares/AuthMiddleware')

// Private
router.post('/', upload.single('imagem'), authMiddleware, ImagemImovelController.Create)
router.put('/:id', authMiddleware, ImagemImovelController.Update)
router.delete('/:id', authMiddleware, ImagemImovelController.Delete)
// Public
router.get('/:idImovel', ImagemImovelController.GetByImovel)
router.get('/:idImovel/:posicao', ImagemImovelController.GetByPosicao)

module.exports = router