const DB = require('../server')

class UsuarioRepository {
    
    async Create(userObj) {
        const sql = 'INSERT INTO Usuarios (nome_usuario,senha_usuario,apelido_usuario,telefone_usuario,email_usuario,instagram_usuario,nivel_usuario) VALUES (?,?,?,?,?,?,?)'
        const params = [
            userObj._nomeUsuario,
            userObj._senhaUsuario,
            userObj._apelidoUsuario,
            userObj._telefoneUsuario,
            userObj._emailUsuario,
            userObj._instagramUsuario,
            userObj._nivelUsuario
        ]

        const [result] = await DB.execute(sql, params)
        return result.insertId // Retorna o id auto increment
    }

    async GetById(idUser) {
        const sql = 'SELECT * FROM Usuarios WHERE id_usuario = ?'
        const params = [idUser]

        const [rows] = await DB.execute(sql, params)
        return rows[0]
    }

    async GetByNome(nomeUsuario) { // Utilizado para o Login
        const sql = 'SELECT * FROM Usuarios WHERE nome_usuario = ?'
        const params = [nomeUsuario]

        const [rows] = await DB.execute(sql, params)
        return rows[0]
    }

    async Update(userObj, idUser) {
        const sql = 'UPDATE Usuarios SET nome_usuario = ?, apelido_usuario = ?, telefone_usuario = ?, email_usuario = ?, instagram_usuario = ? WHERE id_usuario = ?'
        const params = [
            userObj._nomeUsuario,
            userObj._apelidoUsuario,
            userObj._telefoneUsuario,
            userObj._emailUsuario,
            userObj._instagramUsuario,
            idUser
        ]

        const [result] = await DB.execute(sql, params)
        return result.affectedRows
    }
    
    async UpdateWithPassword(userObj, idUser) {
        const sql = 'UPDATE Usuarios SET nome_usuario = ?, senha_usuario = ?, apelido_usuario = ?, telefone_usuario = ?, email_usuario = ?, instagram_usuario = ? WHERE id_usuario = ?'
        const params = [
            userObj._nomeUsuario,
            userObj._senhaUsuario,
            userObj._apelidoUsuario,
            userObj._telefoneUsuario,
            userObj._emailUsuario,
            userObj._instagramUsuario,
            idUser
        ]

        const [result] = await DB.execute(sql, params)
        return result.affectedRows
    }

    async Delete(idUser) {
        const sql = 'DELETE FROM Usuarios WHERE id_usuario = ?'
        const params = [idUser]

        const [result] = await DB.execute(sql, params)
        return result.affectedRows
    }

    async GetDataAdm(nivelUser) {
        const sql = 'SELECT telefone_usuario, email_usuario, instagram_usuario FROM Usuarios WHERE nivel_usuario = ?'
        const params = [nivelUser]

        const [rows] = await DB.execute(sql, params)
        return rows[0]
    }

}

module.exports = new UsuarioRepository()