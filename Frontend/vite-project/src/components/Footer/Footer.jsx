import { FaInstagram, FaPhone, FaWhatsapp, FaEnvelope } from 'react-icons/fa'

import "../../styles/components/Footer.css"
import logoJunior from "../../assets/images/logo-junior-navbar.png"
import { useEffect, useState } from 'react'

import { getDataAdm } from '../../services/usuarioService'

export default function Footer() {

     const [admData, setAdmData] = useState({
        telefone_usuario: '5512999999999',
        email_usuario: 'user@example.com',
        instagram_usuario: 'instagram'
    })

    useEffect(() => {

        async function getDataFooter() {
            try {
                const res = await getDataAdm('admin')

                if (res.data) {
                    setAdmData(res.data.Data_Footer)
                }

            } catch (err) {
                console.log(err)
            }
        }

        getDataFooter()

    }, [])



    const whatsappLink = `https://wa.me/${admData.telefone_usuario}?text=Olá!%20Venho%20do%20seu%20site%20e%20gostaria%20de%20mais%20informações.`
    const instagramLink = `https://www.instagram.com/${admData.instagram_usuario}`

    const copiarTexto = (texto) => {
        navigator.clipboard.writeText(texto)
        alert("Copiado para a área de transferência.", )
    }

    return (
        <footer id='footer__contato'>

            <div className="footer__top">

                <div className="footer__logo">
                    <img src={logoJunior} alt="Logo Júnior Corretor" />
                </div>

                <div className="footer__container">

                    {/* CONTATO */}
                    <div className="footer__coluna">

                        <h4>Contato:</h4>

                        <div
                            className="footer__item clickable"
                            onClick={() => copiarTexto(admData.telefone_usuario)}
                        >
                            <FaPhone />
                            <p>{admData.telefone_usuario}</p>
                        </div>

                        <div
                            className="footer__item email clickable"
                            onClick={() => copiarTexto(admData.email_usuario)}
                        >
                            <FaEnvelope />
                            <p>{admData.email_usuario}</p>
                        </div>

                    </div>

                    {/* REDES SOCIAIS */}
                    <div className="footer__coluna">

                        <h4>Redes sociais:</h4>

                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer__item"
                        >
                            <FaWhatsapp />
                            <p>WhatsApp</p>
                        </a>

                        <a
                            href={instagramLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer__item"
                        >
                            <FaInstagram />
                            <p>Instagram</p>
                        </a>

                    </div>

                </div>
            </div>

            <p className="footer__copy">
                <span>Júnior Corretor - Todos os direitos reservados.</span> &copy; 2026
            </p>

        </footer>
    )
}