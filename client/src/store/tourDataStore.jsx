import { create } from 'zustand'
import { listCategory } from '../API/category'
import { listCountry } from '../API/country'
import { listTourpackage } from '../API/tourpackage'

const useTourDataStore = create((set) => ({
    categories: [],
    countries: [],
    tourpackages: [],
    totalPages: [],

    getCategory: async (token, page = 1, limit = 5, form = {}) => {
        try {
            const res = await listCategory(token, page, limit, form)
            // console.log('ดู getCategory', res)
            set({
                categories: res.data.data,
                totalPages: res.data.totalPage
            })
        } catch (error) {
            console.error('getCategory error:', error)
        }
    },

    getCountry: async (token, page = 1, limit = 5, form = {}) => {
        try {
            const res = await listCountry(token, page, limit, form)
            // console.log('ดู getCountry', res)
            set({
                countries: res.data.data,
                totalPages: res.data.totalPage,
            })
        } catch (error) {
            console.log('getCountry error:', error)
        }
    },

    getTourpackage: async (token, page = 1, limit = 10, form = {}) => {
        try {
            
            set({ tourpackages: [] }) // เคลียร์ข้อมูลเก่า ก่อนโหลดใหม่
            const res = await listTourpackage(token, page, limit, form)
            // console.log('ดู getTourpackage', res)
            set({
                tourpackages: res.data.data,
                totalPages: res.data.totalPage
            })
        } catch (error) {
            console.error('getTourpackage error:', error)
        }
    }
}))


export default useTourDataStore
