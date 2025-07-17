import axios from 'axios'


export const createBooking = async (token, data) => {

    return await axios.post('/api/booking', data, {
        headers: {
            Authorization: `Bearer ${token}`  
        }
    })
}

export const listBooking = async (token, page = 1, limit = 10, form = {}) => {

    const params = {
        page,
        limit,
        ...form
    }

    return axios.get('/api/booking/admin/all', {
        headers: {
            Authorization: `Bearer ${token}`  
        },
        params 
    })
}

export const getBookingDetail = async (token, bookingId) => {

    return await axios.get(`/api/booking/${bookingId}`, {
        headers: {
            Authorization: `Bearer ${token}`  
        }
    })
}

export const cancelBooking = async (token, bookingId) => {

    return await axios.patch(`/api/booking/${bookingId}/cancel`, {}, {
        headers: {
            Authorization: `Bearer ${token}`  
        }
    })
}

// API เพิ่มใหม่
export const getUserBookings = async (token, page = 1, limit = 10, bookingStatus) => {
    return await axios.get(`/api/booking?page=${page}&limit=${limit}&bookingStatus=${bookingStatus}`, {
        headers: {
            Authorization: `Bearer ${token}`  
        }
    })
}

// อัพเดตสถานะการจอง (Admin หรือ System)
export const updateBookingStatus = async (token, bookingId, status, data = {}) => {
    return await axios.patch(`/api/booking/${bookingId}/status`, 
        { status, ...data }, 
        {
            headers: {
                Authorization: `Bearer ${token}`  
            }
        }
    )
}

