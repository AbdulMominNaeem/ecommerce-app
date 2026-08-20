import { Menu } from "@headlessui/react";
import {
    ChevronDown,
    LogOut,
    UserRound,
    UserCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LogOutDrop() {
    const navigate = useNavigate();

    let email = "No email available";
    let name = "Profile";

    if (typeof window !== "undefined") {
        try {
            const stored = localStorage.getItem("user");
            const userData = stored ? JSON.parse(stored) : null;

            email = userData?.email || email;
            name = userData?.name || name;
        } catch (error) {
            console.error(
                "Failed to parse user from localStorage",
                error
            );
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.success("Logout successful");
        navigate("/login");
    };

    return (
        <Menu as="div" className="relative inline-block text-left">

            {/* Profile Button */}
            <Menu.Button
                className="
                    group
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-3
                    py-2
                    text-sm
                    font-semibold
                    text-slate-700
                    shadow-sm
                    transition-all
                    duration-200
                    hover:border-cyan-300
                    hover:bg-cyan-50
                    hover:text-cyan-700
                    focus:outline-none
                    focus:ring-2
                    focus:ring-cyan-500/20
                    sm:px-4
                "
            >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
                    <UserRound size={17} />
                </span>

                <span className="hidden max-w-[120px] truncate sm:block">
                    {name}
                </span>

                <ChevronDown
                    className="h-4 w-4 text-slate-400 transition-transform duration-200 group-data-[headlessui-state=open]:rotate-180"
                />
            </Menu.Button>

            {/* Dropdown */}
            <Menu.Items
                className="
                    absolute
                    right-0
                    z-50
                    mt-2
                    w-64
                    origin-top-right
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-[0_20px_50px_rgba(15,23,42,0.15)]
                    outline-none
                    focus:outline-none
                "
            >

                {/* User Info */}
                <div className="border-b border-slate-100 bg-slate-50 px-4 py-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
                            <UserCircle size={25} />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                                {name}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                                {email}
                            </p>
                        </div>

                    </div>

                </div>

                {/* Menu */}
                <div className="p-1.5">

                    {/* Profile */}
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                to="/profile"
                                className={`
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    px-3
                                    py-2.5
                                    text-sm
                                    font-medium
                                    transition-colors
                                    ${
                                        active
                                            ? "bg-cyan-50 text-cyan-700"
                                            : "text-slate-600"
                                    }
                                `}
                            >
                                <UserRound size={18} />

                                <span>
                                    My Profile
                                </span>
                            </Link>
                        )}
                    </Menu.Item>

                    {/* Logout */}
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className={`
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-xl
                                    px-3
                                    py-2.5
                                    text-left
                                    text-sm
                                    font-medium
                                    transition-colors
                                    ${
                                        active
                                            ? "bg-red-50 text-red-600"
                                            : "text-slate-600"
                                    }
                                `}
                            >
                                <LogOut size={18} />

                                <span>
                                    Logout
                                </span>
                            </button>
                        )}
                    </Menu.Item>

                </div>

            </Menu.Items>
        </Menu>
    );
}