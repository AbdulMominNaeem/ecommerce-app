  import { GitCommitVertical, Hamburger, HamburgerIcon, Menu, Search, ShoppingCart, UserRound, X, XIcon } from 'lucide-react'
  import React from 'react'
  import { useState } from 'react';
  import Drop from './GroceriesDrop';
  import {Link} from "react-router-dom"
  import LogOutDrop from './LogoutDrop';
  import DashDrop from './DashDrop';

  export const Nav = () => {
    const [open, setOpen] = useState(false);
    const lcName = localStorage.getItem('user');
    const user = JSON.parse(lcName);
    
    return (
      <nav className=" h-auto sm:h-20 bg-white flex items-center justify-between py-2 sm:py-3 px-4 sm:px-6 lg:px-8 w-full gap-2 sm:gap-4">
        <div className='flex items-center gap-2 sm:gap-3'>
          
          <Menu onClick={()=>setOpen(true)} className='text-cyan-700 cursor-pointer'/>
          <h1 className='text-lg sm:text-xl font-bold text-cyan-700 hidden lg:block'>Mega Mast</h1>
        </div>
        <div className='flex items-center gap-2 sm:gap-4 lg:gap-8 w-full sm:w-auto'>
          <div className="relative flex-1 sm:flex-none lg:relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-700 size-4 sm:size-5" />
            <input type="text" placeholder="Search for products" className="border border-gray-300 rounded-md pl-8 sm:pl-10 pr-2 py-1 w-full sm:w-64 lg:w-80 text-sm"/>
          </div>
            
          {user ? <span className='text-blue-600'>{user && <LogOutDrop />}</span>  :
          <Link to="/login" className=" lg:block text-cyan-700 hover:text-cyan-900 font-semibold underline decoration-2 underline-offset-5 transition-colors">
          <div className='flex items-center gap-1 sm:gap-2'>
          <UserRound className='text-cyan-700 size-5 sm:size-6'/>
          <p className="text-cyan-600 text-xs sm:text-sm text-center hover:text-cyan-900 font-semibold underline decoration-2 underline-offset-5 transition-colors">
              Sign Up/Log In
          </p>
          </div>
          </Link>}

          

          {user?.role === 'admin' && <DashDrop />}


          <GitCommitVertical className='opacity-50 size-4 sm:size-5 hidden sm:block'/>
          <div className='flex items-center gap-1 sm:gap-2'>
          <ShoppingCart className='text-cyan-700 size-5 sm:size-6'/>
          <p className='hidden lg:block text-sm'>Cart</p>
          </div>
        </div>
        </nav>
    )
  }
