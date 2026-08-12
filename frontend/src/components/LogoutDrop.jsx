import { Menu } from '@headlessui/react';
import { ChevronDown, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function LogOutDrop() {
  const navigate = useNavigate();
  let email = 'No email available';
  let name = 'Profile';

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('user');
      const userData = stored ? JSON.parse(stored) : null;
      email = userData?.email || email;
      name = userData?.name || name;
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logout successful');
    navigate('/login');
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-cyan-700 ring-1 ring-cyan-200 hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300">
        <UserRound className='size-5 sm:size-6 text-cyan-700' />
        <span>{name}</span>
        <ChevronDown className='h-4 w-4 text-cyan-700' />
      </Menu.Button>

      <Menu.Items className="absolute right-0 z-10 mt-2 min-w-[12rem] divide-y divide-gray-100 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg focus:outline-none">
        <div className="px-4 py-2 text-sm text-gray-700">{email}</div>
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <button
                type="button"
                onClick={handleLogout}
                className={`block w-full px-4 py-2 text-left text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
              >
                Logout
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}
