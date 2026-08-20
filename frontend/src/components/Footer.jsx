import { Mail, MapPin, MessagesSquare, Phone } from "lucide-react";
import React from "react";

export const Footer = () => {
    return (
        <footer className="bg-slate-950 text-white">

            {/* Main Footer */}
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">

                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

                    {/* Brand / Contact */}
                    <div>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold tracking-tight">
                                Mega<span className="text-cyan-400">Mart</span>
                            </h2>

                            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
                                Your trusted destination for quality products,
                                great prices, and a seamless shopping experience.
                            </p>
                        </div>

                        <div className="space-y-4">

                            {/* WhatsApp */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                                    <MessagesSquare size={19} />
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        WhatsApp
                                    </p>
                                    <p className="text-sm font-medium text-slate-200">
                                        +92 300 1234567
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                                    <Phone size={19} />
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Call Us
                                    </p>
                                    <p className="text-sm font-medium text-slate-200">
                                        +92 300 1234567
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Popular Items */}
                    <div>
                        <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.15em] text-white">
                            Popular Items
                        </h3>

                        <ul className="space-y-3">
                            {[
                                "Mobile Phones",
                                "Laptops",
                                "Watches",
                                "Shoes",
                            ].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-sm text-slate-400 transition-colors duration-200 hover:text-cyan-400"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Services */}
                    <div>
                        <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.15em] text-white">
                            Customer Service
                        </h3>

                        <ul className="space-y-3">
                            {[
                                "Contact Us",
                                "Return Policy",
                                "Shipping Policy",
                                "Privacy Policy",
                            ].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-sm text-slate-400 transition-colors duration-200 hover:text-cyan-400"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.15em] text-white">
                            Stay Updated
                        </h3>

                        <p className="mb-5 text-sm leading-6 text-slate-400">
                            Subscribe to receive updates about new products,
                            exclusive offers, and promotions.
                        </p>

                        <div className="flex overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

                            <div className="flex items-center pl-3 text-slate-500">
                                <Mail size={18} />
                            </div>

                            <input
                                type="email"
                                placeholder="Your email"
                                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600"
                            />

                            <button
                                className="bg-cyan-500 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                            >
                                Subscribe
                            </button>

                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800">

                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:px-6 md:flex-row lg:px-8">

                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} MegaMart. All rights reserved.
                    </p>

                    <div className="flex items-center gap-5 text-xs text-slate-500">
                        <a
                            href="#"
                            className="transition hover:text-cyan-400"
                        >
                            Privacy
                        </a>

                        <a
                            href="#"
                            className="transition hover:text-cyan-400"
                        >
                            Terms
                        </a>

                        <a
                            href="#"
                            className="transition hover:text-cyan-400"
                        >
                            Support
                        </a>
                    </div>

                </div>
            </div>

        </footer>
    );
};