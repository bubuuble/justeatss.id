// app/components/ManageAddresses.tsx
"use client";

import React, { useState, useEffect, FormEvent } from 'react';

// Optional: Loading spinner component
const LoadingSpinner = () => (
  <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
);

// Interface for the Address data type
interface Address {
  id: string;
  user_id: string;
  street_address: string;
  city: string;
  state_province?: string | null;
  postal_code: string;
  country: string;
  phone_number?: string | null;
  is_default?: boolean | null;
  created_at: string;
}

// Type for form mode
type FormMode = 'add' | 'edit' | null;

// --- The Main Component ---
export default function ManageAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Form State ---
  const [formMode, setFormMode] = useState<FormMode>(null); // null, 'add', or 'edit'
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null); // Track which ID is being edited
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateProv, setStateProv] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null); // Track deleting state

  
  // --- Fetch initial addresses ---
  useEffect(() => {
    fetchAddresses();
    
  }, []);

  // --- Helper Functions ---
  const fetchAddresses = async () => {
    setError(null);
    try {
      const response = await fetch('/api/addresses');
      if (!response.ok) {
        throw new Error(`Failed to fetch addresses: ${response.statusText}`);
      }
      const data: Address[] = await response.json();
      setAddresses(data); // Update state with fetched addresses
    } catch (err: any) {
      setError(err.message || 'Could not load addresses.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStreet(''); setCity(''); setStateProv(''); setPostalCode('');
    setCountry(''); setPhoneNumber(''); setIsDefault(false); setFormError(null);
    setEditingAddressId(null); setFormMode(null); // Reset mode and editing ID
  };

  const handleShowAddForm = () => {
    resetForm(); // Clear any previous edit state
    setFormMode('add');
  };

  const handleShowEditForm = (addr: Address) => {
    setFormMode('edit');
    setEditingAddressId(addr.id);
    // Pre-populate form
    setStreet(addr.street_address);
    setCity(addr.city);
    setStateProv(addr.state_province || '');
    setPostalCode(addr.postal_code);
    setCountry(addr.country);
    setPhoneNumber(addr.phone_number || '');
    setIsDefault(addr.is_default || false);
    setFormError(null);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const url = '/api/addresses';
    const method = formMode === 'edit' ? 'PUT' : 'POST';
    const bodyPayload: any = {
      street_address: street, city, state_province: stateProv || null,
      postal_code: postalCode, country, phone_number: phoneNumber || null, is_default: isDefault,
    };

    // Include ID only for PUT requests
    if (formMode === 'edit' && editingAddressId) {
      bodyPayload.id = editingAddressId;
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${formMode} address: ${response.statusText}`);
      }

      // Success!
      resetForm(); // Hide form and clear fields
      await fetchAddresses(); // Refresh list

    } catch (err: any) {
      setFormError(err.message || `Could not ${formMode} address.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    setDeletingId(addressId); // Indicate loading for this specific address
    setError(null);
    try {
      const response = await fetch(`/api/addresses`, { // Sending ID in body
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: addressId })
       });

      if (!response.ok && response.status !== 204) { // 204 No Content is success for DELETE
         const errorData = await response.json().catch(() => ({}));
         throw new Error(errorData.message || `Failed to delete address: ${response.statusText}`);
      }

      // Success!
      await fetchAddresses(); // Refresh list

    } catch (err:any) {
       setError("Error deleting address: " + err.message);
    } finally {
        setDeletingId(null); // Clear deleting state
    }
  };


  // --- Render Logic ---
  if (isLoading) return <div className="text-center p-4 text-zinc-400">Loading addresses...</div>;

  return (
    <div className="space-y-4 text-sm">
      {error && <div className="p-3 rounded bg-red-800 text-red-100 text-xs">{error}</div>}

      {/* --- Display Existing Addresses --- */}
      <div className="space-y-3">
        {addresses.length === 0 && formMode !== 'add' && (
          <p className="text-zinc-500 italic text-xs">You haven't added any addresses yet.</p>
        )}
        {addresses.map((addr) => (
          // Show address card OR the edit form if this address is being edited
          editingAddressId === addr.id ? (
              <AddressForm key={`form-${addr.id}`} isEditing={true} /> // Render form in edit mode
          ) : (
            <div key={addr.id} className="bg-zinc-800 p-3 rounded-md shadow flex justify-between items-start gap-2">
              {/* Address details */}
              <div className="flex-grow">
                <p className="font-medium text-zinc-100">{addr.street_address}</p>
                <p className="text-zinc-300">{addr.city}, {addr.state_province ? `${addr.state_province}, ` : ''}{addr.postal_code}</p>
                <p className="text-zinc-300">{addr.country}</p>
                {addr.phone_number && (
                  <p className="text-zinc-400 text-xs mt-1">Phone: {addr.phone_number}</p>
                )}
                {addr.is_default && <span className="mt-1 inline-block bg-zinc-600 text-white text-xs px-1.5 py-0.5 rounded-sm">Default</span>}
              </div>
              {/* Edit/Delete buttons */}
              <div className="flex flex-col space-y-1 items-end flex-shrink-0 text-xs">
                 <button onClick={() => handleShowEditForm(addr)} className="text-indigo-400 hover:text-indigo-300 hover:underline disabled:opacity-50" disabled={!!deletingId}>Edit</button>
                 <button onClick={() => handleDelete(addr.id)} className="text-red-500 hover:text-red-400 hover:underline disabled:opacity-50" disabled={deletingId === addr.id || !!editingAddressId}>
                    {deletingId === addr.id ? <LoadingSpinner/> : 'Delete'}
                 </button>
              </div>
            </div>
          )
        ))}
      </div>

      {/* --- Add/Edit Form Section --- */}
      {formMode === 'add' && <AddressForm isEditing={false} />}

      {/* --- Add New Address Button --- */}
      {formMode === null && ( // Only show button if no form is active
          <button
            onClick={handleShowAddForm}
            className="mt-4 w-full bg-zinc-700 text-zinc-100 px-4 py-2 rounded text-sm font-medium hover:bg-zinc-600 transition-colors"
          >
            + Add New Address
          </button>
       )}
    </div>
  );

  // --- Separate Form Component (for reuse between Add/Edit) ---
  function AddressForm({ isEditing }: { isEditing: boolean }) {
    return (
       <form onSubmit={handleFormSubmit} className="mt-4 bg-zinc-800/50 p-4 rounded-lg border border-zinc-700 space-y-3">
          <h3 className="text-base font-semibold text-white mb-2">{isEditing ? 'Edit Address' : 'Add New Address'}</h3>
          {formError && <p className="text-red-400 text-xs -mt-2 mb-2">{formError}</p>}

          {/* Street */}
          <div>
            <label htmlFor="street" className="block text-xs font-medium text-zinc-300 mb-1">Street Address *</label>
            <input type="text" id="street" value={street} onChange={(e) => setStreet(e.target.value)} required className="w-full px-2 py-1.5 rounded text-sm bg-zinc-700 border border-zinc-600 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
          </div>
          {/* City / State */}
          <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="city" className="block text-xs font-medium text-zinc-300 mb-1">City *</label>
                <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} required className="w-full px-2 py-1.5 rounded text-sm bg-zinc-700 border border-zinc-600 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
              </div>
              <div>
                <label htmlFor="stateProv" className="block text-xs font-medium text-zinc-300 mb-1">State / Province</label>
                <input type="text" id="stateProv" value={stateProv} onChange={(e) => setStateProv(e.target.value)} className="w-full px-2 py-1.5 rounded text-sm bg-zinc-700 border border-zinc-600 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
              </div>
          </div>
           {/* Postal / Country */}
           <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="postalCode" className="block text-xs font-medium text-zinc-300 mb-1">Postal Code *</label>
                <input type="text" id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required className="w-full px-2 py-1.5 rounded text-sm bg-zinc-700 border border-zinc-600 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
              </div>
              <div>
                <label htmlFor="country" className="block text-xs font-medium text-zinc-300 mb-1">Country *</label>
                <input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} required className="w-full px-2 py-1.5 rounded text-sm bg-zinc-700 border border-zinc-600 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
              </div>
          </div>
          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-xs font-medium text-zinc-300 mb-1">Phone Number</label>
            <input
              type="Phone"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-2 py-1.5 rounded text-sm bg-zinc-700 border border-zinc-600 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. +1 555-123-4567"
            />
          </div>
          {/* Default Checkbox */}
          <div className="flex items-center pt-1">
              <input type="checkbox" id="isDefault" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="h-4 w-4 rounded border-zinc-600 bg-zinc-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-800"/>
              <label htmlFor="isDefault" className="ml-2 block text-xs text-zinc-300">Set as default shipping address</label>
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
             <button
                type="button"
                onClick={resetForm} // Use resetForm to cancel add or edit
                disabled={isSubmitting}
                className="px-3 py-1.5 border border-zinc-600 rounded text-xs text-zinc-300 hover:bg-zinc-700 disabled:opacity-50"
            >
                Cancel
             </button>
             <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded text-xs text-white font-semibold disabled:opacity-50 flex items-center"
            >
                {isSubmitting && <LoadingSpinner />}
                {isSubmitting ? 'Saving...' : (isEditing ? 'Update Address' : 'Save Address')}
             </button>
          </div>
        </form>
        
    );
  } // End of AddressForm component

} // End of ManageAddresses component