import axios from 'axios' // ติดต่อ backend

export const currentUser = async (token) => {
    return await axios.post('/api/auth/current-user', {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const currentAdmin = async (token) => {
    return await axios.post('/api/auth/current-admin', {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

// ส่งอีเมลรีเซ็ตรหัสผ่าน (Forgot Password)
export const forgotPassword = async (email) => {
    return await axios.post('/api/auth/forgot-password',
        { email }, // ← ส่ง body เป็น object
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
}

// ตรวจสอบ token จากลิงก์ (Verify Reset Token) ว่ายังไม่หมดอายุ
export const verifyResetToken = async (token) => {
    return await axios.get(`/api/auth/verify-reset-token/${token}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const resetPassword = async ({ token, newPassword }) => {
    return await axios.post('/api/auth/reset-password',
        { token, newPassword },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
}



