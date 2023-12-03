import request from './request'

export const generateAlphaPhoto = (data) => request.post('/api/v1/photo/generate_alpha', data)
export const generateBase64AlphaPhoto = (data) => request.post('/api/paint', data)
export const addBg = (data) => request.post('/api/v1/photo/add_bg', data)