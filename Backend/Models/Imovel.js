class Imovel {

    constructor(imovelObj = {}) {
        this._tituloImovel = imovelObj.titulo
        this._descricaoImovel = imovelObj.descricao
        this._precoImovel = imovelObj.preco
        this._tipoImovel = imovelObj.tipo
        this._finalidadeImovel = imovelObj.finalidade
        this._estagioImovel = imovelObj.estagio
        this._statusImovel = imovelObj.status
        this._cepImovel = imovelObj.cep
        this._cidadeImovel = imovelObj.cidade
        this._bairroImovel = imovelObj.bairro
        this._enderecoImovel = imovelObj.endereco
        this._areaImovel = imovelObj.area
        this._qtdQuartosImovel = imovelObj.qtdQuartos
        this._qtdSuitesImovel = imovelObj.qtdSuites
        this._qtdBanheirosImovel = imovelObj.qtdBanheiros
        this._qtdVagasImovel = imovelObj.qtdVagas
        this._dataCriacaoImovel = imovelObj.dataCriacao
    }

}

module.exports = Imovel


