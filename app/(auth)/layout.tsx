// app/(auth)/layout.tsx
import React from 'react';

// No Navbar or Footer import/render here

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Render only the content of the auth pages (sign-in, sign-up) */}
      {children}
    </>
  );
  // You might want a minimal container div here if needed, e.g.,
  // <div className="auth-container">{children}</div>
  // But often the page itself (like your sign-in page) provides the main layout structure.
}