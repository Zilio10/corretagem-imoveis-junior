import { useEffect, useState } from "react"
import { isAuthenticated, getToken } from "../../utils/auth"

export default function ImovelAdd() {
     
    const [userToken, setUserToken] = useState(null)

    useEffect(() => {

        if (!isAuthenticated()) return
        
        const token = getToken()
        setUserToken(token)

    }, [])

    return (
        <div>Adicionar Imovel</div>
    )
}