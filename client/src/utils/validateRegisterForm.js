// สำหรับ Login Form
export const validateLoginForm = (form) => {
    const newError = {}

    if (!form.identifier.trim()) {
        newError.identifier = 'กรุณากรอกชื่อบัญชีหรืออีเมล์'
    }

    if (!form.password.trim()) {
        newError.password = 'กรุณากรอกรหัสผ่าน'
    }

    return {
        errors: newError,
        isValid: Object.keys(newError).length === 0
    }
}

// สำหรับ Register Form
export const validateRegisterForm = (form) => {
    const newError = {}

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9._]{4,}$/
    if (!form.username.trim()) {
        newError.username = 'กรุณากรอกชื่อบัญชี'
    } else if (!usernameRegex.test(form.username)) {
        newError.username = 'ชื่อผู้ใช้ต้องเป็นภาษาอังกฤษ ความยาว 4 ตัวขึ้นไป (ใช้ _ หรือ . ได้)'
    }

    // Name validation
    if (!form.name.trim()) {
        newError.name = 'กรุณากรอกชื่อ'
    }

    // Surname validation
    if (!form.surname.trim()) {
        newError.surname = 'กรุณากรอกนามสกุล'
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/
    if (!form.phone.trim()) {
        newError.phone = 'กรุณากรอกเบอร์โทรศัพท์'
    } else if (!phoneRegex.test(form.phone)) {
        newError.phone = 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.email.trim()) {
        newError.email = 'กรุณากรอกอีเมล์'
    } else if (!emailRegex.test(form.email)) {
        newError.email = 'รูปแบบอีเมล์ไม่ถูกต้อง'
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
    if (!form.password.trim()) {
        newError.password = 'กรุณากรอกรหัสผ่าน'
    } else if (!passwordRegex.test(form.password)) {
        newError.password = 'รหัสผ่านต้องมีอย่างน้อย 8 ตัว รวมถึง ตัวอักษร ตัวเลข และอักขระพิเศษ'
    }

    // Confirm Password validation
    if (!form.confirmPassword.trim()) {
        newError.confirmPassword = 'กรุณายืนยันรหัสผ่านอีกครั้ง'
    } else if (form.password !== form.confirmPassword) {
        newError.confirmPassword = 'Password และ Confirm Password ไม่ตรงกัน'
    }

    return {
        errors: newError,
        isValid: Object.keys(newError).length === 0
    }
}

// สำหรับการ validation แต่ละฟิลด์แยก (สำหรับ real-time validation)
export const validateField = (name, value, form = {}) => {
    switch (name) {
        case 'identifier': // สำหรับ login
            return !value.trim() ? 'กรุณากรอกชื่อบัญชีหรืออีเมล์' : ''

        case 'username':
            const usernameRegex = /^[a-zA-Z0-9._]{4,}$/
            if (!value.trim()) return 'กรุณากรอกชื่อบัญชี'
            if (!usernameRegex.test(value)) return 'ชื่อผู้ใช้ต้องเป็นภาษาอังกฤษ ความยาว 4 ตัวขึ้นไป (ใช้ _ หรือ . ได้)'
            return ''

        case 'name':
            return !value.trim() ? 'กรุณากรอกชื่อ' : ''

        case 'surname':
            return !value.trim() ? 'กรุณากรอกนามสกุล' : ''

        case 'phone':
            const phoneRegex = /^[0-9]{10}$/
            if (!value.trim()) return 'กรุณากรอกเบอร์โทรศัพท์'
            if (!phoneRegex.test(value)) return 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)'
            return ''

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!value.trim()) return 'กรุณากรอกอีเมล์'
            if (!emailRegex.test(value)) return 'รูปแบบอีเมล์ไม่ถูกต้อง'
            return ''

        case 'password': // สำหรับ login
            if (form.isLogin) {
                return !value.trim() ? 'กรุณากรอกรหัสผ่าน' : ''
            }

            // สำหรับ register - เช็ค format เข้มงวด
            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
            if (!value.trim()) return 'กรุณากรอกรหัสผ่าน'
            if (!passwordRegex.test(value)) return 'รหัสผ่านต้องมีอย่างน้อย 8 ตัว รวมถึง ตัวอักษร ตัวเลข และอักขระพิเศษ'
            return ''

        case 'confirmPassword':
            if (!value.trim()) return 'กรุณายืนยันรหัสผ่านอีกครั้ง'
            if (form.password !== value) return 'Password และ Confirm Password ไม่ตรงกัน'
            return ''

        default:
            return ''
    }
}