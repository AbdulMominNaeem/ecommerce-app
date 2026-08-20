import React from "react";
import {
    BadgePercent,
    MapPin,
    Truck,
} from "lucide-react";

export const Header = () => {
    return (
        <header className= "border-b border-slate-200 bg-slate-50" >

        <div className="mx-auto flex h-11 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" >

            {/* Welcome */ }
            < p className = "text-xs font-medium text-slate-500 sm:text-sm" >
                Welcome to{ " " }
    <span className="font-semibold text-cyan-600" >
        MegaMart
        </span>
        </p>

    {/* Right Navigation */ }
    <div className="flex items-center" >

        {/* Deliver To */ }
        < div className = "flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-cyan-600" >
            <MapPin
                            size={ 15 }
    className = "text-cyan-600"
        />

        <span className="hidden sm:block" >
            Deliver to
                </span>
                </div>

    {/* Divider */ }
    <div className="mx-3 hidden h-4 w-px bg-slate-300 sm:block" />

        {/* Track Order */ }
        < div className = "flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-cyan-600" >
            <Truck
                            size={ 15 }
    className = "text-cyan-600"
        />

        <span className="hidden sm:block" >
            Track Your Order
                </span>
                </div>

    {/* Divider */ }
    <div className="mx-3 hidden h-4 w-px bg-slate-300 sm:block" />

        {/* Offers */ }
        < div className = "flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-cyan-600" >
            <BadgePercent
                            size={ 16 }
    className = "text-cyan-600"
        />

        <span className="hidden sm:block" >
            All Offers
                </span>
                </div>

                </div>

                </div>
                </header>
    );
};