// import { create } from 'zustand' // นำเข้า create จาก Zustand ซึ่งใช้สร้าง global store
// // เพื่อใช้มันในการประกาศ state กลางที่เอาไปใช้ได้หลาย component

// const useBookingPageStore = create((set) => ({ // สร้าง store ใหม่ โดย create() รับ callback ที่มี parameter set สำหรับอัปเดต state
//   currentPageByTab: {}, // สร้าง state object  เพื่อเก็บเลขหน้าปัจจุบันของแต่ละแท็บ เช่น { all: 8, pending: 2 }
//   totalPagesByTab: {}, // state นี้จะเก็บจำนวนหน้าทั้งหมดของแต่ละแท็บ เช่น { all: 24, pending: 12 } 3 หน้า, 2 หน้า เพื่อใช้แสดง pagination ให้ตรงกับจำนวนข้อมูล

//   setCurrentPageForTab: (tab, page) => // ฟังก์ชันอัปเดต currentPage ของแท็บที่กำหนด
//     set((state) => ({
//       currentPageByTab: {
//         ...state.currentPageByTab,
//         [tab]: page,
//       },
//     })),

//   setTotalPagesForTab: (tab, totalPages) =>
//     set((state) => ({
//       totalPagesByTab: {
//         ...state.totalPagesByTab,
//         [tab]: totalPages,
//       },
//     })),

// }))
// export default useBookingPageStore
