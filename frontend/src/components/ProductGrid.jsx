import React from "react";

export const ProductGrid = () => {
    return (
        <>
        <div className="mx-4 sm:mx-6 lg:mx-8 border-b border-gray-800/20 bg-white flex items-center">
            <h2 className="text-lg sm:text-2xl font-black text-cyan-700 py-6">Featured Products</h2>
        </div>
        <div className="px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 2xl:grid-cols-5">

        <section className="h-70 border border-gray-800/20 bg-white rounded-2xl shadow-lg w-70 hover:scale-103 transition-transform duration-800">
        <img src="/images/images (1).jpg" alt="Product Image" className="w-full h-40 object-cover rounded-t-2xl" />
            <div className="p-4 flex flex-col gap-1 hover:cursor-pointer">
                <p className=" text-lg text-black">Galaxy S22 Ultra</p>
                <p>$1,199.99</p>
            </div>

            
        </section>
        <section className="h-70 border border-gray-800/20 bg-white rounded-2xl shadow-lg w-70 hover:scale-103 transition-transform duration-800">
        <img src="/images/images (1).jpg" alt="Product Image" className="w-full h-40 object-cover rounded-t-2xl" />
            <div className="p-4 flex flex-col gap-1 hover:cursor-pointer ">
                <p className=" text-lg text-black">Galaxy S22 Ultra</p>
                <p>$1,199.99</p>
            </div>

            
        </section>
        
         <section className="h-70 border border-gray-800/20 bg-white rounded-2xl shadow-lg w-70 hover:scale-103 transition-transform duration-800">
        <img src="/images/images (1).jpg" alt="Product Image" className="w-full h-40 object-cover rounded-t-2xl" />
            <div className="p-4 flex flex-col gap-1 hover:cursor-pointer">
                <p className=" text-xl text-black">Galaxy S22 Ultra</p>
                <p>$1,199.99</p>
            </div>

            
        </section>
         <section className="h-70 border border-gray-800/20 bg-white rounded-2xl shadow-lg w-70 hover:scale-103 transition-transform duration-800">
        <img src="/images/images (1).jpg" alt="Product Image" className="w-full h-40 object-cover rounded-t-2xl" />
            <div className="p-4 flex flex-col gap-1 hover:cursor-pointer">
                <p className=" text-lg text-black">Galaxy S22 Ultra</p>
                <p>$1,199.99</p>
            </div>

            
        </section>
         <section className="h-70 border border-gray-800/20 bg-white rounded-2xl shadow-lg w-70 hover:scale-103 transition-transform duration-800">
        <img src="/images/images (1).jpg" alt="Product Image" className="w-full h-40 object-cover rounded-t-2xl" />
            <div className="p-4 flex flex-col gap-1 hover:cursor-pointer">
                <p className=" text-lg text-black">Galaxy S22 Ultra</p>
                <p>$1,199.99</p>
            </div>

            
        </section>
        </div>
        
        </>

    )
}