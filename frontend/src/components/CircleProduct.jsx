import { DevicePhoneMobileIcon } from "@heroicons/react/20/solid";
import React from "react";

export const CircleProduct = () => {
    return (
        <>
        <div className="mx-4 sm:mx-6 lg:mx-8 border-b border-gray-800/20 bg-white flex items-center ">
            <h2 className="text-lg sm:text-2xl font-black text-cyan-700 py-6">Top Product</h2>
        </div>
        <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-12 lg:pb-16 pt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6">

        <section className="h-24 sm:h-32 w-24 sm:w-32 border border-gray-800/20 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-transform duration-300 flex justify-center items-center">
            {/* <DevicePhoneMobileIcon className="h-20 w-20" />            */}
            <img src="/images/phone.jpg" alt="Product Image" className="h-16 sm:h-20 w-16 sm:w-20 hover:cursor-pointer object-cover" />
        </section>
        <section className="h-24 sm:h-32 w-24 sm:w-32 border border-gray-800/20 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-transform duration-300 flex justify-center items-center">
            {/* <DevicePhoneMobileIcon className="h-20 w-20" /> */}
            <img src="/images/machine.jpg" alt="Product Image" className="h-16 sm:h-24 hover:cursor-pointer object-cover" />

        </section>
        
         <section className="h-24 sm:h-32 w-24 sm:w-32 border border-gray-800/20 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-transform duration-300 flex justify-center items-center">
            {/* <DevicePhoneMobileIcon className="h-20 w-20" />            */}
            <img src="/images/chair.jpg" alt="Product Image" className="w-16 sm:w-20 hover:cursor-pointer object-cover" />
        </section>
        <section className="h-24 sm:h-32 w-24 sm:w-32 border border-gray-800/20 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-transform duration-300 flex justify-center items-center">
            {/* <DevicePhoneMobileIcon className="h-20 w-20" />            */}
            <img src="/images/plant.jpg" alt="Product Image" className="w-16 sm:w-20 hover:cursor-pointer object-cover" />
        </section>
        <section className="h-24 sm:h-32 w-24 sm:w-32 border border-gray-800/20 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-transform duration-300 flex justify-center items-center">
            {/* <DevicePhoneMobileIcon className="h-20 w-20" />            */}
            <img src="/images/chair.jpg" alt="Product Image" className="w-16 sm:w-20 hover:cursor-pointer object-cover" />

        </section>
        <section className="h-24 sm:h-32 w-24 sm:w-32 border border-gray-800/20 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-transform duration-300 flex justify-center items-center">
            {/* <DevicePhoneMobileIcon className="h-20 w-20" />            */}
            <img src="/images/machine.jpg" alt="Product Image" className="h-16 sm:h-24 hover:cursor-pointer object-cover" />
        </section>
        <section className="hidden md:flex md:h-32 w-24 md:w-32 border border-gray-800/20 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-transform duration-300 flex justify-center items-center">
            {/* <DevicePhoneMobileIcon className="h-20 w-20" />            */}
            <img src="/images/phone.jpg" alt="Product Image" className="h-16 sm:h-20 w-16 sm:w-20 hover:cursor-pointer object-cover" />
        </section>
        </div>
        
        </>

    )
}