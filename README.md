# ✈️ FindTrip Project
**FindTrip** คือ Full-stack Web Application สำหรับการค้นหาและจองแพ็กเกจท่องเที่ยวแบบครบวงจร 

---

## 🚀 Features
* **User System:** สมัครสมาชิก, เข้าสู่ระบบ และระบบลืมรหัสผ่าน
* **Profile Management:** จัดการข้อมูลส่วนตัวและแก้ไขโปรไฟล์ได้ด้วยตัวเอง
* **My Bookings:** ระบบ Dashboard สำหรับลูกค้าเพื่อตรวจสอบประวัติและสถานะการจองแพ็กเกจทัวร์
* **Tour Packages:** ค้นหาแพ็กเกจทัวร์ แบ่งตามหมวดหมู่ ประเทศ และราคา พร้อมดูรายละเอียด
* **Booking:** ระบบจองทัวร์พร้อมคำนวณราคา
* **Payment:** รองรับการชำระเงินผ่านบัตรเครดิตด้วย **Stripe API** และการโอนเงินผ่านบัญชีธนาคาร
* **Admin Dashboard:** ระบบจัดการข้อมูลทัวร์, อัปโหลดรูปภาพ และดูรายการจอง การชำระเงิน ฯลฯ

---

## 🛠️ Tech Stack
| Frontend | Backend | Database |
| :--- | :--- | :--- |
| React (Vite), Tailwind CSS | Node.js, Express | MySQL (Prisma ORM) |
| Zustand (State Management) | JWT (Authentication) | Cloudinary (Image Store) |

---

## 📑 API Endpoints
นี่คือรายการ API หลักที่ใช้ในโปรเจกต์นี้:

### 🔐 Authentication
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/register` | สมัครสมาชิกใหม่ | Public |
| POST | `/api/login` | เข้าสู่ระบบ | Public |

### 🗺️ Tours & Booking
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/api/tours` | ดึงรายการทัวร์ทั้งหมด | Public |
| GET | `/api/tours/:id` | ดูรายละเอียดทัวร์รายบุคคล | Public |
| POST | `/api/booking` | สร้างรายการจองใหม่ | User |

### 💳 Payment
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/create-payment-intent` | สร้างรายการชำระเงินผ่าน Stripe | User |

---

## 📦 Installation & Setup
1. **Clone project:**
   ```bash
   git clone [https://github.com/MandyLisa/findtrip.git](https://github.com/MandyLisa/findtrip.git)