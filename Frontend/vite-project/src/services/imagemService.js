import api from './api'

export const getByPosicao = (idImovel, posicaoImg) => api.get(`/imagens/${idImovel}/${posicaoImg}`)
export const getByImovel = (idImovel) => api.get(`/imagens/${idImovel}`)
export const deleteImage = (idImg, token) => api.delete(`/imagens/${idImg}`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
})
export const updateImage = (idImg, imageData, token) => api.put(`/imagens/${idImg}`, imageData, {
    headers: {
        Authorization: `Bearer ${token}`
    }
})
export const uploadImage = (formData, token) => api.post('/imagens/', formData, {
    headers: {
        Authorization: `Bearer ${token}`,
    }
})