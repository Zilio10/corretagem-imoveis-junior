import api from './api'

export const getByPosicao = (idImovel, posicaoImg) => api.get(`/imagens/${idImovel}/${posicaoImg}`)
export const getByImovel = (idImovel) => api.get(`/imagens/${idImovel}`)