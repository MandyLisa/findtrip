
import { useNavigate } from 'react-router-dom';


const CategoryHome = ({ id, name }) => {
    // const [searchByCategory, setSearchByCategory] = useState('')
    const navigate = useNavigate()
    const handleOnClick = () => {
        navigate(`/programs/${id}`); // มาจาก cat.id หน้า home
    }


    return (
        <button
            onClick={handleOnClick}
            className='flex items-center bg-brand-pink p-3 rounded-md text-white hover:bg-pink-600'>
            {name}
        </button>
    )
}

export default CategoryHome
