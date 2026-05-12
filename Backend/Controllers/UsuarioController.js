const Usuario = require('../Models/Usuario')
const UsuarioRepository = require('../Repositories/UsuarioRepository')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class UsuarioController {

    async Create(req, res) {
        try {
            const userReq = req.body
            userReq.senha = await bcrypt.hash(userReq.senha, 10)

            const userObj = new Usuario(userReq)
            const idUser = await UsuarioRepository.Create(userObj)

            res.status(201).json({ Sucesso: true, Id_Usuario: idUser })
        } catch (err) {
            res.status(500).json({ Sucesso: false, Erro: err.message })
        }
    }

    async GetById(req, res) {
        try {
            const idUser = parseInt(req.params.id)
            const user = await UsuarioRepository.GetById(idUser)

            res.status(200).json({ Sucesso: true, Usuarios: user })
        } catch (err) {
            res.status(500).json({ Sucesso: false, Erro: err.message })
        }
    }

    async GetDataAdm(req, res) {
        try {
            const nivelUser = req.params.nivel
            const dataAdm = await UsuarioRepository.GetDataAdm(nivelUser)
            console.log(dataAdm)
            res.status(200).json({ Sucesso: true, Data_Footer: dataAdm })
        } catch (err) {
            res.status(500).json({ Sucesso: false, Erro: err.message })
        }
    }

    async Update(req, res) {

        try {

            const idUser = parseInt(req.params.id)
            const userReq = req.body

            // usuário alterou a senha
            if (userReq.senha && userReq.senha.trim() !== '') {

                userReq.senha = await bcrypt.hash(userReq.senha, 10)

                const userObj = new Usuario(userReq)

                await UsuarioRepository.UpdateWithPassword(userObj, idUser)

            } else {

                // remove senha vazia
                delete userReq.senha

                const userObj = new Usuario(userReq)

                await UsuarioRepository.Update(userObj, idUser)
            }

            res.status(200).json({
                Sucesso: true,
                Mensagem: 'Usuário atualizado com sucesso.'
            })

        } catch (err) {

            res.status(500).json({
                Sucesso: false,
                Erro: err.message
            })
        }
    }

    async Delete(req, res) {
        try {
            const idUser = parseInt(req.params.id)
            const affectedRows = await UsuarioRepository.Delete(idUser)

            if (affectedRows === 0) return res.status(404).json({ Sucesso: false, Mensagem: 'Usuário não encontrado.' })

            res.status(200).json({ Sucesso: true, Mensagem: 'Usuário deletado com sucesso.' })
        } catch (err) {
            res.status(500).json({ Sucesso: false, Erro: err.message })
        }
    }

    async Login(req, res) {
        try {
            const userName = req.body.nome
            const senha = req.body.senha

            const userObj = await UsuarioRepository.GetByNome(userName)

            if (!userObj) return res.status(404).json({ Sucesso: false, Mensagem: 'Usuário não encontrado.' })

            const senhaValida = await bcrypt.compare(senha, userObj.senha_usuario)

            if (!senhaValida) return res.status(404).json({ Sucesso: false, Mensagem: 'Senha inválida.' })

            const token = jwt.sign(
                {
                    id: userObj.id_usuario,
                    nome: userObj.nome_usuario,
                    apelido: userObj.apelido_usuario,
                    telefone: userObj.telefone_usuario,
                    email: userObj.email_usuario,
                    nivel: userObj.nivel_usuario
                },
                process.env.JWT_SECRET,
                { expiresIn: '3h' }
            )

            res.status(200).json({ Sucesso: true, Mensagem: 'Login efetuado com sucesso.', Token: token })

        } catch (err) {
            res.status(500).json({ Sucesso: false, Erro: err.message })
        }
    }

}

module.exports = new UsuarioController()