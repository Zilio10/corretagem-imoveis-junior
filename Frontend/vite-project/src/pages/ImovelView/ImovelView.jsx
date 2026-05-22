import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { getAllFiltered } from "../../services/imovelService"
import { getByImovel } from "../../services/imagemService"
import { getDataAdm } from "../../services/usuarioService"

import { FaBed, FaBath, FaShower, FaCar, FaWhatsapp } from "react-icons/fa"

import Carousel from "../../components/Carousel/Carousel"
import "../../styles/pages/ImovelView.css"

function formatPrice(value) {
    if (!value) return "—"
    return Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 0,
    })
}

function StatusBadge({ status }) {
    const map = {
        "Disponível": "badge--available",
        "Vendido": "badge--sold",
        "Alugado": "badge--rented",
    }
    return (
        <span className={`badge ${map[status] ?? "badge--default"}`}>
            {status}
        </span>
    )
}

export default function ImovelView() {
    const { idImovel } = useParams()

    const [imovelData, setImovelData] = useState(null)
    const [images, setImages] = useState(null)
    const [admNumber, setAdmNumber] = useState(null)

    useEffect(() => {

        window.scrollTo({
            top: 0,
            behavior: "instant"
        })

        async function getImovelData(id) {
            try {
                const res = await getAllFiltered({ id })
                setImovelData(res.data.Imoveis[0])
            } catch (err) {
                console.error(err)
            }
        }

        async function getImovelImages(id) {
            try {
                const res = await getByImovel(id)
                setImages(res.data.Imagens)
            } catch (err) {
                console.error(err)
            }
        }

        async function getAdmNumber() {
            try {
                const res = await getDataAdm('admin')
                if (res.data && res.data.Data_Footer) {
                    setAdmNumber(res.data.Data_Footer.telefone_usuario)
                }
            } catch (err) {
                console.error(err)
            }
        }

        getImovelData(idImovel)
        getImovelImages(idImovel)
        getAdmNumber()

    }, [idImovel])

    if (!imovelData) {
        return (
            <div className="imovel-loading">
                <span className="imovel-loading__spinner" />
                <p>Carregando...</p>
            </div>
        )
    }

    const {
        titulo_imovel,
        tipo_imovel,
        finalidade_imovel,
        estagio_imovel,
        status_imovel,
        preco_imovel,
        endereco_imovel,
        area_imovel,
        qtd_quartos_imovel,
        qtd_suites_imovel,
        qtd_banheiros_imovel,
        qtd_vagas_imovel,
        descricao_imovel,
    } = imovelData

    const wppMsg = encodeURIComponent(`Olá! Me intertressei pelo imóvel: "${titulo_imovel}" de ID: "${idImovel}" no site e gostaria de saber mais informações.`)
    const whatsappLink = `https://wa.me/${admNumber}?text=${wppMsg}`


    return (
        <div className="iv-page">
            {/* Carrossel */}
            <section className="iv-carousel">
                <Carousel images={images} />
            </section>

            {/* Conteúdo */}
            <section className="iv-content">

                {/* Cabeçalho */}
                <div className="iv-header">
                    <div className="iv-header__meta">
                        <span className="iv-tag">{tipo_imovel}</span>
                        <span className="iv-tag iv-tag--outline">{finalidade_imovel}</span>
                        <StatusBadge status={status_imovel} />
                    </div>
                    <h1 className="iv-title">{titulo_imovel}</h1>
                    <p className="iv-address">
                        <svg className="iv-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                            <circle cx="12" cy="9" r="2.5" />
                        </svg>
                        {endereco_imovel}
                    </p>
                </div>

                {/* Preço + Estágio */}
                <div className="iv-price-row">
                    <div className="iv-price">
                        <span className="iv-price__label">
                            {finalidade_imovel === "Aluguel" ? "Valor do aluguel" : "Valor de venda"}
                        </span>
                        <strong className="iv-price__value">{formatPrice(preco_imovel)}</strong>
                    </div>
                    <div className="iv-stage">
                        <span className="iv-stage__label">Estágio</span>
                        <span className="iv-stage__value">{estagio_imovel}</span>
                    </div>
                </div>

                {/* Características */}
                <div className="iv-features">
                    <div className="iv-feature">
                        <svg className="iv-feature__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M3 9h18M9 21V9" />
                        </svg>
                        <span className="iv-feature__value">{area_imovel}</span>
                        <span className="iv-feature__label">Área</span>
                    </div>
                    <div className="iv-feature">
                        <FaBed className="iv-feat-icon" />
                        <span className="iv-feat-value">{qtd_quartos_imovel}</span>
                        <span className="iv-feat-label">Quartos</span>
                    </div>

                    <div className="iv-feature">
                        <FaBath className="iv-feat-icon" />
                        <span className="iv-feat-value">{qtd_suites_imovel}</span>
                        <span className="iv-feat-label">Suítes</span>
                    </div>

                    <div className="iv-feature">
                        <FaShower className="iv-feat-icon" />
                        <span className="iv-feat-value">{qtd_banheiros_imovel}</span>
                        <span className="iv-feat-label">Banheiros</span>
                    </div>

                    <div className="iv-feature">
                        <FaCar className="iv-feat-icon" />
                        <span className="iv-feat-value">{qtd_vagas_imovel}</span>
                        <span className="iv-feat-label">Vagas</span>
                    </div>
                </div>

                {/* Divisória */}
                <hr className="iv-divider" />

                {/* Descrição */}
                <div className="iv-description">
                    <h2 className="iv-section-title">Descrição</h2>
                    <p className="iv-description__text">{descricao_imovel}</p>
                </div>

            </section>

            <a href={whatsappLink} target="_blank" rel="noreferrer" className="iv-whatsapp" title="Entrar em contato via WhatsApp">
                <FaWhatsapp />
            </a>

        </div>
    )
}