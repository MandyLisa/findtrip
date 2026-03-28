import axios from 'axios'

// Admin
export const createCountry = async (token, form) => {

    return await axios.post('/api/country', form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listCountry = async (token, page = 1, limit = 10, form = {}) => {

    const params = {
        page,
        limit,
        ...form
    }

    return await axios.get(`/api/country?page=${page}&limit=${limit}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params
    })
}

export const updateCountry = async (token, id, data) => {

    return await axios.put('/api/country/' + id, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const removeCountry = async (token, id) => {

    return await axios.delete('/api/country/' + id, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}