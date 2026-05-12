import api from './api'

export const getByPosicao = (idImovel, posicaoImg) => api.get(`/imagens/${idImovel}/${posicaoImg}`)