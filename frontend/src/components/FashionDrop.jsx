import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const defaultItems = ['Women', 'Men', 'Kids', 'Accessories']

export default function FashionDrop({
  label = "Fashion",
  items = defaultItems,
  onSelect,
}) {
  return (
    <Menu as="div" className="relative inline-block text-left">

      {/* Button */}
      <Menu.Button
        className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-slate-800
                    shadow-sm
                    transition-all
                    duration-200
                    hover:border-cyan-300
                    hover:bg-cyan-50
                    hover:text-cyan-700
                    focus:outline-none
                    focus:ring-2
                    focus:ring-cyan-500/20
                "
      >
        {label}

        <ChevronDownIcon
          aria-hidden="true"
          className="h-5 w-5 text-slate-400 transition-transform"
        />
      </Menu.Button>

      {/* Dropdown */}
      <Menu.Items
        className="
                    absolute
                    left-0
                    z-50
                    mt-2
                    w-56
                    origin-top-left
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-1.5
                    shadow-[0_15px_40px_rgba(15,23,42,0.12)]
                    outline-none
                    focus:outline-none
                "
      >
        {items.map((item) => (
          <Menu.Item key={item}>
            {({ active }) => (
              <button
                type="button"
                onClick={() => onSelect?.(item)}
                className={`
                                    flex
                                    w-full
                                    items-center
                                    rounded-xl
                                    px-4
                                    py-3
                                    text-left
                                    text-sm
                                    font-medium
                                    transition-all
                                    duration-150
                                    ${active
                    ? "bg-cyan-50 text-cyan-700"
                    : "text-slate-600 hover:bg-slate-50"
                  }
                                `}
              >
                {item}
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
}