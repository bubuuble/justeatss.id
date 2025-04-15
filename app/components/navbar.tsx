"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    // Define routes where the Navbar should be hidden
    const excludedRoutes = ['/auth/login', '/auth/register', "dashboard"];

    // Check if the current route is in the excluded routes
    if (excludedRoutes.includes(pathname)) {
        return null;
    }

    return (
        <nav className="bg-black p-4 flex justify-between items-center">
            <div className="flex items-center">
                <img
                    alt="Logo"
                    className="rounded-full w-10 h-10"
                    src="/assets/logo.png"
                />
            </div>
            <ul className="flex space-x-6">
                <li>
                    <Link href="/" className="text-white">
                        Home
                    </Link>
                </li>
                <li>
                    <Link href="/pages/product" className="text-white">
                        Products
                    </Link>
                </li>
                <li>
                    <Link href="/pages/about" className="text-white">
                        About Us
                    </Link>
                </li>
            </ul>
            <Link href="/auth/login">
                <button className="bg-white text-black px-4 py-2 rounded">
                    Login
                </button>
            </Link>
        </nav>
    );
}