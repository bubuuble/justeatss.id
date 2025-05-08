// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import type { Appearance } from '@clerk/types';
import { dark } from '@clerk/themes'; // <-- Import the light base theme
import './globals.css';
import React from 'react';
import { SanityLive } from '@/sanity/lib/live';

// Define your global appearance object here
const clerkAppearance: Appearance = {
  baseTheme: dark, // <-- SET THE BASE THEME TO LIGHT

  variables: {
    // You can still override specific variables on top of the light theme
    colorPrimary: '#6366F1', // Keep your primary brand color
    // Remove variables that were specifically for dark mode unless needed:
    // colorBackground: '#18181b', // Remove or adjust for light theme
    // colorText: 'white', // Remove, let base theme handle text color
    // colorInputText: 'white', // Remove
    // colorInputBackground: '#1f2937', // Remove
    // colorTextSecondary: '#a1a1aa', // Remove or adjust for light theme contrast
  },
  elements: {
    // Remove element overrides that forced dark mode styles.
    // Keep overrides you still want (like hiding the badge or specific button styles).

    // Example: Maybe keep card transparent if needed for SignIn/SignUp layout
    // card: {
    //     backgroundColor: 'transparent',
    //     boxShadow: 'none',
    //     border: 'none',
    // },

    // Adjust button styles if the default light theme isn't exactly right
    // For example, maybe you still want white text on your primary button:
    // formButtonPrimary: {
    //     backgroundColor: '#6366F1', // Uses colorPrimary
    //     color: '#ffffff', // Override text to white if needed for contrast
    //     // ... other button styles
    // },

    // Keep customizations unrelated to dark/light theme
    // 'REPLACE_WITH_CORRECT_USERNAME_FIELD_KEY': { /* ... username ::after rule ... */ },

    // Keep badge hidden
    clerkBadge: {
        display: 'none'
    },

    // Style the user button popover (it will inherit light theme, but you can refine)
    userButtonPopoverCard: {
        // Default light theme card is fine, but you could add custom shadow/border
        // boxShadow: '...',
        // border: '...'
    },
    // userButtonPopoverActionButton: { // Adjust if needed for light theme
    //     color: '#...', // Default text color from light theme
    //     '&:hover': {
    //        backgroundColor: 'rgba(0, 0, 0, 0.05)', // Example light hover
    //        color: '#...'
    //     }
    // },
  }
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
        <body className="bg-white text-black"> {/* Optional: Set base light theme for body */}
          {children}
          <SanityLive />
        </body>
      </html>
    </ClerkProvider>
  );
}