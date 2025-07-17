import { Outlet } from 'react-router-dom'
import MainNav from '../components/MainNav'
import Footer from '../components/Footer'

const Layout = () => {
    return (
        <div className='flex flex-col min-h-screen'> 
            <MainNav/>           
            <main className='flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8'>
                <Outlet />
            </main>

            <Footer/>
        </div>
    )
}

export default Layout
