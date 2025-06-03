// app/components/AccountModal.tsx
"use client";

import React, { useState, useRef, useEffect, FormEvent, ChangeEvent } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { FiSettings, FiLogOut, FiX, FiUser, FiMail, FiLock, FiMapPin, FiCamera } from "react-icons/fi";
import Image from "next/image";
import ManageAddresses from "./ManageAddresses";

interface ProfileData {
  id: string;
  clerk_user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AccountModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialTab?: 'profile' | 'email' | 'password' | 'addresses';
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, setIsOpen, initialTab = 'profile' }) => {
  const { isLoaded, user } = useUser();
  const [activeTab, setActiveTab] = useState<'profile' | 'email' | 'password' | 'addresses'>(initialTab);
  
  // Profile data state
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');

  // Email change state
  const [newEmail, setNewEmail] = useState('');
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Profile image state
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch profile data when modal opens
  useEffect(() => {
    const fetchProfile = async () => {
      if (user && isOpen) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch('/api/profile');
          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'Failed to fetch profile');
          }
          const data: ProfileData = await response.json();
          setProfileData(data);
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setCurrentEmail(data.email || user.primaryEmailAddress?.emailAddress || '');
          setProfileImagePreview(data.profile_image_url || user.imageUrl);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (isLoaded && user && isOpen) {
      fetchProfile();
    }
  }, [isLoaded, user, isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab('profile');
      setError(null);
      setSuccessMessage(null);
      setIsVerifyingEmail(false);
      setNewEmail('');
      setEmailVerificationCode('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setProfileImageFile(null);
    }
  }, [isOpen]);

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to update profile');
      }
      const updatedProfile: ProfileData = await response.json();
      setProfileData(updatedProfile);
      setFirstName(updatedProfile.first_name || '');
      setLastName(updatedProfile.last_name || '');
      user.reload();
      setSuccessMessage('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProfileImageUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!profileImageFile || !user) return;
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await user.setProfileImage({ file: profileImageFile });
      await user.reload();

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileImageUrl: user.imageUrl }),
      });
      if (!response.ok) throw new Error('Failed to sync profile image URL to database.');
      const updatedData = await response.json();
      setProfileData(updatedData);
      setProfileImagePreview(updatedData.profile_image_url);
      setSuccessMessage('Profile picture updated!');
      setProfileImageFile(null);
    } catch (err: any) {
      console.error("Image Upload Error:", err);
      setError(err.message || 'Failed to upload profile image.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChangeRequest = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !newEmail) return;
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const existingEmail = user.emailAddresses.find(ea => ea.emailAddress === newEmail);
      if (existingEmail) {
        setError("This email address is already associated with your account.");
        setIsLoading(false);
        return;
      }

      const emailAddress = await user.createEmailAddress({ email: newEmail });
      await emailAddress.prepareVerification({ strategy: 'email_code' });
      setIsVerifyingEmail(true);
      setSuccessMessage(`Verification code sent to ${newEmail}.`);
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.longMessage || err.message || 'Failed to start email change process.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerification = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !emailVerificationCode) return;
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const emailAddress = user.emailAddresses.find(ea => ea.emailAddress === newEmail);
      if (!emailAddress) throw new Error("Could not find email to verify.");

      const updatedEmailAddress = await emailAddress.attemptVerification({ code: emailVerificationCode });

      if (updatedEmailAddress.verification?.status === 'verified') {
        await user.update({ primaryEmailAddressId: updatedEmailAddress.id });
        await user.reload();
        setCurrentEmail(newEmail);
        setNewEmail('');
        setEmailVerificationCode('');
        setIsVerifyingEmail(false);
        setSuccessMessage('Email address updated and verified successfully!');
      } else {
        throw new Error('Email verification failed. Code might be incorrect or expired.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.longMessage || err.message || 'Failed to verify email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !currentPassword || !newPassword) return;
    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (!user.passwordEnabled) {
      setError("Password authentication is not enabled for this account (e.g. social login).");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await user.updatePassword({
        currentPassword,
        newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setSuccessMessage('Password updated successfully!');
    } catch (err: any) {
      console.error(err);
      setError(err.errors?.[0]?.longMessage || err.message || 'Failed to update password.');    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>
        
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-xl sm:rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-2xl transition-all min-h-[90vh] sm:min-h-0 max-h-[95vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-zinc-200/50 dark:border-zinc-700/50 bg-gradient-to-r from-zinc-50/50 to-zinc-100/50 dark:from-zinc-800/50 dark:to-zinc-900/50 flex-shrink-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                      <FiUser className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-white">
                        Account Settings
                      </Dialog.Title>
                      <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">Manage your profile and preferences</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-xl transition-all duration-300 hover:rotate-90"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>                {/* Tab Navigation */}
                <div className="border-b border-zinc-200/50 dark:border-zinc-700/50 bg-zinc-100/30 dark:bg-zinc-800/30 flex-shrink-0">
                  <nav className="flex space-x-1 p-1 px-3 sm:px-6 overflow-x-auto scrollbar-hide">
                    {[
                      { id: 'profile', label: 'Profile', icon: FiUser },
                      { id: 'email', label: 'Email', icon: FiMail },
                      { id: 'password', label: 'Password', icon: FiLock },
                      { id: 'addresses', label: 'Addresses', icon: FiMapPin },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                          activeTab === tab.id
                            ? 'text-orange-400 bg-orange-500/10 border border-orange-500/20'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'
                        }`}
                      >
                        <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Alert Messages */}
                {error && (
                  <div className="m-3 sm:m-6 mb-0 bg-red-100/50 dark:bg-red-900/50 border border-red-300/50 dark:border-red-500/50 text-red-700 dark:text-red-200 px-3 sm:px-4 py-2 sm:py-3 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full mr-2 sm:mr-3"></div>
                      <span className="text-xs sm:text-sm">{error}</span>
                    </div>
                  </div>
                )}
                {successMessage && (
                  <div className="m-3 sm:m-6 mb-0 bg-green-100/50 dark:bg-green-900/50 border border-green-300/50 dark:border-green-500/50 text-green-700 dark:text-green-200 px-3 sm:px-4 py-2 sm:py-3 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mr-2 sm:mr-3"></div>
                      <span className="text-xs sm:text-sm">{successMessage}</span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-3 sm:p-6 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto flex-1">
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <div className="space-y-6">
                      {/* Profile Image Section */}
                      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 p-4 sm:p-6 bg-zinc-100/30 dark:bg-zinc-800/30 rounded-xl border border-zinc-200/30 dark:border-zinc-700/30">
                        <div className="relative group">
                          {profileImagePreview ? (
                            <Image 
                              src={profileImagePreview} 
                              alt="Profile" 
                              width={96} 
                              height={96} 
                              className="rounded-full w-20 h-20 sm:w-24 sm:h-24 object-cover ring-4 ring-orange-500/20 group-hover:ring-orange-500/40 transition-all duration-300" 
                            />
                          ) : (
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-800 rounded-full flex items-center justify-center text-zinc-600 dark:text-zinc-400 ring-4 ring-zinc-300/20 dark:ring-zinc-600/20">
                              <FiCamera className="text-xl sm:text-2xl" />
                            </div>
                          )}
                          <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-white text-xs font-medium">Change</span>
                          </div>
                        </div>
                        
                        <div className="flex-1 w-full">
                          <label htmlFor="profileImage" className="block text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Profile Picture</label>
                          <input
                            type="file"
                            id="profileImage"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            className="block w-full text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-orange-500/10 file:text-orange-400 hover:file:bg-orange-500/20 file:cursor-pointer cursor-pointer transition-all duration-300"
                          />
                          {profileImageFile && (
                            <button 
                              type="button" 
                              onClick={handleProfileImageUpload} 
                              disabled={isLoading} 
                              className="mt-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-green-500/25 text-xs sm:text-sm font-medium w-full sm:w-auto"
                            >
                              {isLoading ? (
                                <span className="flex items-center justify-center">
                                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                  Uploading...
                                </span>
                              ) : (
                                'Upload Picture'
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Profile Form */}
                      <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="firstName" className="block text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">First Name</label>
                            <input
                              type="text"
                              id="firstName"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-300/50 dark:border-zinc-600/50 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300 text-sm sm:text-base"
                              placeholder="Enter your first name"
                            />
                          </div>
                          <div>
                            <label htmlFor="lastName" className="block text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Last Name</label>
                            <input
                              type="text"
                              id="lastName"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-300/50 dark:border-zinc-600/50 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300 text-sm sm:text-base"
                              placeholder="Enter your last name"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Current Email</label>
                          <div className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-zinc-100/30 dark:bg-zinc-800/30 border border-zinc-300/30 dark:border-zinc-600/30 rounded-xl text-zinc-700 dark:text-zinc-300 flex items-center text-sm sm:text-base">
                            <FiMail className="text-orange-400 mr-2 flex-shrink-0" />
                            <span className="truncate">{currentEmail}</span>
                          </div>
                        </div>

                        <button 
                          type="submit" 
                          disabled={isLoading} 
                          className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-orange-500/25 font-medium text-sm sm:text-base"
                        >
                          {isLoading ? (
                            <span className="flex items-center justify-center">
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                              Saving Changes...
                            </span>
                          ) : (
                            'Save Profile Changes'
                          )}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Email Tab */}
                  {activeTab === 'email' && (
                    <div className="space-y-6">
                      {!isVerifyingEmail ? (
                        <form onSubmit={handleEmailChangeRequest} className="space-y-6">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Current Email</label>
                            <div className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-zinc-100/30 dark:bg-zinc-800/30 border border-zinc-300/30 dark:border-zinc-600/30 rounded-xl text-zinc-700 dark:text-zinc-300 flex items-center text-sm sm:text-base">
                              <FiMail className="text-orange-400 mr-2 flex-shrink-0" />
                              <span className="truncate">{currentEmail}</span>
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="newEmail" className="block text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">New Email Address</label>
                            <input
                              type="email"
                              id="newEmail"
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value)}
                              required
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-300/50 dark:border-zinc-600/50 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-sm sm:text-base"
                              placeholder="Enter new email address"
                            />
                          </div>
                          
                          <button 
                            type="submit" 
                            disabled={isLoading} 
                            className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-blue-500/25 font-medium text-sm sm:text-base"
                          >
                            {isLoading ? (
                              <span className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                Sending Code...
                              </span>
                            ) : (
                              'Send Verification Code'
                            )}
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleEmailVerification} className="space-y-6">
                          <div className="p-4 bg-blue-100/20 dark:bg-blue-900/20 border border-blue-300/30 dark:border-blue-500/30 rounded-xl">
                            <p className="text-sm text-blue-700 dark:text-blue-200">
                              <FiMail className="inline mr-2 text-blue-500 dark:text-blue-400" />
                              A verification code has been sent to <span className="font-medium text-zinc-900 dark:text-white">{newEmail}</span>
                            </p>
                          </div>
                          
                          <div>
                            <label htmlFor="emailVerificationCode" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Verification Code</label>
                            <input
                              type="text"
                              id="emailVerificationCode"
                              value={emailVerificationCode}
                              onChange={(e) => setEmailVerificationCode(e.target.value)}
                              required
                              className="w-full px-4 py-3 bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-300/50 dark:border-zinc-600/50 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-center tracking-widest"
                              placeholder="Enter 6-digit code"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <button 
                              type="submit" 
                              disabled={isLoading} 
                              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-green-500/25 font-medium"
                            >
                              {isLoading ? '⏳ Verifying...' : '✅ Verify'}
                            </button>
                            <button 
                              type="button" 
                              onClick={() => { 
                                setIsVerifyingEmail(false); 
                                setNewEmail(''); 
                                setEmailVerificationCode(''); 
                                setError(null); 
                              }} 
                              className="px-6 py-3 bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-400 dark:hover:bg-zinc-600 hover:text-zinc-800 dark:hover:text-white transition-all duration-300 font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}

                  {/* Password Tab */}
                  {activeTab === 'password' && (
                    <div className="space-y-6">
                      {user?.passwordEnabled ? (
                        <form onSubmit={handlePasswordChange} className="space-y-6">
                          <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Current Password</label>
                            <input
                              type="password"
                              id="currentPassword"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              required
                              className="w-full px-4 py-3 bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-300/50 dark:border-zinc-600/50 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
                              placeholder="Enter current password"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">New Password</label>
                            <input
                              type="password"
                              id="newPassword"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              required
                              className="w-full px-4 py-3 bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-300/50 dark:border-zinc-600/50 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
                              placeholder="Enter new password"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Confirm New Password</label>
                            <input
                              type="password"
                              id="confirmNewPassword"
                              value={confirmNewPassword}
                              onChange={(e) => setConfirmNewPassword(e.target.value)}
                              required
                              className="w-full px-4 py-3 bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-300/50 dark:border-zinc-600/50 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
                              placeholder="Confirm new password"
                            />
                          </div>
                          
                          <button 
                            type="submit" 
                            disabled={isLoading} 
                            className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-red-500/25 font-medium"
                          >
                            {isLoading ? (
                              <span className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                Updating Password...
                              </span>
                            ) : (
                              'Update Password'
                            )}
                          </button>
                        </form>
                      ) : (
                        <div className="text-center py-12">
                          <FiLock className="h-16 w-16 text-zinc-400 dark:text-zinc-600 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">Password Not Available</h3>
                          <p className="text-zinc-600 dark:text-zinc-400">Password authentication is not enabled for your account (social login).</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Addresses Tab */}
                  {activeTab === 'addresses' && (
                    <div>
                      <ManageAddresses />
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-zinc-200/50 dark:border-zinc-700/50 p-3 sm:p-6 bg-zinc-100/30 dark:bg-zinc-800/30 flex-shrink-0">
                  <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                    <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                      Signed in as <span className="text-zinc-900 dark:text-white font-medium">{currentEmail}</span>
                    </div>
                    <SignOutButton redirectUrl="/">
                      <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-xl transition-all duration-300 text-xs sm:text-sm">
                        <FiLogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Sign Out</span>
                      </button>
                    </SignOutButton>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AccountModal;