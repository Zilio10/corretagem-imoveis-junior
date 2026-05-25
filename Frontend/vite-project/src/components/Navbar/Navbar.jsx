import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"

import "../../styles/components/Navbar.css"
import logoJunior from "../../assets/images/logo-junior-navbar.png"
import { FaRightFromBracket } from "react-icons/fa6"

import ImovelFilter from "../../pages/ImovelFilter/ImovelFilter"


export default function Navbar() {

  const [menuAberto, setMenuAberto] = useState(false)
  const [isLogged, setIsLogged] = useState(false)
  const [nivelUser, setNivelUser] = useState('')
  const [user, setUser] = useState({})
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const payloadString = localStorage.getItem('Payload')

    if (payloadString) {
      const payload = JSON.parse(payloadString)

      setIsLogged(true)
      setNivelUser(payload.nivel)
      setUser(payload)
    } else {
      setIsLogged(false)
      setNivelUser(null)
      setUser(null)
    }

  }, [location])

  function IconePerfil() {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>
    )
  }

  function adminNavbar(isLogged, nivel, links) {
    if (isLogged && nivel === 'admin') {
      links.push({
        label: "Anunciar Imóvel",
        href: "/adicionar-imovel"
      })
    }
  }

  function logout() {
    localStorage.clear()
    window.location.href = '/' // Reload + Redirect
  }

  const toggleMenu = () => setMenuAberto(prev => !prev)
  const fecharMenu = () => setMenuAberto(false)

  const navLinks = [
    { label: "Aluguel", href: "/imovelFilter", state: { finalidade: "Aluguel" } },
    { label: "Venda", href: "/imovelFilter", state: { finalidade: "Venda" } },
    { label: "Sobre", href: "/about" },
    { label: "Contato", href: "#footer__contato", ancora: true }
  ]

  adminNavbar(isLogged, nivelUser, navLinks)

  return (
    <nav className="navbar">
      <div className="navbar__container">

        <div className="navbar__left">
          <Link to="/" className="navbar__logo" onClick={fecharMenu}>
            <img src={logoJunior} alt="Júnior Imóveis" title="Home" />
          </Link>
        </div>

        <ul className={`navbar__menu ${menuAberto ? "open" : ""}`}>
          {navLinks.map((link, i) => {
            let title

            if (link.label === "Aluguel") title = "IMÓVEIS ALUGANDO"
            if (link.label === "Venda") title = "IMÓVEIS VENDENDO"

            return (
              <li key={link.href + i}>
                {link.ancora ? (
                  <a href={link.href} onClick={fecharMenu}>
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    state={{
                      filters: link.state || {},
                      title
                    }}
                    onClick={fecharMenu}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>

        <div className="navbar__right">

          <Link
            to={isLogged ? "/profile" : "/login"}
            className="navbar__profile"
          >
            <IconePerfil />

            {isLogged ? (
              <span className="navbar__user">
                Perfil
              </span>
            ) : (
              <span className="navbar__user">
                Entrar
              </span>
            )}
          </Link>

          {isLogged && (
            <FaRightFromBracket className="navbar__logout" title="Sair" onClick={() => setShowLogoutModal(true)} />
          )}

          {showLogoutModal && (
            <div className="modal-overlay">
              <div className="modal">
                <p>Tem certeza que deseja sair?</p>
                <div className="modal-actions">
                  <button onClick={() => setShowLogoutModal(false)}>Cancelar</button>
                  <button onClick={logout}>Confirmar</button>
                </div>
              </div>
            </div>
          )}

          <button
            className={`navbar__toggle ${menuAberto ? "open" : ""}`}
            onClick={toggleMenu}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

      </div>
    </nav>
  )
}