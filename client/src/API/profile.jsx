import axios from 'axios'

// user
export const getUserProfile = async (token) => {
    return await axios.get('/api/user/profile', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updateUserProfile = async (token, updatedUserData) => {
    return await axios.put('/api/user/profile', updatedUserData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

// Admin
export const listUsers = async (token, page = 1, limit = 10, form = {}) => {
    const params = {
        page,
        limit,
        ...form
    }
    return await axios.get('/api/admin/users', {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params
    })
}

export const getUserRoleList = async (token) => {
    return await axios.get('/api/admin/users/role-list', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}


export const getProfileByAdmin = async (token, id) => {
    return await axios.get(`/api/admin/users/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}


export const updateAcountStatus = async (token, id, status) => {
    return await axios.put(`/api/admin/users/status/${id}`,
        { enable: status },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
}


export const updateProfileByAdmin = async (token, id, role) => {
    return await axios.put(`/api/admin/users/role/${id}`,
        { role: role },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
}

export const fetchDashboardSummary = async (token) => {
    return await axios.get('/api/admin/summary', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

/** Dashboard analytics: KPI, charts, top tours (requires admin auth) */
export const fetchDashboardAnalytics = async (token, params = {}) => {
    return await axios.get('/api/admin/dashboard', {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params
    })
}







