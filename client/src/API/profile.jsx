import axios from 'axios'

export const getUserProfile = async (token) => {
    return await axios.get('/api/user/profile', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updateUserProfile = async (token, updatedUserData) => {
    return await axios.put('/api/user/profile', updatedUserData,  {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

