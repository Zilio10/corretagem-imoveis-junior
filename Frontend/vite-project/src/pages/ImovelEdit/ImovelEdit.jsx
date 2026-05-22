import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { isAuthenticated, getToken } from "../../utils/auth";
import { getAllFiltered } from "../../services/imovelService";
import { getByImovel } from "../../services/imagemService";

export default function ImovelEdit() {
    const { idImovel } = useParams()
    const [userToken, setUserToken] = useState(null)

    const [imovelData, setImovelData] = useState(null)
    const [images, setImages] = useState(null)

    useEffect(() => {
            if (!isAuthenticated()) return
            const token = getToken()
            setUserToken(token)
    }, [])
    
    useEffect(() => {

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

        getImovelData(idImovel)
        getImovelImages(idImovel)

    }, [idImovel]) 

    return (

        <div> {JSON.stringify(imovelData)}</div>
        
    )
}
