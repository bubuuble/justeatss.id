// app/account/page.tsx
'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
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
        // Option 1: Use Clerk's built-in method (easiest, Clerk handles storage or your configured external store)
        await user.setProfileImage({ file: profileImageFile });
        await user.reload(); // Reload user to get new imageUrl

        // Sync this new Clerk imageUrl to our Supabase `profile_image_url`
        const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profileImageUrl: user.imageUrl }),
        });
        if (!response.ok) throw new Error('Failed to sync profile image URL to database.');
        const updatedData = await response.json();
        setProfileData(updatedData);
        setProfileImagePreview(updatedData.profile_image_url);


        // --- OR ---
        // Option 2: Upload to your Supabase Storage & then update Clerk and your DB
        // This provides more control if you specifically want the file in YOUR Supabase bucket.

        // const filePath = `${user.id}/${profileImageFile.name}`;
        // const { data: uploadData, error: uploadError } = await supabase.storage
        //   .from('profile_pictures') // Your bucket name
        //   .upload(filePath, profileImageFile, {
        //     cacheControl: '3600',
        //     upsert: true, // Overwrite if exists
        //   });

        // if (uploadError) throw uploadError;

        // const { data: urlData } = supabase.storage
        //   .from('profile_pictures')
        //   .getPublicUrl(filePath);
        
        // const publicUrl = urlData.publicUrl;

        // // Update Supabase user_profiles and Clerk user
        // const response = await fetch('/api/profile', {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ profileImageUrl: publicUrl }),
        // });

        // if (!response.ok) {
        //     const errData = await response.json();
        //     throw new Error(errData.message || 'Failed to update profile image URL');
        // }
        // const updatedProfile: ProfileData = await response.json();
        // setProfileData(updatedProfile);
        // setProfileImagePreview(updatedProfile.profile_image_url);
        // await user.reload(); // Reload clerk user to reflect change if clerk was updated via API

        setSuccessMessage('Profile picture updated!');
        setProfileImageFile(null); // Reset file input

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
        await user.reload(); // refresh user data
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
    return <div className="container mx-auto p-4 text-center">Loading account details...</div>;
  }

  if (!isSignedIn) {
    return null; // Or a message, but redirect should handle it
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</p>}
      {successMessage && <p className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{successMessage}</p>}

      {/* Profile Information */}
      <section className="mb-8 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            {profileImagePreview ? (
                <Image src={profileImagePreview} alt="Profile" width={96} height={96} className="rounded-full w-24 h-24 object-cover" />
            ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">No Pic</div>
            )}
            <div>
                <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">Change Profile Picture</label>
                <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {profileImageFile && (
                    <button type="button" onClick={handleProfileImageUpload} disabled={isLoading} className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50">
                        {isLoading ? 'Uploading...' : 'Upload New Picture'}
                    </button>
                )}
            </div>
          </div>

          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <p className="mt-1 text-sm text-gray-900 p-2 bg-gray-50 rounded">{currentEmail}</p>
          </div>
          <button type="submit" disabled={isLoading} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
            {isLoading ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </section>

      {/* Change Email */}
      <section className="mb-8 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Change Email Address</h2>
        {!isVerifyingEmail ? (
            <form onSubmit={handleEmailChangeRequest} className="space-y-4">
                <div>
                    <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700">New Email Address</label>
                    <input
                    type="email"
                    id="newEmail"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <button type="submit" disabled={isLoading} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                    {isLoading ? 'Sending Code...' : 'Send Verification Code'}
                </button>
            </form>
        ) : (
            <form onSubmit={handleEmailVerification} className="space-y-4">
                <p className="text-sm text-gray-600">A verification code has been sent to {newEmail}. Please enter it below to confirm the change.</p>
                <div>
                    <label htmlFor="emailVerificationCode" className="block text-sm font-medium text-gray-700">Verification Code</label>
                    <input
                    type="text"
                    id="emailVerificationCode"
                    value={emailVerificationCode}
                    onChange={(e) => setEmailVerificationCode(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="flex space-x-2">
                    <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50">
                        {isLoading ? 'Verifying...' : 'Verify and Change Email'}
                    </button>
                    <button type="button" onClick={() => { setIsVerifyingEmail(false); setNewEmail(''); setEmailVerificationCode(''); setError(null); }} className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                        Cancel
                    </button>
                </div>
            </form>
        )}
      </section>

      {/* Change Password */}
      {user?.passwordEnabled && (
        <section className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
                <label htmlFor="currentPassword"className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="newPassword"className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="confirmNewPassword"className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                type="password"
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <button type="submit" disabled={isLoading} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                {isLoading ? 'Updating...' : 'Change Password'}
            </button>
            </form>        </section>
      )}

      {/* Address Management */}
      <section className="mb-8 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">My Addresses</h2>
        <ManageAddresses />
      </section>
    </div>
  );
}