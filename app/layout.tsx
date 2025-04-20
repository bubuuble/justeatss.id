// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import type { Appearance } from '@clerk/types';
import './globals.css';
import React from 'react';
import { SanityLive } from '@/sanity/lib/live';

const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: '#6366F1',
    colorBackground: '#18181b',
    colorText: 'white',
    colorInputText: 'white',
    colorInputBackground: '#1f2937',
    colorTextSecondary: '#a1a1aa',
    colorShimmer: 'rgba(255,255,255,0.1)',
  },
  elements: {
    // --- Global & Navigation ---
    profileSectionPrimaryButton: {
      color: 'white',
      '&:hover': { color: '#d4d4d8' },
    },
    profileSectionSecondaryButton: {
      color: 'white',
      '&:hover': { color: '#d4d4d8' },
    },
    navbarItem: {
      color: '#a1a1aa',
      '&:hover': { backgroundColor: '#27272a', color: 'white' },
    },
    navbarItem__active: {
      backgroundColor: '#3f3f46',
      color: 'white',
      fontWeight: '600',
    },
    connectedAccountLinkButton: {
      color: 'white',
      '&:hover': { color: '#d4d4d8' },
    },
    iconButton: {
      color: '#a1a1aa',
      '&:hover': { color: 'white', backgroundColor: '#27272a' },
    },
    linkButton: {
      color: 'white',
      '&:hover': { textDecoration: 'underline', color: '#d4d4d8' },
    },

    // --- Card & Headers ---
    card: {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      border: 'none',
    },
    headerTitle: {
      color: 'white',
      fontSize: '1.875rem',
      fontWeight: '700',
    },
    headerSubtitle: {
      color: '#a1a1aa',
      marginBottom: '2rem',
    },
    dividerLine: {
      backgroundColor: '#3f3f46',
    },
    dividerText: {
      color: '#a1a1aa',
    },

    // --- Form Fields ---
    formFieldLabel: {
      color: 'white',
      fontSize: '0.875rem',
      fontWeight: '500',
      marginBottom: '0.5rem',
    },
    formFieldInput: {
      backgroundColor: '#1f2937',
      borderColor: '#3f3f46',
      borderRadius: '0.375rem',
      color: 'white',
    },

    // --- Buttons ---
    formButtonPrimary: {
      backgroundColor: '#ffffff',
      color: '#000000',
      paddingTop: '0.75rem',
      paddingBottom: '0.75rem',
      borderRadius: '0.375rem',
      fontWeight: '600',
      textTransform: 'none',
      '&:hover': { backgroundColor: '#f0f0f0' },
    },
    socialButtonsBlockButton: {
      backgroundColor: '#ffffff',
      color: '#000000',
      borderColor: '#e5e7eb',
      '&:hover': { backgroundColor: '#f0f0f0' },
    },
    socialButtonsBlockButtonText: {
      color: '#000000',
    },

    // --- Footer & Badges ---
    clerkBadge: {
      display: 'none',
    },
    footerActionText: {
      color: '#a1a1aa',
    },
    footerActionLink: {
      color: '#818cf8',
      fontWeight: '600',
      '&:hover': {
        textDecoration: 'underline',
        color: '#a7a7f8',
      },
    },

    // --- User Button Popover ---
    userButtonPopoverCard: {
      backgroundColor: '#18181b',
      boxShadow:
        '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      borderRadius: '0.5rem',
      border: '1px solid #3f3f46',
    },
    userButtonPopoverActionButton: {
      color: '#a8a8a8',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: '#ffffff',
      },
    },
    userButtonPopoverActionButton__manageAccount: {},
    userButtonPopoverActionButton__signOut: {},
    userButtonPopoverFooter: {},

    // --- Primary Badge Fix ---
    badge: {
      backgroundColor: '#3f3f46',
      color: 'white',
      fontWeight: '500',
    },
  },
};

export const metadata = {
  title: 'Justeatss.id',
  description: 'Your favorite sweet and savory treats.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en">
        <body className="bg-black">
          {children}
          <SanityLive />
        </body>
      </html>
    </ClerkProvider>
  );
}
