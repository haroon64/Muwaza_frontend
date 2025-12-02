"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Package,
  Text,
  DollarSign,
  Percent,
  CheckCircle,
  XCircle,
  AlertCircle,
  Image as ImageIcon,
  MapPin,
  Search,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { notificationService } from "@/service/NotificationService";

interface Services {
  id: number;
  service_name: string;
}

interface LocationSuggestion {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

type SubmissionStatus = "success" | "error" | null;

interface FormDataType {
  service_id: string;
  user_id?: number;
  sub_service_name: string;
  description: string;
  city: string;
  address: string;
  latitude: string;
  longitude: string;
  price: string;
  price_bargain: string;
  active_status: boolean;
  cover_image: File | null;
}

const initialFormState: FormDataType = {
  service_id: "",
  sub_service_name: "",
  description: "",
  price: "",
  city: "",
  address: "",
  latitude: "",
  longitude: "",
  price_bargain: "",
  active_status: true,
  cover_image: null,
};

interface ServiceFormProps {
  user_id?: number;
}

interface FormErrors {
  sub_service_name?: string;
  service_id?: string;
  description?: string;
  address?: string;
  cover_image?: string;
  price?: string;
  price_bargain?: string;
  city?: string;
}

function ServiceForm({ user_id }: ServiceFormProps) {
  const [formData, setFormData] = useState<FormDataType>(initialFormState);
  const [services, setServices] = useState<Services[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  // Address search states
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  useEffect(() => {
    if (user_id) {
      setUserId(user_id);
    }
  }, [user_id]);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:3300/api/v1/services/service_icons"
        );
        const formatted = response.data.map((item: any) => ({
          id: item.id,
          service_name: item.service_name,
        }));
        setServices(formatted);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  // Search for address using LocationIQ
  const searchAddress = async (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      address: query,
      latitude: "",
      longitude: ""
    }));
    setErrors(prev => ({ ...prev, address: undefined }));

    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    setShowSuggestions(true);

    try {
      const res = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=${process.env.NEXT_PUBLIC_LOCATIONIQ_KEY}&q=${query}&limit=5`
      );

      const data = await res.json();
      if (Array.isArray(data)) {
        setSuggestions(data);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("LocationIQ Error:", error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectAddress = (item: LocationSuggestion) => {
    setFormData(prev => ({
      ...prev,
      address: item.display_name,
      latitude: item.lat,
      longitude: item.lon,
    }));
    setSuggestions([]);
    setShowSuggestions(false);
    setErrors(prev => ({ ...prev, address: undefined }));
  };

  // Handle text + checkbox inputs
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value, type } = target;

    const newValue =
      type === "checkbox" ? (target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleChangeCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("City selected:", e.target.value);
    setFormData((prev) => ({
      ...prev,
      city: e.target.value,
    }));
    if (errors.city) {
      setErrors(prev => ({ ...prev, city: undefined }));
    }
  };

  // Handle file upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        cover_image: e.target.files![0],
      }));
      if (errors.cover_image) {
        setErrors(prev => ({ ...prev, cover_image: undefined }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Service validation
    if (!formData.service_id.trim()) {
      newErrors.service_id = "Please select your Parent Service";
    }
    
    // Sub-service name validation
    if (!formData.sub_service_name.trim()) {
      newErrors.sub_service_name = "Sub-Service Name is required";
    }
    
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    // Price validation
    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    
    // Address validation - enhanced
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (!formData.latitude || !formData.longitude) {
      newErrors.address = "Please select a valid address from the suggestions";
    }
    
    // City validation
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    
    // Cover image validation
    if (!formData.cover_image) {
      newErrors.cover_image = "Cover image is required";
    }
    
    // Price bargain validation
    if (!formData.price_bargain) {
      newErrors.price_bargain = "Price type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form with API integration
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionStatus(null);

    if (!validateForm()) {
      notificationService.notify({
        message: "Please fill all required fields correctly",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      console.log("userId:", userId);

      const payload = new FormData();
      payload.append("service_id", formData.service_id);
      if (userId) {
        payload.append("user_id", userId.toString());
      }
      payload.append("sub_service_name", formData.sub_service_name);
      payload.append("description", formData.description);
      payload.append("price", formData.price);
      payload.append("price_bargain", formData.price_bargain);
      payload.append("city", formData.city);
      payload.append("address", formData.address);
      payload.append("latitude", formData.latitude);
      payload.append("longitude", formData.longitude);
      payload.append(
        "active_status",
        formData.active_status ? "true" : "false"
      );

      if (formData.cover_image) {
        payload.append("cover_image", formData.cover_image);
      }

      const response = await fetch(
        "http://127.0.0.1:3300/api/v1/services/sub_services",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: payload,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        notificationService.notify({
          message: data.message || "Failed to create service",
          type: "error",
        });
        setSubmissionStatus("error");
      } else {
        console.log("SUCCESS:", data);
        notificationService.notify({ message: "Service Added Successfully", type: "success" });
        setSubmissionStatus("success");
        setFormData(initialFormState);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error submitting:", error);
      notificationService.notify({ 
        message: "Network error. Please try again.", 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="w-full bg-white p-8 md:p-10 rounded-2xl shadow-2xl border border-indigo-100">
        <h1 className="text-3xl font-extrabold text-indigo-800 text-center mb-8">
          New Sub-Service Listing
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Dropdown */}
          <div className="flex gap-4">
            {/* Parent Service (Select) */}
            <div className="w-1/2">
              <label className="block mb-1 font-medium text-gray-700">
                <Package className="inline-block w-4 h-4 mr-1 text-indigo-500" />
                Parent Service <span className="text-red-600">*</span>
              </label>
              <select
                id="service_id"
                name="service_id"
                value={formData.service_id}
                onChange={handleChange}
                className={`mt-1 block w-full text-black pl-3 pr-10 py-3 rounded-xl shadow-sm border ${
                  errors.service_id ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-indigo-500"
                }`}
              >
                <option value="" disabled>
                  Select a service
                </option>
                {services.map((s) => (
                  <option key={s.id} value={String(s.id)}>
                    {s.service_name}
                  </option>
                ))}
              </select>
              {errors.service_id && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 text-red-500" />
                  <p className="text-xs text-red-500">{errors.service_id}</p>
                </div>
              )}
            </div>

            {/* Sub Service Name */}
            <div className="w-1/2">
              <label className="block mb-1 font-medium text-gray-700">
                Sub Service Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="sub_service_name"
                value={formData.sub_service_name}
                onChange={handleChange}
                className={`mt-1 block w-full text-black pl-3 pr-3 py-3 rounded-xl shadow-sm border ${
                  errors.sub_service_name ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-indigo-500"
                }`}
                placeholder="Enter sub-service name"
              />
              {errors.sub_service_name && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 text-red-500" />
                  <p className="text-xs text-red-500">{errors.sub_service_name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              <Text className="inline-block w-4 h-4 mr-1 text-indigo-500" />
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-3 text-black rounded-xl shadow-sm border ${
                errors.description ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-indigo-500"
              }`}
            ></textarea>
            {errors.description && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <p className="text-xs text-red-500">{errors.description}</p>
              </div>
            )}
          </div>

          {/* Address Search with LocationIQ */}
          <div className="relative">
            <label className="block mb-1 font-medium text-gray-700">
              <MapPin className="inline-block w-4 h-4 mr-1 text-indigo-500" />
              Address <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={searchAddress}
              placeholder="Search your address..."
              className={`w-full text-gray-900 px-4 py-3 rounded-xl shadow-sm border focus:outline-none transition ${
                errors.address
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-indigo-500"
              }`}
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                {isSearching ? (
                  <div className="p-3 text-center text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                    Searching...
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((s, i) => (
                    <div
                      key={i}
                      onClick={() => selectAddress(s)}
                      className="p-3 hover:bg-gray-100 text-gray-900 w-full cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      {s.display_name}
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500">
                    No addresses found
                  </div>
                )}
              </div>
            )}

            {errors.address && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <p className="text-xs text-red-500">{errors.address}</p>
              </div>
            )}
          </div>

          {/* City and Price */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                <MapPin className="inline-block w-4 h-4 mr-1 text-indigo-500" />
                City *
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChangeCity}
                className={`mt-1 block w-full px-4 py-3 text-black rounded-xl shadow-sm border ${
                  errors.city ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-indigo-500"
                }`}
              >
                <option value="" disabled>Select City</option>
                <option value="Lahore">Lahore</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Karachi">Karachi</option>
                <option value="Multan">Multan</option>
                <option value="Faisalabad">Faisalabad</option>
              </select>
              {errors.city && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 text-red-500" />
                  <p className="text-xs text-red-500">{errors.city}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                <DollarSign className="inline-block w-4 h-4 mr-1 text-indigo-500" />
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-3 text-black rounded-xl shadow-sm border ${
                  errors.price ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-indigo-500"
                }`}
              />
              {errors.price && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 text-red-500" />
                  <p className="text-xs text-red-500">{errors.price}</p>
                </div>
              )}
            </div>
          </div>

          {/* Price Type */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              <Percent className="inline-block w-4 h-4 mr-1 text-indigo-500" />
              Price Type *
            </label>
            <select
              name="price_bargain"
              value={formData.price_bargain}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-3 text-black rounded-xl shadow-sm border ${
                errors.price_bargain ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-indigo-500"
              }`}
            >
              <option value="" disabled>Select pricing</option>
              <option value="fixed">Fixed</option>
              <option value="negotiable">Negotiable</option>
            </select>
            {errors.price_bargain && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <p className="text-xs text-red-500">{errors.price_bargain}</p>
              </div>
            )}
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              <ImageIcon className="inline-block w-4 h-4 mr-1 text-indigo-500" />
              Cover Image *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className={`mt-1 block w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 ${
                errors.cover_image ? "border-red-500" : ""
              }`}
            />
            {formData.cover_image && (
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Selected: {formData.cover_image.name}
              </p>
            )}
            {errors.cover_image && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <p className="text-xs text-red-500">{errors.cover_image}</p>
              </div>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="active_status"
              checked={formData.active_status}
              onChange={handleChange}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-3 text-gray-700 font-medium">
              Listing Active
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl text-white text-lg font-semibold transition-all transform ${
              isSubmitting
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-[1.02]"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </span>
            ) : (
              "Create Sub-Service"
            )}
          </button>

          {submissionStatus === "success" && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <p className="text-sm text-green-700 font-medium">
                Sub-service created successfully!
              </p>
            </div>
          )}

          {submissionStatus === "error" && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-sm text-red-700 font-medium">
                Something went wrong. Please try again.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ServiceForm;