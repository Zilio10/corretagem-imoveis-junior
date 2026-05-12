import ImovelCard from "./ImovelCard"
import "../../styles/components/Cards.css"
import { useLocation } from "react-router-dom"

export default function Cards({ imoveis, title, found }) {

  const location = useLocation()
  const pathname = location.pathname

  if (!imoveis || imoveis.length === 0) {
    return (
      <div className="cards-empty">
        <span className="cards-empty-icon">🏘️</span>
        <p>Nenhum imóvel encontrado.</p>
      </div>
    )
  }

  const titulo = pathname === "/" ? "Imóveis recentes" : "Imóveis filtrados"

  return (
    <section className="cards-section">
      <h2 className="cards-heading">
        {title}
        <span className="cards-count">{found} resultados</span>
      </h2>

      <div className="cards-grid">
        {imoveis.map((imovel) => (
          <ImovelCard key={imovel.id_imovel} imovel={imovel} />
        ))}
      </div>
    </section>
  )
}