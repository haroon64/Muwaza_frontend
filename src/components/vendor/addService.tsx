"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Package,
  Text,
  DollarSign,
  Percent,
  CheckCircle,
  XCircle,
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

function ServiceForm({ user_id }: ServiceFormProps) {
  const [formData, setFormData] = useState<FormDataType>(initialFormState);
  const [services, setServices] = useState<Services[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(null);
  
  // Address search states
  const [addressQuery, setAddressQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // LocationIQ API Key
  const LOCATIONIQ_API_KEY = "pk.your_locationiq_api_key_here";

  console.log("user_id prop:", user_id);

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
  const searchAddress = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=${process.env.NEXT_PUBLIC_LOCATIONIQ_KEY}&q=${query}`
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Error searching address:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle address input change with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (addressQuery) {
        searchAddress(addressQuery);
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [addressQuery]);

  // Handle address selection
  const handleSelectAddress = (suggestion: LocationSuggestion) => {
    setFormData((prev) => ({
      ...prev,
      address: suggestion.display_name,
      latitude: suggestion.lat,
      longitude: suggestion.lon,
    }));
    setAddressQuery(suggestion.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
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
  };

  const handleChangeCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("City selected:", e.target.value);
    setFormData((prev) => ({
      ...prev,
      city: e.target.value,
    }));
  };

  // Handle file upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        cover_image: e.target.files![0],
      }));
    }
  };

  // Validate inputs
  const validateForm = () => {
    if (!formData.service_id.trim()) return false;
    if (!formData.sub_service_name.trim()) return false;
    if (!formData.description.trim()) return false;
    if (!formData.price.trim() || Number(formData.price) <= 0) return false;
    if (!formData.address.trim()) return false;
    if (!formData.latitude || !formData.longitude) return false;
    if (!formData.cover_image) return false;
    return true;
  };

  // Submit form with API integration
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionStatus(null);

    if (!validateForm()) {
      // alert("Please fill all fields correctly, select an address, and upload an image.");
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
      payload.append("active_status", formData.active_status ? "true" : "false");

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
         notificationService.notify({ message: response.statusText, type:  "error" });
        setSubmissionStatus("error");
      } else {
        console.log("SUCCESS:", data);
        setSubmissionStatus("success");
        setFormData(initialFormState);
        setAddressQuery("");
      }
    } catch (error) {
      console.error("Error submitting:", error);
      // setSubmissionStatus("error");
      notificationService.notify({ message: error, type:  "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI Classes
  const getRequiredClass = (field: keyof FormDataType) => {
    const value = formData[field];
    const isEmpty =
      value === undefined || (typeof value === "string" && value.trim() === "");
    return !isEmpty || isSubmitting
      ? "border-gray-300 focus:border-indigo-500"
      : "border-red-400 focus:border-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white p-8 md:p-10 rounded-2xl shadow-2xl border border-indigo-100">
        <h1 className="text-3xl font-extrabold text-indigo-800 text-center mb-8">
          New Sub-Service Listing
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Dropdown */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              <Package className="inline-block w-4 h-4 mr-1 text-indigo-500" />
              Parent Service *
            </label>
            <select
              id="service_id"
              name="service_id"
              value={formData.service_id}
              onChange={handleChange}
              className={`mt-1 block w-full text-black pl-3 pr-10 py-3 rounded-xl shadow-sm border ${getRequiredClass(
                "service_id"
              )}`}
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
          </div>

          {/* Sub-Service Name */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              <Text className="inline-block w-4 h-4 mr-1 text-indigo-500" />
              Sub-Service Name *
            </label>
            <input
              type="text"
              name="sub_service_name"
              value={formData.sub_service_name}
              onChange={handleChange}
              className={`mt-1 block text-black w-full px-4 py-3 rounded-xl shadow-sm border ${getRequiredClass(
                "sub_service_name"
              )}`}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              <Text className="inline-block w-4 h-4 mr-1 text-indigo-500" />
              Description *
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-3 text-black rounded-xl shadow-sm border ${getRequiredClass(
                "description"
              )}`}
            ></textarea>
          </div>

          {/* Address Search with LocationIQ */}
          <div className="relative">
            <label className="block mb-1 font-medium text-gray-700">
              <MapPin className="inline-block w-4 h-4 mr-1 text-indigo-500" />
              Service Address *
            </label>
            <div className="relative">
              <input
                type="text"
                value={addressQuery}
                onChange={(e) => {
                  setAddressQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Search for address (e.g., Johar Town, Lahore)"
                className={`mt-1 block w-full text-black px-4 py-3 pl-10 rounded-xl shadow-sm border ${getRequiredClass(
                  "address"
                )}`}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-500 w-5 h-5 animate-spin" />
              )}
            </div>

            {/* Address Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    type="button"
                    onClick={() => handleSelectAddress(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-indigo-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-indigo-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-800">
                        {suggestion.display_name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Selected Address Display */}
            {formData.latitude && formData.longitude && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-700 font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Location confirmed: {formData.latitude}, {formData.longitude}
                </p>
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
                className="mt-1 block w-full px-4 py-3 text-black rounded-xl shadow-sm border border-gray-300"
              >
                <option value="" disabled>
                  Select City
                </option>
                <option value="Lahore">Lahore</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Karachi">Karachi</option>
                <option value="Multan">Multan</option>
                <option value="Faisalabad">Faisalabad</option>
              </select>
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
                className={`mt-1 block w-full px-4 py-3 text-black rounded-xl shadow-sm border ${getRequiredClass(
                  "price"
                )}`}
              />
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
              className="mt-1 block w-full px-4 py-3 text-black rounded-xl shadow-sm border border-gray-300"
            >
              <option value="" disabled>
                Select pricing
              </option>
              <option value="fixed">Fixed</option>
              <option value="negotiable">Negotiable</option>
            </select>
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
              className="mt-1 block w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {formData.cover_image && (
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Selected: {formData.cover_image.name}
              </p>
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