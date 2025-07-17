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


// // สำหรับลบสลิปการโอน
// export const deletePaymentSlip = async (token, bookingId) => {
//     return await axios.delete(`/api/payment/${bookingId}/payment-slip`, {
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     })
// }

