import React, { useEffect, useState } from 'react';
import { Menu } from '@headlessui/react';
import { ChevronDown, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function DashDrop({ user }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!userData) {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          setUserData(JSON.parse(stored));
        } catch (error) {
          console.error('Failed to parse user from localStorage', error);
        }
      }
    }
  }, [userData]);

  const currentUser = user || userData || {};

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-cyan-700 ring-1 ring-cyan-200 hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300">
        <UserRound className='size-5 sm:size-6 text-cyan-700' />
        <span>{currentUser?.role || 'Profile'}</span>
        <ChevronDown className='h-4 w-4 text-cyan-700' />
      </Menu.Button>

      <Menu.Items className="absolute right-0 z-10 mt-2 min-w-[12rem] divide-y divide-gray-100 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg focus:outline-none">
        <div className="px-4 py-2 text-sm text-gray-700">{currentUser?.role === 'admin' ? 'Admin Access' : 'User'}</div>
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <Link to="/dashboard" className=" px-4 py-2 text-sm  lg:block text-cyan-700 hover:text-cyan-900 font-semibold underline decoration-2 underline-offset-5 transition-colors">
          <div className='flex items-center gap-1 sm:gap-2'>
          <p className="text-cyan-600 text-xs sm:text-sm text-center hover:text-cyan-900 font-semibold underline decoration-2 underline-offset-5 transition-colors">
              Dashboard
          </p>
          </div>
          </Link>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}
