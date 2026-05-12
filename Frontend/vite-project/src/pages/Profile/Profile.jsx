import { getUser, updateUser } from "../../services/usuarioService"
import { useEffect, useState } from "react"

import '../../styles/pages/Profile.css'
import Swal from 'sweetalert2'

import {
    isAuthenticated,
    getPayload,
    getToken,
    logout
} from '../../utils/auth'

const swalStyled = Swal.mixin({
    customClass: {
        popup: 'swal-popup',
        title: 'swal-title',
        htmlContainer: 'swal-text',
        confirmButton: 'swal-btn-confirm',
    },
    buttonsStyling: false,
})

export default function Profile() {

    const [userToken, setUserToken] = useState(null)
    const [userData, setUserData] = useState({})
    const [isLogged, setIsLogged] = useState(false)

    const [username, setUsername] = useState('')
    const [surname, setSurname] = useState('')
    const [phone, setPhone] = useState('')
    const [ig, setIg] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {

        async function getUserData(idUser, token) {

            try {

                const res = await getUser(idUser, token)

                if (res.data) {
                    setUserData(res.data?.Usuarios)
                }

            } catch (err) {

                if (err.response?.status === 401) {
                    logout()
                }

                console.log(err)

            }

        }

        if (!isAuthenticated()) return

        const payload = getPayload()
        const token = getToken()

        setIsLogged(true)
        setUserToken(token)

        getUserData(payload.id, token)

    }, [])

    useEffect(() => {
        if (userData.nome_usuario) setUsername(userData.nome_usuario)
        if (userData.apelido_usuario) setSurname(userData.apelido_usuario)
        if (userData.telefone_usuario) setPhone(userData.telefone_usuario)
        if (userData.email_usuario) setEmail(userData.email_usuario)
        if (userData.instagram_usuario) setIg(userData.instagram_usuario)
    }, [userData])

    function toaster(success, message = '') {
        if (success) {
            swalStyled.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Dados atualizados com sucesso!',
            })
        } else {
            swalStyled.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Erro ao atualizar dados: ' + message,
            })
        }
    }

    function handleSubmit(e) {
        e.preventDefault()

        async function submitData() {
            try {
                const userObj = {
                    nome: username,
                    apelido: surname,
                    telefone: phone,
                    email: email,
                    instagram: ig,
                    senha: password
                }

                const res = await updateUser(userData.id_usuario, userObj, userToken)

                if (res.data.Sucesso) {
                    toaster(true)
                    setTimeout(() => window.location.reload(), 1500)
                } else {
                    toaster(false, res.data.Mensagem)
                }

            } catch (err) {

                if (err.response?.status === 401) {
                    logout()
                }

                toaster(false, err.message)
                console.log(err)

            }
        }

        submitData()
    }

    function handlePhoneChange(e) {
        let formattedInput = e.target.value.replace(/\D/g, '')
        if (formattedInput.startsWith('55')) {
            formattedInput = formattedInput.slice(2)
        }
        formattedInput = formattedInput.slice(0, 11)
        setPhone(formattedInput)
    }

    return (
        <div className="profile-page">
            <form onSubmit={handleSubmit} className="form-profile">

                <div className="profile-title">
                    <h3>Olá, {userData.apelido_usuario}!</h3>
                    <p>Alterar dados pessoais</p>
                </div>

                <div className="profile-fields">

                    <div className="profile-username">
                        <label htmlFor="username-input">Nome de usuário:</label>
                        <input type="text" id="username-input" value={username} required onChange={(e) => setUsername(e.target.value)} />
                    </div>

                    <div className="profile-surname">
                        <label htmlFor="surname-input">Apelido:</label>
                        <input type="text" id="surname-input" value={surname} required onChange={(e) => setSurname(e.target.value)} />
                    </div>

                    <div className="profile-phoneNum">
                        <label htmlFor="input-phoneNum">Número de telefone. Ex(12999999999):</label>
                        <input type="text" id="input-phoneNum" value={phone} required onChange={(e) => handlePhoneChange(e)} />
                    </div>

                    <div className="profile-email">
                        <label htmlFor="input-email">E-mail:</label>
                        <input type="email" id="input-email" value={email} required onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="profile-ig">
                        <label htmlFor="input-ig">Instagram (sem @):</label>
                        <input type="text" id="input-ig" value={ig} required onChange={(e) => setIg(e.target.value)} />
                    </div>

                    <div className="profile-password">
                        <label htmlFor="input-password">Nova senha:</label>
                        <input type="password" id="input-password" onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <button type="submit">Salvar Alterações</button>

                </div>

            </form>
        </div>
    )
}