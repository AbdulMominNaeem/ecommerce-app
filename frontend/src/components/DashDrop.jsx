import React, { useState } from "react";
import { Menu } from "@headlessui/react";
import {
    ChevronDown,
    LayoutDashboard,
    ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DashDrop({ user }) {
    const [userData] = useState(() => {
        try {
            const stored = localStorage.getItem("user");
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error("Failed to parse user:", error);
            return null;
        }
    });

    const currentUser = user || userData || {};

    return (
        <Menu as="div" className="relative">

            {/* Button */}
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
                {/* Admin Icon */}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
                    <ShieldCheck size={17} />
                </span>

                {/* Role */}
                <span className="hidden sm:block">
                    {currentUser?.role === "admin"
                        ? "Admin"
                        : "Account"}
                </span>

                <ChevronDown
                    size={16}
                    className="
                        text-slate-400
                        transition-transform
                        duration-200
                        group-data-[headlessui-state=open]:rotate-180
                    "
                />
            </Menu.Button>

            {/* Dropdown */}
            <Menu.Items
                className="
                    absolute
                    right-0
                    z-50
                    mt-2
                    w-60
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-[0_20px_50px_rgba(15,23,42,0.15)]
                    focus:outline-none
                "
            >

                {/* Header */}
                <div className="border-b border-slate-100 bg-slate-50 px-4 py-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
                            <ShieldCheck size={21} />
                        </div>

                        <div>
                            <p className="text-sm font-bold text-slate-900">
                                {currentUser?.role === "admin"
                                    ? "Administrator"
                                    : "User Account"}
                            </p>

                            <p className="text-xs text-slate-500">
                                {currentUser?.role === "admin"
                                    ? "Full dashboard access"
                                    : "Standard account"}
                            </p>
                        </div>

                    </div>

                </div>

                {/* Menu */}
                <div className="p-1.5">

                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                to="/dashboard"
                                className={`
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    px-3
                                    py-3
                                    text-sm
                                    font-semibold
                                    transition-colors
                                    ${
                                        active
                                            ? "bg-cyan-50 text-cyan-700"
                                            : "text-slate-600"
                                    }
                                `}
                            >
                                <LayoutDashboard size={18} />

                                <div>
                                    <p>Dashboard</p>

                                    <p className="mt-0.5 text-xs font-normal text-slate-400">
                                        Manage your store
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