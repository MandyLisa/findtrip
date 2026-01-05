# ✈️ FindTrip Project
**FindTrip** คือ Full-stack Web Application สำหรับการค้นหาและจองแพ็กเกจท่องเที่ยวแบบครบวงจร 

---

## 🚀 Features
* **User System:** สมัครสมาชิก, เข้าสู่ระบบ และระบบลืมรหัสผ่าน
* **Profile Management:** จัดการข้อมูลส่วนตัวและแก้ไขโปรไฟล์ได้ด้วยตัวเอง
* **My Bookings:** ระบบ Dashboard สำหรับลูกค้าเพื่อตรวจสอบประวัติและสถานะการจองแพ็กเกจทัวร์
* **Tour Packages:** ค้นหาแพ็กเกจทัวร์ แบ่งตามหมวดหมู่ ประเทศ และราคา พร้อมดูรายละเอียด
* **Booking:** ระบบจองทัวร์พร้อมคำนวณราคา
* **Payment:** รองรับการชำระเงินผ่านบัตรเครดิตด้วย Stripe API และการโอนเงินผ่านบัญชีธนาคาร
* **Admin Dashboard:** ระบบจัดการข้อมูลทัวร์, อัปโหลดรูปภาพ และดูรายการจอง การชำระเงิน ฯลฯ

---

## 🛠️ Tech Stack
| Frontend | Backend | Database |
| :--- | :--- | :--- |
| React (Vite), Tailwind CSS | Node.js, Express | MySQL (Prisma ORM) |
| Zustand (State Management) | JWT (Authentication) | Cloudinary (Image Store) |

---

## 📑 API Endpoints
นี่คือรายการ API ทั้งหมดที่ใช้ในโปรเจกต์นี้:

### 🔐 Authentication
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | สมัครสมาชิกใหม่ | Public |
| POST | `/api/auth/login` | เข้าสู่ระบบ | Public |
| POST | `/api/auth/forgot-password` | ส่งอีเมล์รีเซ็ตรหัสผ่าน | Public |
| GET | `/api/auth/verify-reset-token/:token` | ตรวจสอบ token รีเซ็ตรหัสผ่าน | Public |
| POST | `/api/auth/reset-password` | เปลี่ยนรหัสผ่านใหม่ | Public |
| POST | `/api/auth/current-user` | ตรวจสอบสถานะผู้ใช้ปัจจุบัน | User |
| POST | `/api/auth/current-admin` | ตรวจสอบสถานะผู้ดูแลระบบ | Admin |

### 🔍 Public & Search API
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/api/public/category` | ดึงรายการหมวดหมู่ทั้งหมด | Public |
| GET | `/api/public/country` | ดึงรายการประเทศทั้งหมด | Public |
| GET | `/api/public/recommend` | ดึงรายการทัวร์แนะนำ | Public |
| GET | `/api/public/tourdetail/:id` | ดูรายละเอียดทัวร์ | Public |
| GET | `/api/public/title` | ค้นหาทัวร์ตามหัวข้อ/ชื่อ | Public |
| GET | `/api/public/alltours` | ดึงรายการทัวร์ทั้งหมดในระบบ | Public |
| POST | `/api/public/search` | ค้นหาทัวร์แบบละเอียด (Filters) | Public |
| POST | `/api/public/listby` | ดึงรายการทัวร์เรียงตามราคา | Public |
| GET | `/api/public/:id/available` | ตรวจสอบจำนวนแพ็กเกจคงเหลือ | Public |

### 🗺️ Booking
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/booking` | สร้างรายการจองใหม่ | User |
| GET | `/api/booking` | ดูประวัติการจองทั้งหมดของตัวเอง | User |
| PATCH | `/api/booking/:id/cancel` | ยกเลิกรายการจอง | User |
| GET | `/api/booking/:id` | ดูรายละเอียดการจองเฉพาะรายการ | User |
| GET | `/api/booking/admin/all` | ดูรายการจองของลูกค้าทุกคนในระบบ | Admin |
| GET | `/api/booking/admin/list-status/booking` | ดึงรายการสถานะการจอง (Dropdown) | Admin |
| PATCH | `/api/booking/admin/:id/status` | อัปเดตสถานะการจอง | Admin |


### 📦 Tour Package API for Admin
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/tourpackage` | เพิ่มแพ็กเกจทัวร์ใหม่ | Admin |
| PUT | `/api/tourpackage/:id` | อัปเดตแก้ไขข้อมูลแพ็กเกจ | Admin |
| GET | `/api/tourpackage/detail/:id` | ดูรายละเอียดแพ็กเกจ (สำหรับ Admin) | Admin |
| GET | `/api/tourpackage` | แสดงรายการทัวร์ทั้งหมด | Admin |
| DELETE | `/api/tourpackage/:id` | ลบแพ็กเกจทัวร์ | Admin |
| POST | `/api/tourpackage/images` | อัปโหลดรูปภาพ | Admin |
| DELETE | `/api/tourpackage/remove-images` | ลบรูปภาพ | Admin |
| POST | `/api/tourpackage/upload-pdf` | อัปโหลดไฟล์ PDF | Admin |

### 📄 PDF & Proxy API
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/api/pdfProxy` | เข้าถึงไฟล์ PDF ผ่าน Proxy (เพื่อความปลอดภัย) | Public |


### 📂 Admin Category Management
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/category` | สร้างหมวดหมู่ใหม่ | Admin |
| GET | `/api/category` | ดูรายการหมวดหมู่ทั้งหมด  | Admin |
| PUT | `/api/category/:id` | แก้ไขชื่อหมวดหมู่ | Admin |
| DELETE | `/api/category/:id` | ลบหมวดหมู่ | Admin |


### 🌍 Admin Country Management
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/country` | เพิ่มประเทศใหม่ | Admin |
| GET | `/api/country` | ดูรายการประเทศทั้งหมด | Admin |
| PUT | `/api/country/:id` | แก้ไขชื่อประเทศ | Admin |
| DELETE | `/api/country/:id` | ลบประเทศ | Admin |


### 💳 Payment & Slip API
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/upload-slip/:bookingId` | อัปโหลดหลักฐานการชำระเงิน (Slip) | User |
| GET | `/api/payments/admin/all` | ดูรายการชำระเงินทั้งหมดในระบบ | Admin |
| GET | `/api/payments/admin/list-status/payment` | ดึงรายการสถานะการชำระเงิน (Dropdown) | Admin |
| GET | `/api/payments/admin/list-status/method` | ดึงรายการช่องทางการชำระเงิน (Dropdown) | Admin |
| GET | `/api/payments/admin/payment-details/:id` | ดูรายละเอียดและอัปเดตสถานะการชำระเงิน | Admin |

### 💳 Stripe Payment API
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/stripe/user/create-checkout-session` | สร้างรายการชำระเงินผ่าน Stripe | User |
| POST | `/api/stripe/user/checkout-status/:sessionId` | ตรวจสอบสถานะการชำระเงินจาก Stripe | User |


### 👤 User Profile API
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/api/user/profile` | ดึงข้อมูลโปรไฟล์ส่วนตัว | User |
| PUT | `/api/user/profile` | แก้ไขข้อมูลโปรไฟล์ส่วนตัว | User |
---

## 📦 Installation & Setup
1. **Clone project:**
   ```bash
   git clone [https://github.com/MandyLisa/findtrip.git](https://github.com/MandyLisa/findtrip.git)