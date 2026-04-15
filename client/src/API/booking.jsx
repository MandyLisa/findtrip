import axios from 'axios'

// User สร้างการจอง
export const createBooking = async (token, data) => {

    return await axios.post('/api/booking', data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

// User ยกเลิกการจอง
export const cancelBooking = async (token, bookingId) => {

    return await axios.patch(`/api/booking/${bookingId}/cancel`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

// User ดูหน้าการจองของฉัน
export const getUserBookings = async (token, page = 1, limit = 10, bookingStatus) => {
    return await axios.get(`/api/booking?page=${page}&limit=${limit}&bookingStatus=${bookingStatus}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

// User ดูรายละเอียดการจองแต่ละ id
export const getBookingDetail = async (token, bookingId) => {
    return await axios.get(`/api/booking/${bookingId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

// Admin Drop down 
export const getBookingStatusList = async (token) => {
    return await axios.get('/api/booking/admin/list-status/booking', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

// Admin ดึงข้อมูลการจองทั้งหมด
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

// Admin อัพเดตสถานะการจอง 
export const updateBookingStatus = async (token, bookingId, status) => {
    return await axios.patch(`/api/booking/admin/${bookingId}/status`,
        { bookingStatus: status },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}

