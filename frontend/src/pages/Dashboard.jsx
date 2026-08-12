import React from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

export const Dashboard = () => {
    return (
        <div className="flex min-h-screen w-full overflow-hidden">
            <Sidebar/>
            <main className="flex-1 h-screen bg-white p-6">
                <p className="text-2xl font-semibold text-black">
                    Main area
                </p>
                <div className="flex-1 h-screen bg-white flex items-center justify-center">
                    <h1 className="text-6xl font-bold text-cyan-900">
                        DASHBOARD
                    </h1>        </div>
            </main>
        </div>
    );
};