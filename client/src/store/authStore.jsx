import axios from 'axios'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'


const authStore = (set) => ({ 
    user: null,
    token: null,

    actionLogin: async (form) => {
        const res = await axios.post('/api/auth/login', form)
        set({ // เอาข้อมูลที่กลับมาจากหลังบ้าน เซ้ตเข้ามาอยู่ในตัวแปร
            user: res.data.users,
            token: res.data.token
        })
        return res
    },

    actionLogout: () => {
        set({
            user: null,
            token: null
        })
    },

    actionUpdateUser: (updatedUserData) => {
        set((state) => ({ // ใช้ functional update เพื่อให้แน่ใจว่าได้ state ล่าสุด
            user: {
                ...state.user, // copy user เก่าทั้งหมด
                ...updatedUserData // อัพเดตเฉพาะ field ที่ส่งมาใหม่
            }
        }))
    },
})


// persist คือตัวจำข้อมูล เก็บไว้ใน store แล้วบันทึกลง localStorage ให้
const useAuthStore = create(persist(authStore, { // เป็นฟังก์ชันหลักของ zustand ที่ใช้สำหรับสร้าง store
    name: 'authStore', // ชื่อ Key ที่ใช้ในการจัดเก็บใน Storage
    storage: createJSONStorage(() => localStorage)
}))


// ส่งออก store ออกไปให้ component อื่นใช้งาน
export default useAuthStore