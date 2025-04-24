
import React from 'react'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'

const App = () => {
  return (
    <div className='min-h-screen overflow-x-hidden w-screen bg-[#030303] text-white flex flex-col justify-between'>

      <Navbar />
      <Outlet />
      <Footer />

    </div>
  )
}

export default App