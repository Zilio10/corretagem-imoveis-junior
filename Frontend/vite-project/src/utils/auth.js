export function logout() {

    localStorage.clear()

    alert('Sessão expirada. Faça login novamente.')

    window.location.href = '/login'
}

export function userPayload(token) {

    localStorage.setItem('Token', token)

    const payload = JSON.parse(atob(token.split('.')[1]))

    localStorage.setItem('Payload', JSON.stringify(payload))

}

export function getToken() {

    return localStorage.getItem('Token')

}

export function getPayload() {

    const payload = localStorage.getItem('Payload')

    return payload ? JSON.parse(payload) : null

}

export function tokenExpirado(token) {

    try {

        const payloadBase64 = token.split('.')[1]

        const decodedPayload = JSON.parse(
            atob(payloadBase64)
        )

        return decodedPayload.exp * 1000 < Date.now()

    } catch {

        return true

    }

}

export function isAuthenticated() {

    const token = getToken()

    if (!token) {

        logout()
        return false

    }

    if (tokenExpirado(token)) {

        logout()
        
        return false

    }

    return true

}