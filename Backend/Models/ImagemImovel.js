class ImagemImovel {

    constructor(imgImovelObj) {
        this._enderecoImagem = imgImovelObj.endereco
        this._posicaoImagem = imgImovelObj.posicao
        this._idImovelImagem = imgImovelObj.idImovel
    }

}

module.exports = ImagemImovel