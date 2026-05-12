import { useParams } from "react-router-dom";

export default function ImovelEdit() {
    const { idImovel } = useParams()

    return (

        <> ID do imóvel: { idImovel } </>
        
    )
}