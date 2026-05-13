import apiCep from "./apiCep"

export const getaddressByCep = (cep) => apiCep.get(`/${cep}/json/`)

