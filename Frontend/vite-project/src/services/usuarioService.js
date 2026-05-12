import api from './api'

export const getDataAdm = (nivelUser) => api.get(`usuarios/dataFooter/${nivelUser}`)

export const login = (userName, password) => api.post('usuarios/login', { nome: userName, senha: password })
export const getUser = (idUser, token) => api.get(`usuarios/${idUser}`, {
    headers: {
        Authorization: `Berear ${token}`
    }
})
export const updateUser = (idUser, userData, token) => api.put(`usuarios/${idUser}`, userData, {
    headers: {
        Authorization: `Berear ${token}`
    }
})