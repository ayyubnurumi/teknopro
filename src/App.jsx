import { Outlet, Route, Routes } from 'react-router-dom'
import SideMenu from './components/SideMenu'

function App() {

  return (
    <>
      <SideMenu />
      <main className='grow max-h-screen overflow-y-auto bg-gray-100 text-black flex flex-col justify-center items-center p-6 '>
        <Outlet>
          <Routes>
            <Route index></Route>
            <Route path='/user'></Route>
            <Route path='/post'></Route>
          </Routes>
        </Outlet>
      </main>
    </>
  )
}

export default App
