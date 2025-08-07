import axios from 'axios'


export const getRecommend = async () => {
  return axios.get('/api/public/recommend')
}

export const getAllTours = async (page = 1, limit = 10) => {
  return axios.get(`/api/public/alltours?page=${page}&limit=${limit}`)
}

export const getListby = async () => {
    return axios.post('/api/public/listby')
}

export const searchFilters = async (filters, page = 1, limit = 10) => {
  return axios.post('/api/public/search', {
    ...filters,
    page,
    limit
  })
}

export const searchByTitle = async (searchTitle, page = 1, limit = 10) => {
  return axios.get(`/api/public/title?search=${searchTitle}&page=${page}&limit=${limit}`)
}


