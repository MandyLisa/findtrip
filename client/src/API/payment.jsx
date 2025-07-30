import axios from 'axios'


export const createStripePayment = async (token, bookingId) => {
    const numericBookingId = Number(bookingId)
    return await axios.post('/api/stripe/user/create-checkout-session', { bookingId: numericBookingId }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const stripeCheckoutStatus = async (token, sessionId) => { // sesssion มาจาก stripe 
    return await axios.post(`/api/stripe/user/checkout-status/${sessionId}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const uploadPaymentSlip = async (token, bookingId, formData) => {
    return await axios.post(`/api/payment/upload-slip/${bookingId}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        }
    })
}


// Admin Dropdown Payment Status
export const getPaymentStatusList = async (token) => {
    return await axios.get('/api/payment/admin/list-status/payment', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

// Admin Dropdown Payment Status
export const getPaymentMethodList = async (token) => {
    return await axios.get('/api/payment/admin/list-status/method', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

// Admin ดึงข้อมูลการจองทั้งหมด
export const listPayment = async (token, page = 1, limit = 10, form = {}) => {
    const params = {
        page,
        limit,
        ...form
    }

    return axios.get('/api/payment/admin/all', {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params
    })
}


export const getPaymentDetail = async (token, id) => {
    return await axios.get(`/api/payment/admin/payment-details/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

