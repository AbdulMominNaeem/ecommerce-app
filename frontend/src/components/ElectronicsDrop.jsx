import { Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const defaultItems = ['Refrigerators', 'Washing machines', 'Laptops', 'Gaming consoles']

export default function ElectronicsDrop({ label = 'Electronics', items = defaultItems, onSelect }) {
  return (
    <Menu as="div" className="relative inline-block">
      <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:shadow-none dark:inset-ring-white/5 dark:hover:bg-white/20">
        {label}
        <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
      </Menu.Button>

      <Menu.Items
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg outline-1 outline-black/5 transition data-[headlessui-state=closed]:scale-95 data-[headlessui-state=closed]:transform data-[headlessui-state=closed]:opacity-0 data-[headlessui-state=open]:duration-100 data-[headlessui-state=open]:ease-out data-[headlessui-state=leave]:duration-75 data-[headlessui-state=leave]:ease-in dark:divide-white/10 dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
      >
        <div className="py-1">
          {items.map((item) => (
            <Menu.Item key={item}>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => onSelect?.(item)}
                  className={`block w-full px-4 py-2 text-left text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white`}
                >
                  {item}
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  )
}
