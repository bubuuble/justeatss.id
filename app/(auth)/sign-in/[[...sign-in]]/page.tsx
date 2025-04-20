// app/(auth)/sign-in/[[...sign-in]]/page.tsx
"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
    return (
        <div className="flex min-h-screen bg-black">
             {/* Left side */}
             <div className="hidden md:flex md:w-1/2 bg-zinc-900 flex-col justify-center items-center p-8 relative">
                 <div className="max-w-md text-center">
                     <Link href="/">
                         <img src="/assets/logo.png" alt="JustEatsss Logo" className="w-24 h-24 mx-auto mb-8 rounded-full" />
                     </Link>
                     <h2 className="text-3xl font-bold text-white mb-4">Welcome Back to Justeatss.id</h2>
                     <p className="text-zinc-400 mb-6">Log in to access your account, place orders, and explore our delicious selection of sweet and savory treats.</p>
                 </div>
             </div>
             {/* Right side */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-black">
                <div className="w-full max-w-md">
                    {/* No appearance prop needed here anymore! */}
                    <SignIn
                        path="/sign-in"
                        routing="path"
                        signUpUrl="/sign-up"
                    />
                </div>
            </div>
        </div>
    );
}