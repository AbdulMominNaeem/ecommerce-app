import { MessagesSquare, Phone } from "lucide-react";
import React from "react";

export const Footer = () => {
    return (
        <>
        <div className="min-h-80 bg-cyan-700 flex flex-col md:flex-row items-start px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 gap-8 sm:gap-12">
            <div className="flex flex-col flex-1 gap-4">
            <div className="flex flex-col gap-2">
                <div className="pb-4">
                <h1 className="text-2xl sm:text-3xl text-white font-bold">Mega Mart</h1>
                <p className="text-white text-sm sm:text-base">Contact Us</p>    
                </div>
                <div className="space-y-3">
                <div className="flex gap-2 items-center text-base sm:text-lg pt-2">
                    <MessagesSquare className="text-white size-6 shrink-0"/>
                    <p className="text-white">WhatsApp Us!</p>
                </div>
                    <p className="text-white text-sm pl-8">+92 300 1234567</p>

                <div className="flex gap-2 items-center text-base sm:text-lg pt-2">
                    <Phone className="text-white size-6 shrink-0"/>
                    <p className="text-white">Call Us!</p>
                </div>
                    <p className="text-white text-sm pl-8">+92 300 1234567</p>
                </div>
                
            </div>
            <div className="flex gap-4 sm:gap-8 flex-col flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl text-white border-b border-white pb-2">Most Popular Items</h1>
                <ul className="space-y-1 text-sm sm:text-base">
                <li className="text-white/90">Mobile Phones</li>
                <li className="text-white/90">Laptops</li>
                <li className="text-white/90">Watches</li>
                <li className="text-white/90">Shoes</li>
                </ul>

            </div>
            <div className="flex gap-4 sm:gap-8 flex-col flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl text-white border-b border-white pb-2">Customer Services</h1>
                <ul className="space-y-1 text-sm sm:text-base">
                <li className="text-white/90">Contact Us</li>
                <li className="text-white/90">Return Policy</li>
                <li className="text-white/90">Shipping Policy</li>
                </ul>

            </div>
            </div>
        </div>
        </>
    )
}
