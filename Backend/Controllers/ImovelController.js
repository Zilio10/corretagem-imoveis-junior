const Imovel = require('../Models/Imovel')
const ImovelRepository = require('../Repositories/ImovelRepository')

class ImovelController{

    async Create(req, res) {
        try {
            const imovelObj = new Imovel(req.body)
            const idImovel = await ImovelRepository.Create(imovelObj)

            res.status(201).json({ Sucesso: true, Id_Imovel: idImovel }) // Status 201 -> CREATED
        } catch (err) {
            res.status(500).json({ Sucesso: false, Erro: err.message })

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