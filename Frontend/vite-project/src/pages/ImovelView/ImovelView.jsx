import { useParams } from "react-router-dom"

export default function ImovelView() {
    const { idImovel } = useParams()
    
    return (

        <> ID do Imóvel: { idImovel } </>

    )
}