import axios from 'axios'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'


const authStore = (set) => ({ 
    user: null,
    token: null,

    actionLogin: async (form) => {
        const res = await axios.post('/api/auth/login', form)
        // console.log(res)
        set({ // ข้อมูลที่กลับมาจากหลังบ้าน ก็จะเข้ามาอยู่ในตัวแปรที่เราเซ็ตสเตทไว้
            user: res.data.users,
            token: res.data.token
        })
        return res //ส่งออกไปบอกฝั่งผู้ใช้ เพื่อ redirect ไปหน้าอื่นต่อ
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


// 2 ประกาศตัวแปรมาอีกตัวเพื่อใช้ authStore และ usePersist เพื่อให้ตอน refresh ข้อมูลของผู้ใช้ไม่หาย
const useAuthStore = create(persist(authStore, {
    name: 'authStore',
    storage: createJSONStorage(() => localStorage)
}))


// 3. export ออกไปให้หน้าอื่นใช้งาน
export default useAuthStore