import {
    ChevronLeft,
    LayoutDashboard,
    Package,
    Tags,
    Users,
} from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

export const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        {
            name: "User Management",
            path: "/usermg",
            icon: Users,
        },
        {
            name: "Product Management",
            path: "/productmg",
            icon: Package,
        },
        {
            name: "Category Management",
            path: "/catmg",
            icon: Tags,
        },
    ];

    return (
        <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-950 text-white">

            {/* Brand */}
            <div className="border-b border-slate-800 px-6 py-6">

                <Link
                    to="/"
                    className="group flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-cyan-400"
                >
                    <ChevronLeft
                        size={18}
                        className="transition-transform duration-200 group-hover:-translate-x-1"
                    />

                    Back to Store
                </Link>

                <div className="mt-7">
                    <h1 className="text-2xl font-black tracking-tight">
                        Mega<span className="text-cyan-400">Mart</span>
                    </h1>

                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                        Admin Dashboard
                    </p>
                </div>

            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8">

                <p className="mb-4 px-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Management
                </p>

                <div className="space-y-2">

                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    group
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    px-3
                                    py-3
                                    text-sm
                                    font-semibold
                                    transition-all
                                    duration-200
                                    ${
                                        active
                                            ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/10"
                                            : "text-slate-400 hover:bg-slate-900 hover:text-white"
                                    }
                                `}
                            >
                                <Icon
                                    size={19}
                                    className={`
                                        transition-colors
                                        ${
                                            active
                                                ? "text-slate-950"
                                                : "text-slate-500 group-hover:text-cyan-400"
                                        }
                                    `}
                                />

                                <span>{item.name}</span>
                            </Link>
                        );
                    })}

                </div>

            </nav>

            {/* Bottom */}
            <div className="border-t border-slate-800 p-4">

                <div className="rounded-xl bg-slate-900 p-4">
                    <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500 text-sm font-bold text-slate-950">
                            A
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-white">
                                Administrator
                            </p>

                            <p className="text-xs text-slate-500">
                                Manage your store
                            </p>
                        </div>

                    </div>
                </div>

            </div>

        </aside>
    );
};