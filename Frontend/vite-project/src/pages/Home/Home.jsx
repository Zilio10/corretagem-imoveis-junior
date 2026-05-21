import SearchBar from "../../components/SearchBar/SearchBar"
import Cards from "../../components/Cards/Cards"
import Pagination from "../../components/Pagination/Pagination"
import { useEffect, useState } from "react"
import { getAllImoveis } from "../../services/imovelService"
import { getByPosicao } from "../../services/imagemService"

const LIMIT = 12

export default function Home() {
  const [imoveis, setImoveis] = useState([])
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getAllImoveis()
        const imoveisArray = res.data.Imoveis

        const imoveisComImagem = await Promise.all(
          imoveisArray.map(async (imovel) => {
            try {
              const response = await getByPosicao(imovel.id_imovel, 1)
              return {
                ...imovel,
                caminho_imagem_principal: response.data.Imagens[0]?.endereco_imagem || null
              }
            } catch (err) {
              console.log(err)
              return imovel
            }
          })
        )

        setImoveis(imoveisComImagem)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const imoveisPagina = imoveis.slice(offset, offset + LIMIT)

  return (
    <main style={{ paddingTop: "10px" }}>
      <SearchBar />

      {loading ? (
        <div className="imovel-loading">
          <span className="imovel-loading__spinner" />
          <p>Carregando imóveis...</p>
        </div>
      ) : imoveis.length > 0 ? (
        <div className="imoveis-navegation">
          <Cards imoveis={imoveisPagina} title='IMÓVEIS RECENTES' found={imoveis.length} />
          <Pagination
            limit={LIMIT}
            total={imoveis.length}
            offset={offset}
            setOffset={setOffset}
          />
        </div>
      ) : (
        <p>Nenhum imóvel encontrado.</p>
      )}
    </main>
  )
}