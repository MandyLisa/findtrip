import logo from '../assets/logo.png'

const Footer = () => {
  return (
    <>
        <footer className='w-full bg-brand-pink'>
            <div className='mx-auto px-5 max-w-7xl'>
                <div className='flex flex-col sm:flex-row sm:justify-between gap-4 py-6 sm:h-24 sm:py-0 items-center'>
                    <div className='flex items-center'>
                        <img src={logo} alt='Logo' className='h-10 w-auto' />
                    </div>

                    <div className='flex gap-6 sm:gap-8'>
                        <a href='https://line.me' target='_blank' rel='noopener noreferrer'>
                            <img src='/icons/line-logo.png' alt='Line' className='w-9 h-9 sm:w-10 sm:h-10' />
                        </a>
                        <a href='https://facebook.com' target='_blank' rel='noopener noreferrer'>
                            <img src='/icons/facebook-logo.png' alt='Facebook' className='w-9 h-9 sm:w-10 sm:h-10' />
                        </a>
                        <a href='https://instagram.com' target='_blank' rel='noopener noreferrer'>
                            <img src='/icons/ig-logo.png' alt='Instagram' className='w-9 h-9 sm:w-10 sm:h-10' />
                        </a>

                    </div>

                    <div className='text-white text-sm sm:text-base'>
                        © 2025 findtrip
                    </div>

                </div>
            </div>

        </footer>
    </>
  ) 
}

export default Footer
