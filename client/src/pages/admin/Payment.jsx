import FormPayment from '@/components/admin/FormPayment'


const Payment = () => {
  return (
    <>
      <div className='ml-2 p-2 bg-blue-600 text-white text-xl font-medium rounded-md w-full'>
        รายละเอียดการชำระเงิน (Payment Detail)
      </div>
      <div className='ml-2 my-4'>
        <FormPayment />
      </div>

    </>
  )
}

export default Payment
