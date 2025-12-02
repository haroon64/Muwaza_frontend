"use client";
import { useState, useEffect } from 'react';
import { 
  User, CreditCard, Camera, Phone, MapPin, Edit2, Plus, 
  Calendar, Clock, Users, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/hooks/useauth';
import { number } from 'framer-motion';
import { notificationService } from "@/service/NotificationService";
import { useRouter } from 'next/router';

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface CustomerForm {
  full_name: string;
  phone_number: string;
  gender: string;
  address: string;
  latitude: string;
  longitude: string;
  user_id: number | undefined;
  profile_image: string;
}

interface FormErrors {
  full_name?: string;
  phone_number?: string;
  gender?: string;
  address?: string;
  profile_image?: string;
}

const CustomerProfileSettings = () => {
  const user = useAuth(); // { user_id }

  const [isEditing, setIsEditing] = useState(false);
  const [creatingProfile, setCreatingProfile] = useState<boolean | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [errors, setErrors] = useState<FormErrors>({});
  const [created ,setCreated] = useState(false);
  const [updated,setUpdated] = useState(false);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState("") ;

  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  // ---------- FORM DATA ----------
  const [customerForm, setCustomerForm] = useState<CustomerForm>({
    full_name: "",
    phone_number: "",
    gender: "",
    address: "",
    latitude: "",
    longitude: "",
    user_id: undefined,
    profile_image: ""
  });

  useEffect(() => {
    if (user?.user_id) {
      setUserId(user.user_id);
    }
  }, [user?.user_id]);

 
  useEffect(() => {
   
    if (!user?.user_id) return;
    console.log("user id exists");

    const checkProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://127.0.0.1:3300/api/v1/customer/customer_profiles/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        console.log("Profile exists:", data.exists);
        if (data.exists === true) {
          const prof = data.profile || {};

          setCustomerForm((prev) => ({
            ...prev,
            full_name: prof.full_name ?? prev.full_name,
            phone_number: prof.phone_number ?? prev.phone_number,
            gender: prof.gender ?? prev.gender,
            address: prof.address ?? prev.address,
            latitude: prof.latitude ?? prev.latitude,
            longitude: prof.longitude ?? prev.longitude,
            profile_image: prof.profile_image ?? prev.profile_image,
          }));
          console.log("Fetched profile data:", prof);
          // If backend returned an image URL, use it as the preview
          if (prof.profile_image) {
            setProfilePreview(prof.profile_image);
          }

          // Clear any selected File object since we only have a URL
          setProfileImage(null);
        }

        setCreatingProfile(data.exists); // true if exists
        setLoadingProfile(false);

        setCustomerForm((prev) => ({
          ...prev,
          user_id: userId,
        }));
      } catch (error) {
        notificationService.notify({ message: error, type: "error" });
        console.error("Profile check error:", error);
      }
    };

    checkProfile();
  }, [userId, created,updated]);

 
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full Name validation
    if (!customerForm.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    } else if (customerForm.full_name.trim().length < 2) {
      newErrors.full_name = "Full name must be at least 2 characters";
    }
    // Phone Number validation
    if (!customerForm.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^\+?[\d\s\-()]+$/.test(customerForm.phone_number)) {
      newErrors.phone_number = "Please enter a valid phone number";
    } else if (customerForm.phone_number.replace(/\D/g, '').length < 10) {
      newErrors.phone_number = "Phone number must be at least 10 digits";
    }
    // Gender validation
    if (!customerForm.gender) {
      newErrors.gender = "Please select a gender";
    }
    // Address validation
    if (!customerForm.address.trim()) {
      newErrors.address = "Address is required";
    } else if (customerForm.address.trim().length < 5) {
      newErrors.address = "Please enter a complete address";
    }
    // Latitude and Longitude validation (should be set when address is selected)
    if (!profilePreview){
      newErrors.profile_image = "Profile image is required";
    }
    if (!customerForm.latitude || !customerForm.longitude) {
      newErrors.address = "Please select an address from the dropdown suggestions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
  
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, profile_image: "Please select a valid image file" }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, profile_image: "Image size must be less than 5MB" }));
      return;
    }

    // Clear any previous image error
    setErrors(prev => {
      const { profile_image, ...rest } = prev;
      return rest;
    });

    setProfileImage(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setProfilePreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddressChange = async (e: any) => {
    const query = e.target.value;
    setCustomerForm((prev) => ({ ...prev, address: query, latitude: "", longitude: "" }));
    
    // Clear address error when user starts typing
    if (errors.address) {
      setErrors(prev => {
        const { address, ...rest } = prev;
        return rest;
      });
    }

    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=${process.env.NEXT_PUBLIC_LOCATIONIQ_KEY}&q=${query}`
      );

      const data = await res.json();
      if (Array.isArray(data)) {
        setSuggestions(data);
      }
    } catch (error) {
      console.error("LocationIQ Error:", error);
    }

    setLoading(false);
  };

  const selectAddress = (item: LocationSuggestion) => {
    setCustomerForm((prev) => ({
      ...prev,
      address: item.display_name,
      latitude: item.lat,
      longitude: item.lon,
    }));
    setSuggestions([]);
    
    // Clear address error when valid address is selected
    if (errors.address) {
      setErrors(prev => {
        const { address, ...rest } = prev;
        return rest;
      });
    }
  };

  // ----------------------------------------------------
  // Submit Form -> Rails Backend (MULTIPART FORM DATA)
  // ----------------------------------------------------
  const handleCreateProfile = async () => {
    // Validate form before submission
    if (!validateForm()) {
      notificationService.notify({ 
        message: "Please fix the errors before submitting", 
        type: "error" 
      });
      return;
    }

    try {
      setCreatingProfile(true);

      const token = localStorage.getItem("token");

      // Prepare FormData
      const formData = new FormData();
      formData.append("customer_profile[full_name]", customerForm.full_name);
      formData.append("customer_profile[phone_number]", customerForm.phone_number);
      formData.append("customer_profile[gender]", customerForm.gender);
      formData.append("customer_profile[address]", customerForm.address);
      formData.append("customer_profile[latitude]", customerForm.latitude);
      formData.append("customer_profile[longitude]", customerForm.longitude);
      formData.append("customer_profile[user_id]", userId);
      if (profileImage) formData.append("customer_profile[profile_image]", profileImage, profileImage.name);
      
      console.log("userId type:", typeof userId);

      const response = await fetch(
        "http://127.0.0.1:3300/api/v1/customer/customer_profiles",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Server responded with error:", data);
        notificationService.notify({ 
          message: data.message || response.statusText || "Failed to create profile", 
          type: "error" 
        });
      } else {
        console.log("PROFILE CREATED:", data);
        notificationService.notify({ 
          message: "Profile created successfully!", 
          type: "success" 
        });
        setIsEditing(false);
        setCreated(true);
        setCreatingProfile(true);
      }
    } catch (error) {
      console.error("Create profile error:", error.message);
      notificationService.notify({ 
        message: "An error occurred while creating profile", 
        type: "error" 
      });
    } finally {
      setCreatingProfile(false);
    }
  };

 
  const handleUpdateProfile = async () => {
    // Validate form before submission
    if (!validateForm()) {
      notificationService.notify({ 
        message: "Please fix the errors before updating", 
        type: "error" 
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Prepare FormData
      const formData = new FormData();
      formData.append("customer_profile[full_name]", customerForm.full_name);
      formData.append("customer_profile[phone_number]", customerForm.phone_number);
      formData.append("customer_profile[gender]", customerForm.gender);
      formData.append("customer_profile[address]", customerForm.address);
      formData.append("customer_profile[latitude]", customerForm.latitude);
      formData.append("customer_profile[longitude]", customerForm.longitude);
      if (profileImage) formData.append("customer_profile[profile_image]", profileImage, profileImage.name);

      const response = await fetch(
        `http://127.0.0.1:3300/api/v1/customer/customer_profiles/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Server responded with error:", data);
        notificationService.notify({ 
          message: data.message || response.statusText || "Failed to update profile", 
          type: "error" 
        });
      } else {
        console.log("PROFILE UPDATED:", data);
        notificationService.notify({ 
          message: "Profile updated successfully!", 
          type: "success" 
        });
        setUpdated(true);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Update profile error:", error.message);
      notificationService.notify({ 
        message: "An error occurred while updating profile", 
        type: "error" 
      });
    }
  };

  const handleSaveChanges = () => {
    if (creatingProfile) {
      handleUpdateProfile();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Card */}
      <div style={{background: "#3730a3"}} className=" rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>

        <div className="relative flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-2xl overflow-hidden">
              {profilePreview && (
                <img
                  src={profilePreview}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              )}
            </div>

            {/* Upload Button */}
            {(isEditing || !creatingProfile) && (
              <label className="absolute bottom-0 right-0 bg-white text-blue-600 p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-1">{customerForm.full_name || "Guest User"}</h2>
            {errors.profile_image && (
              <div className="flex items-center gap-1 mt-2">
                <AlertCircle className="w-4 h-4 text-red-300" />
                <p className="text-sm text-red-300">{errors.profile_image}</p>
              </div>
            )}
          </div>

          {loadingProfile ? (
            <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold opacity-50 cursor-not-allowed">
              Checking...
            </button>
          ) : !creatingProfile ? (
            <button
              onClick={handleCreateProfile}
              className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Profile
            </button>
          ) : (
            <button
              onClick={() => {
                if (isEditing) {
                  handleSaveChanges();
                } else {
                  setIsEditing(true);
                }
              }}
              className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 font-medium">Full Name</p>
              {isEditing || !creatingProfile ? (
                <>
                  <input 
                    type="text"
                    value={customerForm.full_name}
                    
                    onChange={(e) => {
                      setCustomerForm((prev) => ({ ...prev, full_name: e.target.value }));
                      if (errors.full_name) {
                        setErrors(prev => {
                          const { full_name, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                    placeholder="Enter your full name"
                    className={`w-full text-gray-900 font-semibold px-4 py-2 border-2 rounded-xl focus:outline-none transition ${
                      errors.full_name 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-200 focus:border-blue-500'
                    }`}
                  />
                  {errors.full_name && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      <p className="text-xs text-red-500">{errors.full_name}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-900 font-semibold">{customerForm.full_name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Phone Number */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 font-medium">Phone Number</p>
              {isEditing || !creatingProfile ? (
                <>
                  <input 
                    type="tel"
                    value={customerForm.phone_number}
                     onKeyDown={(e) => {
                    if (!/[0-9]/.test(e.key) && 
                        e.key !== "Backspace" && 
                        e.key !== "Delete" &&
                        e.key !== "ArrowLeft" &&
                        e.key !== "ArrowRight") {
                      e.preventDefault();
                    }
                  }}
                    onChange={(e) => {
                      setCustomerForm((prev) => ({ ...prev, phone_number: e.target.value }));
                      if (errors.phone_number) {
                        setErrors(prev => {
                          const { phone_number, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                    placeholder="Enter your phone number"
                    className={`w-full text-gray-900 font-semibold px-4 py-2 border-2 rounded-xl focus:outline-none transition ${
                      errors.phone_number 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-200 focus:border-green-500'
                    }`}
                  />
                  {errors.phone_number && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      <p className="text-xs text-red-500">{errors.phone_number}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-900 font-semibold">{customerForm.phone_number}</p>
              )}
            </div>
          </div>
        </div>

        {/* Gender */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 font-medium">Gender</p>
              {isEditing || !creatingProfile ? (
                <>
                  <select
                    className={`w-full text-gray-900 font-semibold px-4 py-2 border-2 rounded-xl focus:outline-none transition ${
                      errors.gender 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-200 focus:border-purple-500'
                    }`}
                    value={customerForm.gender}
                    onChange={(e) => {
                      setCustomerForm((prev) => ({ ...prev, gender: e.target.value }));
                      if (errors.gender) {
                        setErrors(prev => {
                          const { gender, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      <p className="text-xs text-red-500">{errors.gender}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-900 font-semibold">{customerForm.gender}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 font-medium">Address</p>
              {isEditing || !creatingProfile ? (
                <div className="relative">
                  <input
                    type="text"
                    value={customerForm.address}
                    onChange={handleAddressChange}
                    placeholder="Search your address..."
                    className={`w-full text-gray-900 px-4 py-2 border-2 rounded-xl focus:outline-none transition ${
                      errors.address 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-200 focus:border-orange-500'
                    }`}
                  />

                  {/* Suggestions Dropdown */}
                  {suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-white border rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                      {suggestions.map((s, i) => (
                        <div
                          key={i}
                          onClick={() => selectAddress(s)}
                          className="p-2 hover:bg-gray-100 text-gray-900 w-full cursor-pointer"
                        >
                          {s.display_name}
                        </div>
                      ))}
                    </div>
                  )}

                  {loading && (
                    <p className="text-xs text-gray-500 mt-1">Searching...</p>
                  )}
                  
                  {errors.address && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      <p className="text-xs text-red-500">{errors.address}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-900 font-semibold">{customerForm.address}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Bookings', value: '24', icon: Calendar, color: 'from-blue-500 to-cyan-500' },
          { label: 'Active Services', value: '3', icon: Clock, color: 'from-green-500 to-emerald-500' },
          { label: 'Total Spent', value: '$1,840', icon: CreditCard, color: 'from-purple-500 to-pink-500' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:-translate-y-1">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div> */}
    </div>
  );
};

export default CustomerProfileSettings;