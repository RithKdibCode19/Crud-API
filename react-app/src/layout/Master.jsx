
import {Outlet} from 'react-router'
const Master = () => {
  return (
    <div>
        <header className='bg-black p-3 text-center text-white'>
            <h3>CRUD-API</h3>
        </header>
        <div className="container my-5">
            <Outlet/>
        </div>
    </div>
  )
}

export default Master