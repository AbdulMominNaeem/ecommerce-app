import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const getAll = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:3001/store/getallp",
                {
                    method: "GET",
                }
            );
            const data = await response.json();

            console.log("API RESPONSE:", data);

            if (!response.ok) {
                toast.error(data.message || "Failed to fetch products");
                return;
            }

            const fetchedProducts = data?.products || [];

            setProducts(fetchedProducts);

            console.log("Products:", fetchedProducts);

        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch products");
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
                    Featured Products
                </h2>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 2xl:grid-cols-5">

                {loading ? (
                    <p>Loading products...</p>
                ) : products.length === 0 ? (
                    <p>No items found.</p>
                ) : (
                    products.map((product) => (
                        <section
                            key={product._id || product.id}
                            className="h-70 border border-gray-800/20 bg-white rounded-2xl shadow-lg w-70 hover:scale-103 transition-transform duration-800"
                        >
                            <img
                                src={product.photo}
                                alt={product.name || "Product Image"}
                                className="w-full h-40 object-cover rounded-t-2xl"
                            />

                            <div className="p-4 flex flex-col gap-1 hover:cursor-pointer">
                                <p className="text-lg text-black">
                                    {product.title}
                                </p>

                                <p>
                                    ${product.description}
                                </p>
                                <div className=" flex  items-center ">
                                    <p>category:  </p>
                                    <img className="h-5 w-5 rounded-2xl" src={product?.category?.image} />

                                </div>
                            </div>
                        </section>
                    ))
                )}

            </div>
        </>
    );
};