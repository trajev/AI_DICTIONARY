import { BookMarked, History, Bookmark, ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import React, { useState } from 'react'
import { useAuthStore } from "../stores/useAuthStore"
import { Link, useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

const Navbar = () => {
  const navigate = useNavigate();

  const { token, user, logout } = useAuthStore();

  const [flag, setFlag] = useState(false);

  return (
    <nav className='text-white px-6 py-8 overflow-x-hidden'>
      <div className='flex justify-center items-center gap-2 cursor-pointer text-[#FFFAEC] '>
        <BookMarked />
        <Link to="/" className='text-2xl font-semibold '>AI Dictionary</Link>
      </div>
      <div className='w-[90vw] flex justify-end items-center gap-4 mt-4'>
        {!token ? (
          <div className='text-[#FFFAEC] flex gap-2'>
            <Link to='/login' className='border-b-2 border-zinc-500 hover:border-[#FFFAEC] transition-colors duration-300'>Login</Link>
            /
            <Link to='/register' className='border-b-2 border-zinc-500 hover:border-[#FFFAEC] transition-colors duration-300'>Register</Link>
          </div>
        ) :
          <div className='flex items-center gap-1'>

            Hey, <Link to="/profile" className="ml-1 border-b-2 border-zinc-500 hover:border-[#FFFAEC]  transition-colors duration-300 ">{user.username}</Link>!
            <p className=' text-[#FFFAEC] cursor-pointer transition-all duration-300 ease-in'> {!flag ? <ChevronRight className='text-zinc-400 hover:text-[#FFFAEC]' size={20} onClick={() => setFlag(true)} /> : <ChevronLeft onClick={() => setFlag(false)} size={20} />} </p>

            { flag &&
              <div className='flex gap-3 transition-all duration-300 ease-in ml-2'>
                <History data-tooltip-id="tooltip" data-tooltip-content="history" onClick={() => { navigate(`/history/${user._id}`); setFlag(false) } } size={20} className='text-zinc-400 hover:text-[#FFFAEC] cursor-pointer' />
                <Bookmark data-tooltip-id="tooltip" data-tooltip-content="bookmarks" onClick={() => { navigate(`/bookmarks/${user._id}`); setFlag(false) } } size={20} className='text-zinc-400 hover:text-[#FFFAEC] cursor-pointer' />
                <LogOut data-tooltip-id="tooltip" data-tooltip-content="log out" size={20} onClick={() => { logout(); alert("user logged out"); setFlag(false) }} className=' text-zinc-400 hover:text-[#FFFAEC] cursor-pointer' />
              </div>
            }

            <Tooltip id="tooltip" place="bottom" variant='dark' />
          </div>
        }

      </div>
    </nav>
  )
}

export default Navbar