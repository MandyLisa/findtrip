import axios from 'axios'


// Admin
export const createCategory = async (token, form) => {

    return await axios.post('/api/category', form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listCategory = async (token, page = 1, limit = 10, form = {}) => {

    const params = {
        page,
        limit,
        ...form
    }

    return await axios.get(`/api/category?page=${page}&limit=${limit}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params
    })
}

export const updateCategory = async (token, id, data) => {
    return await axios.put('/api/category/' + id, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const removeCategory = async (token, id) => {

    return await axios.delete('/api/category/' + id, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
