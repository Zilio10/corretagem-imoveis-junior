const DB = require('../server')

class ImagemImovelRepository {

    async Create(imgImovelObj) {
        const sql = 'INSERT INTO Imagens_Imoveis (endereco_imagem,posicao_imagem,id_imovel_imagem) VALUES (?,?,?)'
        const params = [
            imgImovelObj._enderecoImagem,
            imgImovelObj._posicaoImagem,
            imgImovelObj._idImovelImagem
        ]

        const [result] = await DB.execute(sql, params)
        return result.insertId // Retorna o ID auto increment
    }

    async GetByImovel(idImovel) {
        const sql = 'SELECT * FROM Imagens_Imoveis WHERE id_imovel_imagem = ? ORDER BY posicao_imagem ASC'
        const params = [idImovel]

        const [rows] = await DB.execute(sql, params)
        return rows
    }

    async GetByPosicao(idImovel, posicao) { // IDEIA: Obter a imagem principal de um imóvel, para a página principal (Posição ImgPrincipal = 1)
        const sql = 'SELECT * FROM Imagens_Imoveis WHERE id_imovel_imagem = ? AND posicao_imagem = ?'
        const params = [
            idImovel,
            posicao
        ]

        const [rows] = await DB.execute(sql, params)
        return rows
    }

    async GetById(idImg) { // Utilizado para manipulação no Bunny
        const sql = 'SELECT * FROM Imagens_Imoveis WHERE id_imagem = ?'
        const params = [idImg]

        const [rows] = await DB.execute(sql, params)
        return rows
    }

    async Update(imgImovelObj, idImg) { // IDEIA: Só atualizzar a posição da imagem, pois será possível a troca de posição das imagens no carrocel presente no site
        const sql = 'UPDATE Imagens_Imoveis SET endereco_imagem = ?, posicao_imagem = ?, id_imovel_imagem = ? WHERE id_imagem = ?'
        const params = [
            imgImovelObj._enderecoImagem,
            imgImovelObj._posicaoImagem,
            imgImovelObj._idImovelImagem,
            idImg
        ]

        const [result] = await DB.execute(sql, params)
        return result.affectedRows
    }

    async Delete(idImg) {
        const sql = 'DELETE FROM Imagens_Imoveis WHERE id_imagem = ?'
        const params = [idImg]

        const [result] = await DB.execute(sql, params)
        return result.affectedRows
    }

}

module.exports = new ImagemImovelRepository()