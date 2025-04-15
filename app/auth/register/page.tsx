// app/auth/register/page.tsx // Ensure path is correct
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import { createClient } from "@/lib/supabase/client"; // Import Supabase client helper
import type { AuthError } from "@supabase/supabase-js"; // Import error type
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiPhone,
} from "react-icons/fi";

export default function RegisterPage() {
  // Rename if needed
  const router = useRouter(); // Initialize router
  const supabase = createClient(); // Initialize Supabase client

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for errors
  const [message, setMessage] = useState<string | null>(null); // State for messages
  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    // Basic validation for step 1
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("Please fill in First Name, Last Name, and Email.");
      return;
    }
    // Add email format validation if desired here
    setStep(2);
  };

  const prevStep = () => {
    setError(null); // Clear errors when going back
    setMessage(null);
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setMessage(null);

    // --- Frontend Validations ---
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (!formData.agreeToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }
    // --- End Frontend Validations ---

    setLoading(true);

    try {
      // --- Supabase SignUp Call ---
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email.trim(), // Trim email whitespace
        password: formData.password, // Password is sent directly
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`, // Or your confirmation callback route
        },
      });
      // --- End Supabase SignUp Call ---

      if (signUpError) {
        setError(signUpError.message); // Show Supabase error message
        throw signUpError; // Stop execution
      }

      // --- Handle SignUp Response ---
      if (data.user) {
        // Create a profile row in the database (optional)
        try {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: data.user.id,
              first_name: formData.firstName.trim(),
              last_name: formData.lastName.trim(),
              phone: formData.phone.trim() || null,
            });

          if (profileError) {
            console.error("Error creating profile:", profileError);
          }
        } catch (profileInsertError) {
          console.error("Exception creating profile:", profileInsertError);
        }
      }

      // Redirect to login page after successful registration
      setMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/auth/login"); // Redirect to login page
      }, 2000); // Optional delay for showing the success message
    } catch (err) {
      console.error("Registration process failed:", err);
      if (!error && err instanceof Error) {
        setError(
          err.message || "An unexpected error occurred during registration."
        );
      }
    } finally {
      setLoading(false);
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    }
  };

  // ----- Your Existing JSX Structure -----
  // (Make sure to add elements to display 'error' and 'message' states)
  // (Add disabled={loading} to interactive elements)

  return (
    <div className="flex min-h-screen bg-black">
      {/* Left side - Form area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <img
                src="/assets/logo.png"
                alt="JustEatsss Logo"
                className="h-16 w-16 mx-auto rounded-full"
              />
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">
              Create an Account
            </h1>
            <p className="text-zinc-400">
              Join JustEatsss for delicious treats delivered to your door
            </p>
          </div>

          {/* Display Messages/Errors */}
          {error && (
            <p className="mb-4 text-center text-red-500 bg-red-900 border border-red-700 p-3 rounded">
              {error}
            </p>
          )}
          {message && (
            <p className="mb-4 text-center text-green-500 bg-green-900 border border-green-700 p-3 rounded">
              {message}
            </p>
          )}

          {step === 1 ? (
            // --- Step 1 Form ---
            <form onSubmit={nextStep} className="space-y-5">
              {/* Fields with disabled={loading} */}
              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-zinc-300 mb-1"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <FiUser className="h-5 w-5 text-zinc-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      disabled={loading}
                      value={formData.firstName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-zinc-700 rounded-md bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent disabled:opacity-60"
                      placeholder="John"
                    />
                  </div>
                </div>
                {/* Last Name */}
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-zinc-300 mb-1"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <FiUser className="h-5 w-5 text-zinc-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      disabled={loading}
                      value={formData.lastName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-zinc-700 rounded-md bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent disabled:opacity-60"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-300 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="h-5 w-5 text-zinc-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={loading}
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-zinc-700 rounded-md bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent disabled:opacity-60"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-zinc-300 mb-1"
                >
                  Phone Number (optional)
                </label>
                <div className="relative">
                  <FiPhone className="h-5 w-5 text-zinc-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    disabled={loading}
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-zinc-700 rounded-md bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent disabled:opacity-60"
                    placeholder="+1 (xxx) xxx-xxxx"
                  />
                </div>
              </div>
              {/* Next Step Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-zinc-800 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-600 transition-colors ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Processing..." : "Continue"}
                </button>
              </div>
              {/* Sign in link */}
              <div className="text-center mt-6">
                <p className={`text-zinc-400 ${loading ? "opacity-60" : ""}`}>
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className={`text-white hover:underline ${
                      loading ? "pointer-events-none" : ""
                    }`}
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            // --- Step 2 Form ---
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Fields with disabled={loading} */}
              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-300 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <FiLock className="h-5 w-5 text-zinc-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={loading}
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-zinc-700 rounded-md bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent disabled:opacity-60"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    disabled={loading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:cursor-not-allowed"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-zinc-500" />
                    ) : (
                      <FiEye className="h-5 w-5 text-zinc-500" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-sm text-zinc-500">
                  Use at least 6 characters.
                </p>{" "}
                {/* Update hint if needed */}
              </div>
              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-zinc-300 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="h-5 w-5 text-zinc-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    disabled={loading}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-zinc-700 rounded-md bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent disabled:opacity-60"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    disabled={loading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:cursor-not-allowed"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-5 w-5 text-zinc-500" />
                    ) : (
                      <FiEye className="h-5 w-5 text-zinc-500" />
                    )}
                  </button>
                </div>
              </div>
              {/* Terms & Conditions */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    required
                    disabled={loading}
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-zinc-600 focus:ring-0 disabled:opacity-60"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="agreeToTerms"
                    className={`text-zinc-400 ${loading ? "opacity-60" : ""}`}
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className={`text-white hover:underline ${
                        loading ? "pointer-events-none" : ""
                      }`}
                    >
                      Terms
                    </Link>{" "}
                    /{" "}
                    <Link
                      href="/privacy"
                      className={`text-white hover:underline ${
                        loading ? "pointer-events-none" : ""
                      }`}
                    >
                      Privacy
                    </Link>
                  </label>
                </div>
              </div>
              {/* Back & Submit Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="submit"
                  disabled={loading || !formData.agreeToTerms}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-zinc-800 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-600 transition-colors ${
                    loading || !formData.agreeToTerms
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 border border-zinc-700 rounded-md shadow-sm text-white bg-transparent hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-600 transition-colors ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  Back
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right side - Image/Info area */}
      <div className="hidden lg:block lg:w-1/2 bg-zinc-900">
        <div className="h-full flex flex-col items-center justify-center p-12">
          <div className="max-w-lg text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Join Our Food Community
            </h2>

            {/* <div className="rounded-lg overflow-hidden mb-8">
              <img
              src="/assets/Choux.jpg"
              alt="Delicious food showcase"
              className="w-[250px] h-[250px] object-cover mx-auto"
              />
            </div> */}

            <div className="grid grid-cols-1 gap-6 mb-8">
              <div className="bg-zinc-800 p-5 rounded-lg text-left">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Member Benefits
                </h3>
                <ul className="space-y-2 text-zinc-300">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Exclusive member-only discounts</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Early access to new menu items</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Free delivery on orders over $30</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Save your favorite orders for quick reordering</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-zinc-800 p-5 rounded-lg">
              <blockquote className="italic text-zinc-300">
                "Justeatss has transformed my snacking experience. Their
                pastries are simply divine!"
              </blockquote>
              <p className="text-right mt-2 text-zinc-400">
                — Harsya, Food Enthusiast
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
