class Usuario {

    constructor(userObj) {
        this._nomeUsuario = userObj.nome
        this._senhaUsuario = userObj.senha
        this._apelidoUsuario = userObj.apelido
        this._telefoneUsuario = userObj.telefone
        this._emailUsuario = userObj.email
        this._instagramUsuario = userObj.instagram
        this._nivelUsuario = userObj.nivel
    }
        
}

module.exports = Usuario