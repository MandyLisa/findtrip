import logo from '../assets/logo.png'

const Footer = () => {
  return (
    <>
        <footer className='w-full bg-brand-pink'>
            <div className='mx-auto px-5 max-w-7xl'>
                <div className='flex justify-between h-24 items-center'>
                    <div className='flex items-center'>
                        <img src={logo} alt='Logo' className='h-10 w-auto' />
                    </div>

                    <div className='flex gap-8'>
                        <a href='https://line.me' target='_blank' rel='noopener noreferrer'>
                            <img src='/icons/line-logo.png' alt='Line' className='w-10 h-10' />
                        </a>
                        <a href='https://facebook.com' target='_blank' rel='noopener noreferrer'>
                            <img src='/icons/facebook-logo.png' alt='Facebook' className='w-10 h-10' />
                        </a>
                        <a href='https://instagram.com' target='_blank' rel='noopener noreferrer'>
                            <img src='/icons/ig-logo.png' alt='Instagram' className='w-10 h-10' />
                        </a>

                    </div>

                    <div className='text-white'>
                        © 2025 findtrip
                    </div>

                </div>
            </div>

        </footer>
    </>
  ) 
}

export default Footer
