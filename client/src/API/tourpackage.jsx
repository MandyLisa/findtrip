import axios from 'axios' // connect Backend


// Admin
export const createTourpackage = async (token, form) => {

    return axios.post('/api/tourpackage', form, {
        headers: {
            Authorization: `Bearer ${token}`,  // ส่ง bearer token
            'Content-Type': 'application/json'
        }
    })
}

export const listTourpackage = async (token, page = 1, limit = 10, form = {}) => {

    const params = {
        page,
        limit,
        ...form
    }

    return axios.get('/api/tourpackage', {
        headers: {
            Authorization: `Bearer ${token}`  
        },
        params // ส่ง params ทั้งหมดเป็น query string ไปกับ URL
    })
}

export const readTourpackage = async (token, id) => {

    return axios.get('/api/tourpackage/detail/' + id, {
        headers: {
            Authorization: `Bearer ${token}` 
        }
    })
}

export const updateTourpackage = async (token, id, form) => {
    return axios.put('/api/tourpackage/' + id, form, {
        headers: {
            Authorization: `Bearer ${token}`,  
            'Content-Type': 'application/json'
        }
    })
}

export const removeTourpackage = async (token, id) => {

    return axios.delete('/api/tourpackage/' + id, {
        headers: {
            Authorization: `Bearer ${token}`  // ส่ง bearer token
        }
    })
}

export const uploadImages = async (token, form) => {
    return axios.post('/api/tourpackage/images', form, {
        headers: {
            Authorization: `Bearer ${token}`  // ส่ง bearer token
        }
    })

}

export const removeImages = async (token, public_id) => {
    return axios.delete('/api/tourpackage/remove-images', {
        data: { public_id }, // ส่งในรูปแบบ object
        headers: {
            Authorization: `Bearer ${token}`  // ส่ง bearer token
        }
    })

}

export const uploadPDF = async (token, formData) => {
    return axios.post('/api/tourpackage/upload-pdf', formData, {
        headers: {
            Authorization: `Bearer ${token}`  // ส่ง bearer token
        }
    })

}


