import api from './api'

export const getAllImoveis = () => api.get("/imoveis")
export const getCidades = () => api.get("/imoveis/cidades")
export const getBairrosByCidade = (cidade) => api.get(`/imoveis/bairros/${cidade}`)
export const getAllFiltered = (filters) => api.get("/imoveis/filter", { params: filters }) // Params realiza query automaticamente
export const createImovel = (imovelData, token) => api.post("imoveis", imovelData, {
    headers: {
        Authorization: `Bearer ${token}`
    }
})
export const updateImovel = (id, imovelData, token) => api.put(`/imoveis/${id}`, imovelData, {
    headers: {
        Authorization: `Bearer ${token}`
    }
})
export const deleteImovel = (id, token) => api.delete(`/imoveis/${id}`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
})