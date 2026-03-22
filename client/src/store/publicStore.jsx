import { create } from 'zustand'
import axios from 'axios'

const usePublicStore = create((set) => ({
  categories: [], // ค่าเริ่มต้น 
  countries: [],
  tourDetail: null,
  isLoading: false, 

  fetchCategories: async () => { 
    try {
      const res = await axios.get('/api/public/category') // เขียน Axios call โดยตรงใน store
      // console.log('ดู fetchCategories ตรงนี้', res)
      set({ categories: res.data.data })
    } catch (error) {
      console.error('Error fetching Categories:', error)
    }
  },

  fetchCountries: async () => {
    try {
      const res = await axios.get('/api/public/country')
      // console.log('ดู fetchCountries ตรงนี้', res)
      set({ countries: res.data.data })
    } catch (error) {
      console.error('Error fetching Countries:', error)
    }
  },

  fetchTourDetail: async (id) => {
    try {
      set({ tourDetail: {}, isLoading: true }) // ล้างข้อมูลเก่าก่อน และตั้ง loading
      const res = await axios.get(`/api/public/tourdetail/${id}`)
    //   console.log('ดู fetchTourDetail ตรงนี้', res)
      set({
        tourDetail: res.data.data,
        isLoading: false
      })
    } catch (error) {
      console.error('Error fetching tour detail:', error)
      set({ isLoading: false }) // สิ้นสุด loading แม้เกิด error
    }
  }
}))

export default usePublicStore
