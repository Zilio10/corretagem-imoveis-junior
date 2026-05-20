import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { getAllFiltered } from "../../services/imovelService"
import { getByImovel } from "../../services/imagemService"

import Carousel from "../../components/Carousel/Carousel"
import "../../styles/pages/ImovelView.css"

export default function ImovelView() {
    const { idImovel } = useParams()

    const [imovelData, setImovelData] = useState(null)
    const [images, setImages] = useState(null)

    useEffect(() => {
        
        async function getImovelData(id) {
            try {
                const res = await getAllFiltered({ id: id })
                const imovel = res.data.Imoveis[0]
                console.log(imovel)
                setImovelData(imovel)
            } catch (err) {
                console.error(err)
            }
        }

        async function getImovelImages(id) {
            try {
                const res = await getByImovel(id)
                const img = res.data.Imagens
                setImages(img)
            } catch (err) {
                console.error(err)
            }
        }

        getImovelData(idImovel)
        getImovelImages(idImovel)
    
    }, [idImovel])

    return (

        <>
            <div className="imovel-view-page">

                <div className="imovel-view-caurosel">
                    <Carousel images={images}/>
                </div>

                <div className="imovel-view-info">
                    <p>{ JSON.stringify(imovelData) }</p>
                </div>
            </div>
        </>

    )
}