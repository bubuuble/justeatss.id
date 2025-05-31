// app/account/page_full_backup.tsx - Original Full Account Page (Before Modal Transformation)
'use client';

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ManageAddresses from '../../components/ManageAddresses';

interface ProfileData {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null; // From Clerk, added by API
  profile_image_url: string | null;
}

export default function AccountPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentEmail, setCurrentEmail] = useState(''); // For display

  const [newEmail, setNewEmail] = useState('');
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in'); // Redirect if not signed in
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
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

    if (isLoaded && isSignedIn) {
      fetchProfile();
    }
  }, [isLoaded, isSignedIn, user]);

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
      // Clerk user object might take a moment to refresh, or force refresh if needed
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
      setError(err.errors?.[0]?.longMessage || err.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-slate-900 to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400 text-lg">Loading account details...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-slate-900 to-zinc-900">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Hero Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-3">
            My Account
          </h1>
          <p className="text-zinc-400 text-xl">Manage your profile, security, and preferences</p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl backdrop-blur-sm mb-8 shadow-lg max-w-4xl mx-auto">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
              {error}
            </div>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-900/50 border border-green-500/50 text-green-200 px-6 py-4 rounded-xl backdrop-blur-sm mb-8 shadow-lg max-w-4xl mx-auto">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              {successMessage}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
          
          {/* Profile Information */}
          <section className="bg-zinc-800/40 backdrop-blur-xl border border-zinc-700/50 p-8 rounded-2xl shadow-2xl hover:border-orange-500/30 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full mr-4"></div>
              <h2 className="text-2xl font-semibold text-white">Profile Information</h2>
            </div>
            
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              {/* Profile Image Section */}
              <div className="flex items-center space-x-6 p-6 bg-zinc-900/50 rounded-xl border border-zinc-700/30">
                <div className="relative group">
                  {profileImagePreview ? (
                    <Image 
                      src={profileImagePreview} 
                      alt="Profile" 
                      width={96} 
                      height={96} 
                      className="rounded-full w-24 h-24 object-cover ring-4 ring-orange-500/20 group-hover:ring-orange-500/40 transition-all duration-300" 
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-full flex items-center justify-center text-zinc-400 ring-4 ring-zinc-600/20">
                      <span className="text-2xl">👤</span>
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-xs font-medium">Change</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <label htmlFor="profileImage" className="block text-sm font-medium text-zinc-300 mb-2">Profile Picture</label>
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-500/10 file:text-orange-400 hover:file:bg-orange-500/20 file:cursor-pointer cursor-pointer transition-all duration-300"
                  />
                  {profileImageFile && (
                    <button 
                      type="button" 
                      onClick={handleProfileImageUpload} 
                      disabled={isLoading} 
                      className="mt-3 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-green-500/25 text-sm font-medium"
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Uploading...
                        </span>
                      ) : (
                        'Upload Picture'
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-zinc-300 mb-2">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-zinc-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              {/* Email Display */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
                <div className="w-full px-4 py-3 bg-zinc-900/30 border border-zinc-600/30 rounded-xl text-zinc-300 flex items-center">
                  <span className="text-orange-400 mr-2">📧</span>
                  {currentEmail}
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-orange-500/25 font-medium"
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
          </section>

          {/* Change Email */}
          <section className="bg-zinc-800/40 backdrop-blur-xl border border-zinc-700/50 p-8 rounded-2xl shadow-2xl hover:border-orange-500/30 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full mr-4"></div>
              <h2 className="text-2xl font-semibold text-white">Change Email</h2>
            </div>
            
            {!isVerifyingEmail ? (
              <form onSubmit={handleEmailChangeRequest} className="space-y-6">
                <div>
                  <label htmlFor="newEmail" className="block text-sm font-medium text-zinc-300 mb-2">New Email Address</label>
                  <input
                    type="email"
                    id="newEmail"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                    placeholder="Enter new email address"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-blue-500/25 font-medium"
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
                <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                  <p className="text-sm text-blue-200">
                    <span className="text-blue-400">📨</span> A verification code has been sent to <span className="font-medium text-white">{newEmail}</span>
                  </p>
                </div>
                <div>
                  <label htmlFor="emailVerificationCode" className="block text-sm font-medium text-zinc-300 mb-2">Verification Code</label>
                  <input
                    type="text"
                    id="emailVerificationCode"
                    value={emailVerificationCode}
                    onChange={(e) => setEmailVerificationCode(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-center tracking-widest"
                    placeholder="Enter 6-digit code"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-green-500/25 font-medium"
                  >
                    {isLoading ? '⏳' : '✅ Verify'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setIsVerifyingEmail(false); setNewEmail(''); setEmailVerificationCode(''); setError(null); }} 
                    className="px-6 py-3 bg-zinc-700 text-zinc-300 rounded-xl hover:bg-zinc-600 hover:text-white transition-all duration-300 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>

        {/* Full Width Sections */}
        <div className="space-y-8 mt-12 max-w-6xl mx-auto">
          
          {/* Change Password */}
          {user?.passwordEnabled && (
            <section className="bg-zinc-800/40 backdrop-blur-xl border border-zinc-700/50 p-8 rounded-2xl shadow-2xl hover:border-orange-500/30 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-red-400 to-red-600 rounded-full mr-4"></div>
                <h2 className="text-2xl font-semibold text-white">Change Password</h2>
              </div>
              
              <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-zinc-300 mb-2">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-zinc-300 mb-2">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-zinc-300 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="md:col-span-3">
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
                      '🔒 Change Password'
                    )}
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* Address Management */}
          <section className="bg-zinc-800/40 backdrop-blur-xl border border-zinc-700/50 p-8 rounded-2xl shadow-2xl hover:border-orange-500/30 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full mr-4"></div>
              <h2 className="text-2xl font-semibold text-white">My Addresses</h2>
            </div>
            <ManageAddresses />
          </section>
        </div>
      </div>
    </div>
  );
}
