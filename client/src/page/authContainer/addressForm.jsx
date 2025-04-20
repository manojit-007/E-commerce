import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateAddress } from '@/redux-store/auth/authThunkFunctions';
import { toastMessage } from '@/utils/tostMessage';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

const AddressForm = ({ user, onUpdate }) => {
    const dispatch = useDispatch();
    const [address, setAddress] = useState({
      street: user.address?.street || "",
      city: user.address?.city || "",
      state: user.address?.state || "",
      zip: user.address?.zip || "",
    });

    const handleChange = (e) => {
      const { id, value } = e.target;
      setAddress((prev) => ({
        ...prev,
        [id]: value,
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Wait for the response from dispatch
        const response = await dispatch(updateAddress(address));
        // Handle success or failure based on the response structure
        if (response?.payload?.success) {
          toastMessage("success", "Address updated successfully!");
          if (onUpdate) onUpdate(response.data.address); // Call onUpdate if defined
        } else {
          toastMessage("error", response?.message || "Failed to update address");
        }
      } catch (error) {
        toastMessage("error", error.message || "Something went wrong");
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        {["street", "city", "state", "zip"].map((field) => (
          <div className="mb-4" key={field}>
            <label htmlFor={field} className="block text-gray-700 mb-2 capitalize">
              {field}
            </label>
            <Input
              id={field}
              type="text"
              placeholder={field}
              value={address[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600">
          Update Address
        </Button>
      </form>
    );
};

export default AddressForm;
