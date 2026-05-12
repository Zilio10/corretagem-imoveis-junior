const ImagemImovel = require('../Models/ImagemImovel')
const ImagemImovelRepository = require('../Repositories/ImagemImovelRepository')

class ImagemImovelController {

    async Create(req, res) {
        try {
            const imgImovelObj = new ImagemImovel(req.body)
            const idImg = await ImagemImovelRepository.Create(imgImovelObj)

            res.status(201).json({ Sucesso: true, Id_Imagem: idImg })
        } catch (err) {
            res.status(500).json({ Sucesso: false, Erro: err.message })
        }
    }

    async GetByImovel(req, res) {
        try {
            const idImovel = parseInt(req.params.idImovel)
            const imagens = await ImagemImovelRepository.GetByImovel(idImovel)

            res.status(200).json({ Sucesso: true, Imagens: imagens })
        } catch (err) {
            res.status(500).json({ Sucesso: false, Erro: err.message })
        }
    }

    async GetByPosicao(req, res) {
        try {
            const idImovel = parseInt(req.params.idImovel)
            const posicaoImg = parseInt(req.params.posicao)
            const imagem = await ImagemImovelRepository.GetByPosicao(idImovel, posicaoImg)

            res.status(200).json({ Sucesso: true, Imagens: imagem })
        } catch (err) {
            res.status(500).json({ Sucesso: false, Erro: err.message })
        }
    }

    async Update(req, res) {
        try {
            const id = parseInt(req.params.id)
            const imgImovelObj = new ImagemImovel(req.body)
            const affectedRows = await ImagemImovelRepository.Update(imgImovelObj, id)

            if (affectedRows === 0) return res.status(404).json({ Sucesso: false, Mensagem: 'Imagem não encontrada.' })
            
            res.status(200).json({ Sucesso: true, Mensagem: 'Imagem atualizada com sucesso.' })
        } catch (err) {
            res.status(500).json({ Sucesso: false, Erro: err.message })   
        }
    }

    async Delete(req, res) {
        try {
            const id = parseInt(req.params.id)
            const affectedRows = await ImagemImovelRepository.Delete(id)

            if (affectedRows === 0) return res.status(404).json({ Sucesso: false, Mensagem: 'Imagem não encontrada.' })
            
            res.status(200).json({ Sucesso: true, Mensagem: 'Imagem deletada com sucesso.' })
        } catch (err) {
            res.status(500).json({ Sucesso: false, Erro: err.message })   
        }
    }

}

module.exports = new ImagemImovelController()