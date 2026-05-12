import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import '../../styles/pages/Login.css'

import { login } from "../../services/usuarioService"
import { userPayload } from "../../utils/auth"

export default function Login() {
    const navigate = useNavigate()
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [erro, setErro] = useState("")

    useEffect(() => {
        localStorage.clear()
    }, [])

    async function handleLogin (userName, password) {
        try {
            const res = await login(userName, password)

            if (res.data.Sucesso) {
                setErro("")

                const token = res.data.Token
                userPayload(token)

                navigate("/") // Vai para a Home
            } else {
                setErro("Login inválido!")
            }
            
        } catch (err) {
            console.log(err)
            setErro("Login inválido!")
        }
    }

    function handleSubmit(e) {
        e.preventDefault()

        handleLogin(userName, password)
    }

    return (
        <div className="login-page">
            <form onSubmit={handleSubmit} className="form-login">
                <div className="form-title">
                    <h3>Bem-vindo de volta!</h3>
                    <p>Entrar como corretor</p>
                </div>
                <div className="form-fields">
                    <label htmlFor="userName-input">Nome de usuário:</label>
                    <input type="text" placeholder="Nome" id='userName-input' value={userName} required
                        onChange={(e) => {
                            setUserName(e.target.value)
                        }} />

                    <label htmlFor="password-input">Senha:</label>
                    <input type="password" placeholder="Senha" id="password-input" value={password} required
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }} />
                    {erro && <p className="form-erro"> { erro } </p>}
                </div>

                <div className="form-submit-btn">
                    <button type="submit" className="form-btn">Entrar</button>
                </div>
            </form>
        </div>
    )
}