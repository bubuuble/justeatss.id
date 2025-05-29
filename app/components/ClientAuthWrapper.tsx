// app/components/ClientAuthWrapper.tsx
"use client";

import React, { useState, useEffect } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

interface ClientAuthWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientSignedIn({ children, fallback }: ClientAuthWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{fallback}</>;
  }

  return <SignedIn>{children}</SignedIn>;
}

export function ClientSignedOut({ children, fallback }: ClientAuthWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{fallback}</>;
  }

  return <SignedOut>{children}</SignedOut>;
}
