import api from './api'

export const getAllImoveis = () => api.get("/imoveis")
export const getCidades = () => api.get("/imoveis/cidades")
export const getAllFiltered = (filters) => api.get("/imoveis/filter", {params: filters}) // Params realiza query automaticamente