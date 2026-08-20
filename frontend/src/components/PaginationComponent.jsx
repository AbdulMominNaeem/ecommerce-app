import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

export const PaginationComponent = ({
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    onPageChange,
}) => {

    const pages = Array.from(
        { length: totalPages },
        (_, i) => i + 1
    );


    return (
        <div className="flex items-center justify-center">

            <div className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_8px_30px_rgba(15,23,42,0.08)]">

                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPrevPage}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-all hover:bg-slate-100 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-30"
                >
                    <ChevronLeft size={19} />
                </button>


                {/* PAGES */}

                <div className="hidden items-center gap-1 sm:flex">

                    {pages.map((page) => (

                        <button
                            key={page}
                            type="button"
                            onClick={() => onPageChange(page)}
                            className={`
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                text-sm
                                font-semibold
                                transition-all
                                duration-200

                                ${
                                    currentPage === page
                                        ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                                        : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-600"
                                }
                            `}
                        >
                            {page}
                        </button>

                    ))}

                </div>


                {/* MOBILE */}

                <div className="flex h-10 min-w-16 items-center justify-center px-2 sm:hidden">

                    <span className="text-sm font-semibold text-slate-700">
                        {currentPage} / {totalPages}
                    </span>

                </div>


                {/* NEXT */}

                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-all hover:bg-slate-100 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-30"
                >
                    <ChevronRight size={19} />
                </button>

            </div>

        </div>
    );
};