import { ChevronLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export const Sidebar = () => {
    return (
        <div className="flex min-h-screen overflow-hidden">
            <aside className="w-80 h-screen bg-gray-100 border-r border-gray-300">
                <div >

                    <Link to='/' className=" lg:block text-scyan-700 hover:text-cyan-900 font-semibold  transition-colors">
                        <p className="px-10 py-5 flex gap-2 items-center"> <ChevronLeft /> Home</p>
                    </Link>
                </div>
                <h1 className="p-6 text-2xl font-bold text-cyan-900 text-center">
                    SideBar
                </h1>

                <div className="flex flex-col gap-3 px-6 pt-30">
                    <Link to="/usermg" className="">
                        <button
                            className="cursor-pointer border w-full border-cyan-500 rounded px-4 py-2 text-left hover:bg-cyan-100"
                        >
                            User Management
                        </button>
                    </Link>

                    <Link to="/productmg" className="">
                        <button
                            className=" flex cursor-pointer border w-full border-cyan-500 rounded px-4 py-2 text-left hover:bg-cyan-100"
                        >
                            Product Management
                        </button>
                    </Link>
                    <Link to="" className="">
                        <button
                            className="cursor-pointer border w-full border-cyan-500 rounded px-4 py-2 text-left hover:bg-cyan-100"
                        >
                            Option
                        </button>
                    </Link>
                </div>
            </aside>
        </div>
    );
};