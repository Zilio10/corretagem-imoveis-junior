const { param } = require('../Routes/Imovel.routes')
const DB = require('../server')

class ImovelRepository{

    async Create(imovelObj) {
        const sql = 'INSERT INTO Imoveis (titulo_imovel,descricao_imovel,preco_imovel,tipo_imovel,finalidade_imovel,estagio_imovel,status_imovel,cep_imovel,cidade_imovel,bairro_imovel,endereco_imovel,area_imovel,qtd_quartos_imovel,qtd_suites_imovel,qtd_banheiros_imovel,qtd_vagas_imovel,data_criacao_imovel) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
        const params = [
            imovelObj._tituloImovel,
            imovelObj._descricaoImovel,
            imovelObj._precoImovel,
            imovelObj._tipoImovel,
            imovelObj._finalidadeImovel,
            imovelObj._estagioImovel,
            imovelObj._statusImovel,
            imovelObj._cepImovel,
            imovelObj._cidadeImovel,
            imovelObj._bairroImovel,
            imovelObj._enderecoImovel,
            imovelObj._areaImovel,
            imovelObj._qtdQuartosImovel,
            imovelObj._qtdSuitesImovel,
            imovelObj._qtdBanheirosImovel,
            imovelObj._qtdVagasImovel,
            imovelObj._dataCriacaoImovel
        ]

        const [result] = await DB.execute(sql, params)
        return result.insertId // Retorna o id AUTO_INCREMENT
    }

    async GetAll() {
        const sql = 'SELECT * FROM Imoveis ORDER BY data_criacao_imovel DESC'
        
        const [rows] = await DB.execute(sql)
        return rows
    }

    async GetAllFiltered(filtros) {
        let sql = 'SELECT * FROM Imoveis WHERE 1=1'
        const params = []

        if (filtros.id) {
            sql += ' AND id_imovel = ?'
            params.push(filtros.id)
        }
        if (filtros.tipo) {
            sql += ' AND tipo_imovel = ?'
            params.push(filtros.tipo)
        }
        if (filtros.finalidade) {
            sql += ' AND finalidade_imovel = ?'
            params.push(filtros.finalidade)
        }
        if (filtros.estagio) {
            sql += ' AND estagio_imovel = ?'
            params.push(filtros.estagio)
        }
        if (filtros.cidade) {
            sql += ' AND cidade_imovel = ?'
            params.push(filtros.cidade)
        }
        if (filtros.precoMin) {
            sql += ' AND preco_imovel >= ?'
            params.push(Number(filtros.precoMin))
        }
        if (filtros.precoMax) {
            sql += ' AND preco_imovel <= ?'
            params.push(Number(filtros.precoMax))
        }
        if (filtros.qtdQuartos) {
            sql += ' AND qtd_quartos_imovel = ?'
            params.push(Number(filtros.qtdQuartos))
        }
        if (filtros.qtdVagas) {
            sql += ' AND qtd_vagas_imovel = ?'
            params.push(Number(filtros.qtdVagas))
        }

        const [rows] = await DB.execute(sql, params)
        return rows
    }
 
    async GetCidades() {
        const sql = 'SELECT DISTINCT cidade_imovel FROM Imoveis'

        const [rows] = await DB.execute(sql)
        return rows
    }

    async Update(idImovel, imovelObj) {
    const sql = `UPDATE Imoveis SET titulo_imovel = ?, descricao_imovel = ?, preco_imovel = ?, tipo_imovel = ?, finalidade_imovel = ?, estagio_imovel = ?, status_imovel = ?, cep_imovel = ?, cidade_imovel = ?, bairro_imovel = ?, endereco_imovel = ?, area_imovel = ?, qtd_quartos_imovel = ?, qtd_suites_imovel = ?, qtd_banheiros_imovel = ?, qtd_vagas_imovel = ? WHERE id_imovel = ?`

    const params = [
        imovelObj._tituloImovel,
        imovelObj._descricaoImovel,
        imovelObj._precoImovel,
        imovelObj._tipoImovel,
        imovelObj._finalidadeImovel,
        imovelObj._estagioImovel,
        imovelObj._statusImovel,
        imovelObj._cepImovel,
        imovelObj._cidadeImovel,
        imovelObj._bairroImovel,
        imovelObj._enderecoImovel,
        imovelObj._areaImovel,
        imovelObj._qtdQuartosImovel,
        imovelObj._qtdSuitesImovel,
        imovelObj._qtdBanheirosImovel,
        imovelObj._qtdVagasImovel,
        idImovel
    ]

    const [result] = await DB.execute(sql, params)
    return result.affectedRows 
    }
    
    async Delete(idImovel) {
        const sql = 'DELETE FROM Imoveis WHERE id_imovel = ?'
        const params = [idImovel]

        const [result] = await DB.execute(sql, params)
        return result.affectedRows
    }
}

module.exports = new ImovelRepository()

