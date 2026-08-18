import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const CircleProduct = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAll = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:3001/category/getallp",
                {
                    method: "GET",
                }
            );

            const data = await response.json();

            console.log("API RESPONSE:", data);

            if (!response.ok) {
                toast.error(data.message || "Failed to fetch categories");
                return;
            }

            const fetchedCategories = data?.category || [];

            setCategories(fetchedCategories);

            console.log("Categories:", fetchedCategories);

        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAll();
    }, []);

    return (
        <>
            <div className="mx-4 sm:mx-6 lg:mx-8 border-b border-gray-800/20 bg-white flex items-center">
                <h2 className="text-lg sm:text-2xl font-black text-cyan-700 py-6">
                    Top Product
                </h2>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-12 lg:pb-16 pt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6">

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    categories.map((category) => (
                        <section
                            key={category._id}
                            className="h-24 sm:h-32 w-24 sm:w-32 border border-gray-800/20 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-transform duration-300 flex justify-center items-center overflow-hidden"
                        >
                            <img
                                src={category.image}
                                alt={category.name}
                                className="h-16 sm:h-20 w-16 sm:w-20 hover:cursor-pointer object-cover rounded-full"
                            />
                        </section>
                    ))
                )}

            </div>
        </>
    );
};