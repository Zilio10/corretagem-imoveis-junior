const multer = require('multer')

const storage = multer.memoryStorage() // Armazena os arquivos na memória para upload posterior

const upload = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // Limite de 20MB por arquivo
    fileFilter: (req, file, cb) => { 
        if (file.mimetype.startsWith('image/')) {
            cb(null, true) // Aceita o arquivo -> Calback(error, acceptFile)
        } else {
            cb(new Error('Apenas arquivos de imagem são permitidos.')) // Rejeita o arquivo
        }
    }
})

module.exports = upload