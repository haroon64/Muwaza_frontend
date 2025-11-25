"use client";
import { useState ,useEffect} from 'react';
import { 
  User, Venus,CreditCard, HelpCircle, Shield, Briefcase,
  Camera, Mail, Phone, MapPin, Edit2, Plus, Trash2, 
  Check, ChevronRight, Star, Calendar, Clock, FileText,
  Building, MessageSquare, Bell, Lock, Eye
} from 'lucide-react';
import axios from 'axios';
import {useAuth} from '@/hooks/useauth'
import { number } from 'framer-motion';
import { notificationService } from "@/service/NotificationService";
import { useRouter } from 'next/router';
interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface CustomerForm {
  phone_number: string;
    gender: string;
  address: string;
  latitude: string;
  longitude: string;
  user_id: number | undefined;
  profile_image:string;
}

const CustomerProfileSettings = () => {
  const user = useAuth(); // { user_id }
  const router = useRouter();
  console.log("User from hook:", user?.user_id);

  

  const [isEditing, setIsEditing] = useState(false);
  const [creatingProfile, setCreatingProfile] = useState<boolean | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [name,setName]= useState<string | null>(null);



  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState(
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
  );

  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);


  // ---------- FORM DATA ----------
  const [customerForm, setCustomerForm] = useState<CustomerForm>({
  phone_number: "",
  gender: "",
  address: "",
  latitude: "",
  longitude: "",
  user_id: undefined,
  profile_image:""
});


useEffect(() => {
  if (user?.user_id) {
    setUserId(user.user_id);
  }
}, [user?.user_id]);
  // ----------------------------------------------------
  // Fetch if profile exists
  // ----------------------------------------------------
  useEffect(() => {
    console.log("wow")
    if (!user?.user_id) return;
    console.log("userd id exists ")
    

    const checkProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const full_name= localStorage.getItem("full_name");
        setName(full_name);
      

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
            phone_number: prof.phone_number ?? prev.phone_number,
            gender: prof.gender ?? prev.gender,
            address: prof.address ?? prev.address,
            latitude: prof.latitude ?? prev.latitude,
            longitude: prof.longitude ?? prev.longitude,
            profile_image: prof.profile_image ?? prev.profile_image,
            // user_id: prof.user_id ?? prev.user_id,
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
         notificationService.notify({ message: error, type:  "error" });
        console.error("Profile check error:", error);
      }
    };

    checkProfile();
  }, [userId]);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files || e.target.files.length === 0) return;

  const file = e.target.files[0];
  setProfileImage(file);

  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result) {
      setProfilePreview(e.target.result as string); // <-- use this to show image
    }
  };
  reader.readAsDataURL(file);
};

  const handleAddressChange = async (e: any) => {
    const query = e.target.value;
    setCustomerForm((prev) => ({ ...prev, address: query }));

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
  };

  // ----------------------------------------------------
  // Submit Form -> Rails Backend (MULTIPART FORM DATA)
  // ----------------------------------------------------
 const handleCreateProfile = async () => {
  try {
    setCreatingProfile(true);

    const token = localStorage.getItem("token");

    // Prepare FormData
    const formData = new FormData();
    formData.append("customer_profile[phone_number]", customerForm.phone_number);
    formData.append("customer_profile[gender]", customerForm.gender);
    formData.append("customer_profile[address]", customerForm.address);
    formData.append("customer_profile[latitude]", customerForm.latitude);
    formData.append("customer_profile[longitude]", customerForm.longitude);
    formData.append("customer_profile[user_id]", userId);
    if (profileImage) formData.append("customer_profile[profile_image]", profileImage, profileImage.name);
    setCustomerForm((prev) => ({ ...prev, user_id: userId }));
    console.log("userId type:", typeof userId);

    const response = await fetch(
      "http://127.0.0.1:3300/api/v1/customer/customer_profiles",
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`, // keep auth header
          // Do NOT set 'Content-Type'; browser will handle it for FormData
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Server responded with error:", data);
      notificationService.notify({ message: response.statusText || "Failed to create profile", type:  "error" });
      
    } else {
      console.log("PROFILE CREATED:", data);
      setIsEditing(true);
    }
  } catch (error) {
    console.error("Create profile error:", error.message);
  } finally {
    setCreatingProfile(false);
  }
};


    return(

    
    <div className="space-y-6 animate-fadeIn">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>

      <div className="relative flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-white p-1 shadow-2xl overflow-hidden">
            <img
              src={profilePreview}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          {/* Upload Button */}
          {isEditing || !creatingProfile && (
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
          <h2 className="text-3xl font-bold mb-1">{name}</h2>
          {/* <p className="text-blue-100 mb-3">Premium Member</p> */}
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
          {creatingProfile ? "Creating..." : "Create Profile"}
        </button>
      ) : (
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2"
        >
          <Edit2 className="w-4 h-4" />
          {isEditing && creatingProfile ? "Save Changes" : "Edit Profile"}
        </button>
        
      )}

      </div>
    </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Email Address</p>
              

           
          <p className="text-gray-900 font-semibold">john.doe@examplsdsde.com</p>
            </div>
          </div>
          
        </div> */}

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">phone number</p>
                {isEditing || !creatingProfile? (
            <input 
              type="tel"

            value={customerForm.phone_number}
        onChange={(e) =>
          setCustomerForm((prev) => ({ ...prev, phone_number: e.target.value }))
        }
              
              className="w-full text-gray-900 font-semibold  px-4 py-2 border-2  border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
            />
           ):(<p className="text-gray-900 font-semibold">{customerForm.phone_number}</p>)}
        
            </div>
          </div>
         
        </div>
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 group">
        <div className="flex items-center gap-3 mb-4">
          
          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Venus className="w-6 h-6 text-green-600" />
          </div>

          <div className="flex-1">
            <p className="text-sm text-gray-500 font-medium">Gender</p>

            {isEditing || !creatingProfile? (
              <select
                className="w-full text-gray-900 font-semibold px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
                value={customerForm.gender}
                onChange={(e) =>
                setCustomerForm((prev) => ({ ...prev, gender: e.target.value }))
        }
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <p className="text-gray-900 font-semibold">{customerForm.gender}</p>
            )}
          </div>
        </div>
      </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 group md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Address</p>
             {isEditing || !creatingProfile? (
              <div className="relative">
                <input
                  type="text"
                  value={customerForm.address}
                   onChange={handleAddressChange}
                  placeholder="Search your address..."
                  className="w-full   text-gray-900 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition"
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
              </div>
            ) : (
              <p className="text-gray-900 font-semibold">{customerForm.address}</p>
            )}
             
            </div>
          </div>
         
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>
    </div>
);
}

export default CustomerProfileSettings;