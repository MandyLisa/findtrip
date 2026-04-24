import axios from 'axios'


// export const fetchDashboardSummary = async (token) => {
//     return await axios.get('/api/admin/summary', {
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     })
// }

/** Dashboard analytics: KPI, charts, top tours (requires admin auth) */
export const fetchDashboardAnalytics = async (token, params = {}) => {
    return await axios.get('/api/admin/dashboard', {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params
    })
}
