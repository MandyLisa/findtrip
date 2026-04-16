import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getBookingDetail } from '../../API/booking'
import useAuthStore from '../../store/authStore'
import { formatDate_Time, formatThaiDate } from '@/utils/formatDate'

const PaymentReceipt = () => {
    const { bookingId } = useParams()
    const token = useAuthStore((state) => state.token)
    const [paymentDetails, setPaymentDetails] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (bookingId) {
            fetchPaymentDetails()
        }
    }, [bookingId])

    const fetchPaymentDetails = async () => {
        try {
            setLoading(true) // Set loading to true before fetching
            const res = await getBookingDetail(token, bookingId)
            console.log('ดู fetchBookingDetails ', res)
            setPaymentDetails(res.data.booking)
        } catch (error) {
            console.error('Error fetching payment details: ', error)
        } finally {
            setLoading(false)
        }
    }

    const paymentMethodMap = {
        'CREDIT_CARD': 'บัตรเครดิต/เดบิต',
        'BANK_TRANSFER': 'โอนเงินผ่านธนาคาร'
    }

    // 1. ส่วนสำหรับจัดกลุ่มเนื้อหา พร้อมแถบหัวข้อสีอ่อนๆ
    const Section = ({ label, children }) => (
        <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{
                background: 'linear-gradient(90deg, #f3f4f6 0%, #ffffff 100%)',
                padding: '8px 16px',
                borderBottom: '1px solid #e5e7eb',
                color: '#374151',
                fontSize: '16px',
                fontWeight: '600',
                textTransform: 'uppercase'
            }}>
                {label}
            </div>
            <div style={{ padding: '16px' }}>
                {children}
            </div>
        </div>
    );

    // 2. ส่วนสำหรับกลุ่มย่อย (เน้นสีเขียวอ่อนให้ดูสบายตา)
    const SubSection = ({ label, children }) => (
        <div style={{
            marginTop: '0.5rem',
            padding: '12px',
            background: '#f9fafb',
            borderRadius: '6px',
            borderLeft: '4px solid #10b981' // เพิ่มแถบสีข้างๆ ให้รู้ว่าเป็นข้อมูลสำคัญ
        }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '700', color: '#059669' }}>{label}</p>
            {children}
        </div>
    );

    // 3. Grid2 แบ่งคอลัมน์
    const Grid2 = ({ children }) => (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
        }}>
            {children}
        </div>
    );

    // 4. Field แสดงข้อมูล (เน้นความสะอาด)
    const Field = ({ label, value, bold, mono, style }) => (
        <div style={{ ...style }}>
            <p style={{ margin: 0, fontSize: '16px', color: '#6b7280', fontWeight: '500' }}>{label}</p>
            <p style={{
                margin: '2px 0 0',
                fontSize: '18px',
                fontWeight: bold ? '700' : '400',
                fontFamily: mono ? '"Courier New", Courier, monospace' : 'inherit',
                color: '#111827'
            }}>
                {value || '-'}
            </p>
        </div>
    );

    // 5. MetricCard (ใส่กรอบและเงาเบาๆ)
    const MetricCard = ({ num, label }) => (
        <div style={{
            padding: '12px',
            background: '#ffffff',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#2563eb' }}>{num || 0}</p>
            <p style={{ margin: 0, fontSize: '16px', color: '#6b7280', fontWeight: '500' }}>{label}</p>
        </div>
    );

    if (loading) {
        return <div>Loading booking details...</div>
    }


    if (!paymentDetails) {
        return <div>No booking details found for ID: {bookingId}.</div>
    }

    return (
        <div style={{ padding: '1rem', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ background: 'var(--color-background-primary)', borderRadius: 'var(--border-radius-lg)', border: '0.5px solid var(--color-border-tertiary)', overflow: 'hidden' }}>

                {/* Header */}
                <div style={{ padding: '1rem 1.25rem', background: 'var(--color-background-secondary)', borderBottom: '0.5px solid var(--color-border-tertiary)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                    <div>
                        <p style={{ margin: 0, fontSize: 18, color: 'var(--color-text-secondary)' }}>เลขการจอง</p>
                        <p style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 500 }}>{bookingId}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                        <span style={{ fontSize: 16, padding: '3px 10px', borderRadius: 'var(--border-radius-md)', background: 'var(--color-background-success)', color: 'var(--color-text-success)', fontWeight: 500 }}>ยืนยันแล้ว</span>
                    </div>
                </div>

                {/* ข้อมูลลูกค้า */}
                <Section label='ข้อมูลลูกค้า'>
                    <Grid2>
                        <Field label='ชื่อ-นามสกุล' value={`${paymentDetails.user?.name} ${paymentDetails.user?.surname}`} bold />
                        <Field label='วันที่จอง' value={formatThaiDate(paymentDetails.createdDate)} />
                    </Grid2>
                </Section>

                {/* ข้อมูลทัวร์ */}
                <Section label='ข้อมูลทัวร์'>
                    <Field label='ชื่อทัวร์' value={paymentDetails.tourPackage?.title} bold style={{ marginBottom: 12 }} />
                    <Grid2>
                        <Field label='เลขไอดีทัวร์' value={paymentDetails.tourPackage?.id} mono />
                        <Field label='รหัสทัวร์' value={paymentDetails.tourPackage?.tourCode} mono />
                        <Field label='ระยะเวลา' value={paymentDetails.tourPackage?.duration} />
                        <Field label='สายการบิน' value={paymentDetails.tourPackage?.airline} />
                        <Field label='วันที่เดินทาง' value={formatThaiDate(paymentDetails.tourPackage?.startDate)} />
                        <Field label='วันที่สิ้นสุด' value={formatThaiDate(paymentDetails.tourPackage?.endDate)} />
                    </Grid2>
                </Section>

                {/* จำนวนผู้เดินทาง */}
                <Section label='จำนวนผู้เดินทาง'>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
                        <MetricCard num={paymentDetails.adultCount} label='ผู้ใหญ่' />
                        <MetricCard num={paymentDetails.childCount} label='เด็กเล็ก (<2 ปี)' />
                        <MetricCard num={paymentDetails.singleStayCount} label='พักแยกห้อง' />
                    </div>
                </Section>

                {/* การชำระเงิน */}
                <Section label='ข้อมูลการชำระเงิน'>
                    <Grid2>
                        <Field label='สถานะการจอง' value={paymentDetails.bookingStatus} />
                        <Field label='สถานะการชำระเงิน' value={paymentDetails.Payment?.paymentStatus} />
                        <Field label='ช่องทางการชำระเงิน' value={paymentMethodMap[paymentDetails.Payment?.paymentMethod] || 'ไม่ระบุ'} />
                    </Grid2>

                    {paymentDetails.Payment?.paymentMethod === 'CREDIT_CARD' && (
                        <SubSection label='บัตรเครดิต'>
                            <Grid2>
                                <Field label='Transaction ID' value={paymentDetails.Payment?.transactionId} mono />
                                <Field label='วันที่ชำระเงิน' value={formatDate_Time(paymentDetails.Payment?.stripeSessionCreatedAt)} />
                            </Grid2>
                        </SubSection>
                    )}
                    {paymentDetails.Payment?.paymentMethod === 'BANK_TRANSFER' && (
                        <SubSection label='โอนเงิน'>
                            <Grid2>
                                <Field label='ธนาคารที่ชำระ' value={paymentDetails.Payment?.bankName} />
                                <Field label='Transaction ID' value={paymentDetails.Payment?.transactionId} mono />
                                <Field label='วันที่ชำระเงิน' value={formatDate_Time(paymentDetails.Payment?.paymentDate)} />
                            </Grid2>
                        </SubSection>
                    )}
                </Section>


                {/* ราคารวม */}
                <div style={{ padding: '1rem 1.25rem', background: 'var(--color-background-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
                    <p style={{ margin: 0, fontSize: 24, fontWeight: 500 }}>ราคารวมทั้งหมด</p>
                    <p style={{ margin: 0 }}>
                        <span style={{ fontSize: 24, fontWeight: 500 }}>{Number(paymentDetails.totalPrice).toLocaleString()}</span>
                        <span style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginLeft: 6 }}>บาท</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PaymentReceipt




