import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NavLinks({ navLinks }) {
    const location = useLocation();

    return (
        <nav className="flex gap-4">
            {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                    <Link
                        key={link.title}
                        to={link.path}
                        className={`text-[10px] min-w-16 h-14 text-white flex flex-col justify-center items-center bg-[#1E1E1E] flex-1 ${
                            isActive ? 'border-2 border-white shadow-3xl' : ''
                        } px-3 py-[6px] rounded-md`}
                    >
                        {link.icon}
                        {link.title}
                    </Link>
                );
            })}
        </nav>
    );
}
