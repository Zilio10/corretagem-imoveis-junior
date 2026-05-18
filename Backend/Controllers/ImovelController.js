const Imovel = require('../Models/Imovel')
const ImovelRepository = require('../Repositories/ImovelRepository')
const ImagemImovelRepository = require('../Repositories/ImagemImovelRepository')
const { uploadToBunny } = require('../Utils/bunnyUpload')

class ImovelController {

    async Create(req, res) {
        try {
            // Converte "1.234,56" => 1234.56
            req.body.preco = Number(
                req.body.preco
                    .replace(/\./g, "") // remove pontos
                    .replace(",", ".")  // troca vírgula por ponto
            )

            const imovelObj = new Imovel(req.body)
            const idImovel = await ImovelRepository.Create(imovelObj)

            if (req.files && req.files.length > 0) { 
                const uploads = req.files.map(async(file,index) => {
                    const extImg = file.originalname.split('.').pop() // Extrai a extensão do arquivo original (ex: "jpg")
                    const fileName = `${Date.now()}-${idImovel}-${index + 1}.${extImg}` // Gera um nome único para o arquivo (ex: "1690000000000-123-1.jpg")

                    const urlCdn = await uploadToBunny(file.buffer, fileName) // Faz upload para Bunny que retorna a URL do CDN

                    return ImagemImovelRepository.Create({
                        _enderecoImagem: urlCdn,
                        _posicaoImagem: index + 1, // Define a posição da imagem com base na ordem do upload (1, 2, 3, ...)
                        _idImovelImagem: idImovel
                    })
                })
                await Promise.all(uploads) // Aguarda todos os uploads e inserções no banco serem concluídos
            }

            res.status(201).json({ Sucesso: true,Id_Imovel: idImovel })

        } catch (err) {

            res.status(500).json({ Sucesso: false,Erro: err.message })

        }
    }

    async GetAll(req, res) {
        try {
            const imoveis = await ImovelRepository.GetAll()

            res.status(200).json({ Sucesso: true, Imoveis: imoveis })
        } catch (err) {
            res.status(500).json({ Sucesso: false, Erro: err.message })
        }
    }

    async GetAllFiltered(req, res) {
        try {
            const filtros = req.query
            const imoveis = await ImovelRepository.GetAllFiltered(filtros)

            res.status(200).json({ Sucesso: true, Imoveis: imoveis })
        } catch (err) {
            res.status(500).json({ Sucesso: false, Erro: err.message })
        }
    }

    async GetCidades(req, res) {
        try {
            const cidades = await ImovelRepository.GetCidades()

            res.status(200).json({ Sucesso: true, Cidades: cidades })
        } catch (err) {
            res.status(500).json({ Sucesso: false, Erro: err.message })
        }
    }

    async Update(req, res) {
        try {
            const id = parseInt(req.params.id)
            const imovelObj = new Imovel(req.body)
            const affectedRows = await ImovelRepository.Update(id, imovelObj)

            if (affectedRows === 0) return res.status(404).json({ Sucesso: false, Mensagem: 'Imóvel não encontrado.' })

            res.status(200).json({ Sucesso: true, Mensagem: 'Imóvel atualizado com sucesso.' })
        } catch (err) {
            res.status(500).json({ Sucesso: false, Erro: err.message })
        }
    }

    async Delete(req, res) {
        try {
            const id = parseInt(req.params.id)
            const affectedRows = await ImovelRepository.Delete(id)

            if (affectedRows === 0) return res.status(404).json({ Sucesso: false, Mensagem: 'Imóvel não encontrado.' })

            res.status(200).json({ Sucesso: true, Mensagem: 'Imóvel deletado com sucesso.' })
        } catch (err) {
            res.status(500).json({ Sucesso: false, Erro: err.message })
        }
    }

}

module.exports = new ImovelController()