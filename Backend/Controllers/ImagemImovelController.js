const ImagemImovel = require('../Models/ImagemImovel')
const ImagemImovelRepository = require('../Repositories/ImagemImovelRepository')
const { deleteFromBunny } = require('../Utils/bunnyUpload')

const upload = require('../Middlewares/UploadMiddleware')
const { uploadToBunny } = require('../Utils/bunnyUpload')

class ImagemImovelController {

    async Create(req, res) {
    try {
        const idImovel = parseInt(req.body.idImovel)
        const posicao  = parseInt(req.body.posicao)

        const file     = req.file
        const ext      = file.originalname.split('.').pop()
        const fileName = `${Date.now()}-${idImovel}-${posicao}.${ext}`

        const urlCdn = await uploadToBunny(file.buffer, fileName)

        const idImg = await ImagemImovelRepository.Create({
            _enderecoImagem:  urlCdn,
            _posicaoImagem:   posicao,
            _idImovelImagem:  idImovel,
        })

        res.status(201).json({ Sucesso: true, Id_Imagem: idImg, Endereco: urlCdn })

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

            // Busca a imagem antes de deletar para pegar o endereço
            const imagens = await ImagemImovelRepository.GetById(id)
            if (!imagens || imagens.length === 0) {
                return res.status(404).json({ Sucesso: false, Mensagem: 'Imagem não encontrada.' })
            }

            // Extrai só o nome do arquivo da URL CDN
            // ex: "https://zona.b-cdn.net/imoveis/123-456-1.jpg" => "123-456-1.jpg"
            const urlCdn = imagens[0].endereco_imagem
            const fileName = urlCdn.split('/').pop()

            await deleteFromBunny(fileName)

            const affectedRows = await ImagemImovelRepository.Delete(id)
            if (affectedRows === 0) {
                return res.status(404).json({ Sucesso: false, Mensagem: 'Imagem não encontrada.' })
            }

            res.status(200).json({ Sucesso: true, Mensagem: 'Imagem deletada com sucesso.' })

        } catch (err) {
            res.status(500).json({ Sucesso: false, Erro: err.message })
        }
    }

}

module.exports = new ImagemImovelController()