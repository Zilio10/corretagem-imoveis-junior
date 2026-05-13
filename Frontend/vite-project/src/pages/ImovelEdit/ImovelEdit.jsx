import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { isAuthenticated, getToken } from "../../utils/auth";

export default function ImovelEdit() {
    const { idImovel } = useParams()
    const [userToken, setUserToken] = useState(null)

    useEffect(() => {
            if (!isAuthenticated()) return
            const token = getToken()
            setUserToken(token)
        }, [])

    return (

        <> ID do imóvel: { idImovel } </>
        
    )
}