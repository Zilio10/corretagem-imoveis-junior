import "../../styles/components/ImovelCard.css"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaPen } from "react-icons/fa"

export default function ImovelCard({ imovel }) {

  const [isAdm, setIsAdm] = useState(false)

  useEffect(() => {
    const payloadString = localStorage.getItem('Payload')

    if (payloadString) {
      const payload = JSON.parse(payloadString)

      if (payload?.nivel === 'admin') {
        setIsAdm(true)
      }
    }

  }, [])

  const navigate = useNavigate()

  const {
    id_imovel,
    titulo_imovel,
    caminho_imagem_principal,
    preco_imovel,
    area_imovel,
    finalidade_imovel,
    tipo_imovel,
    cidade_imovel,
    bairro_imovel,
  } = imovel

  const precoFormatado = Number(preco_imovel).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  })

  return (
    <article className="imovel-card" onClick={() => navigate(`/imovelView/${id_imovel}`)}>
      <div className="card-image-wrapper">
        {caminho_imagem_principal ? (
          <img
            src={caminho_imagem_principal}
            alt={titulo_imovel}
            className="card-image"
          />
        ) : (
          <div className="card-image-placeholder">
            <span className="placeholder-icon">🏠</span>
          </div>
        )}
        <span className="card-badge">{finalidade_imovel}</span>

        {!!isAdm && (
          <button
            title="Editar imóvel"
            className="card-edit-btn"
            onClick={(e) => {
              e.stopPropagation() // Impede que o clique dispare a função do article, ent para a propagação no editBtn
              navigate(`/imovelEdit/${id_imovel}`)
            }}
          >
            <FaPen />
          </button>
        )}
      </div>

      <div className="card-body">
        <p className="card-location">
          {cidade_imovel} - {bairro_imovel}
        </p>
        <h3 className="card-title">{titulo_imovel}</h3>

        <div className="card-details">
          <span className="card-detail-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {tipo_imovel}
          </span>
          <span className="card-detail-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
            {area_imovel}
          </span>
        </div>

        <div className="card-footer">
          <p className="card-price">{precoFormatado}</p>
          <button className="card-cta">Ver detalhes</button>
          {isAdm && (
            <div className="card-footer-id">
              <p>ID do imóvel: {id_imovel}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}