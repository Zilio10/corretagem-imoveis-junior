import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

import { getAllFiltered } from "../../services/imovelService"
import { getByPosicao } from "../../services/imagemService"

import SearchBar from "../../components/SearchBar/SearchBar"
import Cards from "../../components/Cards/Cards"
import Pagination from "../../components/Pagination/Pagination"

const LIMIT = 12

export default function ImovelFilter() {
    const location = useLocation()

    const [imoveis, setImoveis] = useState([])
    const [offset, setOffset] = useState(0)
    const [loading, setLoading] = useState(true)
    const [title, setTitle] = useState('Imóveis encontrados')

    useEffect(() => {

        const filters = location.state?.filters

        setTitle(location.state?.title)

        async function fetchData() {
            try {
                const res = await getAllFiltered(filters)
                console.log(res)
                const imoveisArray = res.data.Imoveis

                const imoveisComImagem = await Promise.all(
                    imoveisArray.map(async (imovel) => {
                        try {
                            const response = await getByPosicao(imovel.id_imovel, 1)
                            return {
                                ...imovel,
                                caminho_imagem_principal: response.data?.Imagens[0]?.endereco_imagem || null
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

    }, [location])

    const imoveisPagina = imoveis.slice(offset, offset + LIMIT)

    return (
        <main style={{ paddingTop: "10px" }}>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            ) : imoveis.length > 0 ? (
                <div className="imoveis-navegation">
                    <Cards imoveis={imoveisPagina} title={title} found={ imoveis.length }/>
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