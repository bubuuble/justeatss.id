import Link from 'next/link';

export default function Navbar() {
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
            <button className="bg-white text-black px-4 py-2 rounded">
                Login
            </button>
        </nav>
    );
}