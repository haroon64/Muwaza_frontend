"use client";
import { useState, useEffect } from "react";
import {
  User,
  Briefcase,
  CreditCard,
  HelpCircle,
  Shield,
  Camera,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  AlertCircle,
  Star,
  Calendar,
  Clock,
  FileText,
  Building,
  MessageSquare,
  Bell,
  Lock,
  Eye,
  Images,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useauth";
import HandymanIcon from "@mui/icons-material/Handyman";
import ServiceForm from "@/components/vendor/addServiceForm";
import { notificationService } from "@/service/NotificationService";

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface WorkPortfolio {
  id?: string;
  work_experience: string;
  work_images: string[];
}

interface VendorForm {
  id: number | undefined;
  phone_number: string;
  full_name: string;
  second_phone_number: string;
  address: string;
  latitude: string;
  longitude: string;
  user_id: number | undefined;
  profile_image: string;
  vendor_portfolios: WorkPortfolio[];
}

interface FormErrors {
  full_name?: string;
  phone_number?: string;
  second_phone_number?: string;
  address?: string;
  profile_image?: string;
}
interface PortfolioItem {
  experience: string;
  // Separate tracking for existing server images and new uploads
  existingImages: string[]; // URLs from server
  newImages: File[]; // New files to upload
  newImagePreviews: string[]; // Previews for new files
}

const VendorProfileSettings = () => {
  // Mock user data - replace with your actual auth hook
  const user = useAuth();

  const [activeTab, setActiveTab] = useState<
    "profile" | "portfolio" | "service"
  >("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [creatingProfile, setCreatingProfile] = useState<boolean | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [exists, setExists] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);

  // ---------- FORM DATA ----------
  const [vendorForm, setVendorForm] = useState<VendorForm>({
    id: undefined,
    full_name: "",
    phone_number: "",
    second_phone_number: "",
    address: "",
    latitude: "",
    longitude: "",
    user_id: undefined,
    profile_image: "",
    vendor_portfolios: [],
  });

  // State for portfolio items with their images

  useEffect(() => {
    if (user?.user_id) {
      setUserId(user.user_id);
    }
  }, [user?.user_id]);

  useEffect(() => {
    if (!user?.user_id) return;

    const checkProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!userId) {
          notificationService.notify({
            message: "userId is Undefined",
            type: "error",
          });
        }

        const res = await fetch(
          `http://127.0.0.1:3300/api/v1/vendor/vendor_profiles/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        if (data.exists === true) {
          setExists(true);
          const prof = data.profile || {};
          // Normalize server portfolio shape (handle vendor_portfolios or vendor_portfolio, images vs work_images)
          const serverPortfolios =
            prof.vendor_portfolios ?? prof.vendor_portfolio ?? [];
          const normalizedPortfolios: WorkPortfolio[] = Array.isArray(
            serverPortfolios
          )
            ? serverPortfolios.map((p: any) => ({
                id: p.id !== undefined ? String(p.id) : undefined,
                work_experience: p.work_experience ?? p.workExperience ?? "",
                work_images: p.work_images ?? p.work_images ?? p.images ?? [],
              }))
            : [];

          // Set vendor form fields, including normalized portfolios
          setVendorForm((prev) => ({
            ...prev,
            id: prof.id,
            full_name: prof.full_name ?? prev.full_name,
            phone_number: prof.phone_number ?? prev.phone_number,
            second_phone_number:
              prof.second_phone_number ?? prev.second_phone_number,
            address: prof.address ?? prev.address,
            latitude: prof.latitude ?? prev.latitude,
            longitude: prof.longitude ?? prev.longitude,
            profile_image: prof.profile_image ?? prev.profile_image,
            vendor_portfolios: normalizedPortfolios,
          }));

          if (prof.profile_image) {
            setProfilePreview(prof.profile_image);
          }

          // Populate portfolioItems for UI (imagePreviews from server images; File objects can't be reconstructed)
          if (normalizedPortfolios.length) {
            const loadedPortfolios = normalizedPortfolios.map((portfolio) => ({
              experience: portfolio.work_experience,
              existingImages: Array.isArray(portfolio.work_images)
                ? portfolio.work_images
                : [],
              newImages: [],
              newImagePreviews: [],
            }));
            console.log("📦 Loaded portfolios from server:", loadedPortfolios);
            setPortfolioItems(loadedPortfolios);
          }

          setProfileImage(null);
        }

        setCreatingProfile(data.exists);
        setLoadingProfile(false);

        setVendorForm((prev) => ({
          ...prev,
          user_id: userId,
        }));
      } catch (error) {
        notificationService.notify({ message: error, type: "error" });
        setLoadingProfile(false);
      }
    };

    checkProfile();
  }, [userId, created, updated]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full Name validation
    if (!vendorForm.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    } else if (vendorForm.full_name.trim().length < 2) {
      newErrors.full_name = "Full name must be at least 2 characters";
    }
    if (!profilePreview) {
      newErrors.profile_image = "Profile image is required";
    }
    // Phone Number validation
    if (!vendorForm.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^\+?[\d\s\-()]+$/.test(vendorForm.phone_number)) {
      newErrors.phone_number = "Please enter a valid phone number";
    } else if (vendorForm.phone_number.replace(/\D/g, "").length < 10) {
      newErrors.phone_number = "Phone number must be at least 10 digits";
    }

    if (!vendorForm.second_phone_number.trim()) {
      if (!/^\+?[\d\s\-()]+$/.test(vendorForm.second_phone_number)) {
        newErrors.second_phone_number =
          "Please enter a valid second  phone number";
      } else if (
        vendorForm.second_phone_number.replace(/\D/g, "").length < 10
      ) {
        newErrors.second_phone_number =
          "Phone number must be at least 10 digits";
      }
    }
    // Address validation
    if (!vendorForm.address.trim()) {
      newErrors.address = "Address is required";
    } else if (vendorForm.address.trim().length < 5) {
      newErrors.address = "Please enter a complete address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {}, [vendorForm]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        profile_image: "Please select a valid image file",
      }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        profile_image: "Image size must be less than 5MB",
      }));
      return;
    }

    // Clear any previous image error
    setErrors((prev) => {
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
  const addPortfolioItem = () => {
    const newItem: PortfolioItem = {
      experience: "",
      existingImages: [],
      newImages: [],
      newImagePreviews: [],
    };

    setPortfolioItems((prev) => {
      console.log("➕ Adding portfolio item. Current:", prev.length);
      return [...prev, newItem];
    });
  };

  const removePortfolioItem = (index: number) => {
    console.log(`🗑️ Removing portfolio at index ${index}`);
    setPortfolioItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePortfolioExperience = (index: number, experience: string) => {
    setPortfolioItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], experience };
      console.log(`✏️ Updated experience at index ${index}`);
      return updated;
    });
  };

  const handlePortfolioImagesChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.log(" No files selected");
      return;
    }

    const files = Array.from(e.target.files);
    const fileArray = Array.from(files);
    console.log(
      `📸 Processing ${fileArray.length} images for portfolio ${index}`
    );

    // Validate files
    const validFiles: File[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        notificationService.notify({
          message: `${file.name} is not a valid image`,
          type: "error",
        });
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        notificationService.notify({
          message: `${file.name} exceeds 5MB`,
          type: "error",
        });
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Read all files asynchronously
    const readFiles = async () => {
      const previews: string[] = [];

      for (const file of validFiles) {
        try {
          const preview = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(ev.target?.result as string);
            reader.onerror = () =>
              reject(new Error(`Failed to read ${file.name}`));
            reader.readAsDataURL(file);
          });
          previews.push(preview);
        } catch (error) {
          console.error("Error reading file:", error);
        }
      }

      // Update state ONCE with all new data
      setPortfolioItems((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          newImages: [...updated[index].newImages, ...validFiles],
          newImagePreviews: [...updated[index].newImagePreviews, ...previews],
        };
        return updated;
      });
    };

    readFiles();
  };

  const removePortfolioImage = (
    portfolioIndex: number,
    imageIndex: number,
    isExisting: boolean
  ) => {
    setPortfolioItems((prev) => {
      const updated = [...prev];

      if (isExisting) {
        // Remove from existing server images
        updated[portfolioIndex] = {
          ...updated[portfolioIndex],
          existingImages: updated[portfolioIndex].existingImages.filter(
            (_, i) => i !== imageIndex
          ),
        };
      } else {
        // Remove from new images
        const newImageStartIndex =
          updated[portfolioIndex].existingImages.length;
        const newImageIndex = imageIndex - newImageStartIndex;

        updated[portfolioIndex] = {
          ...updated[portfolioIndex],
          newImages: updated[portfolioIndex].newImages.filter(
            (_, i) => i !== newImageIndex
          ),
          newImagePreviews: updated[portfolioIndex].newImagePreviews.filter(
            (_, i) => i !== newImageIndex
          ),
        };
      }

      return updated;
    });
  };

  const handleEdit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) {
      notificationService.notify({
        message: "All fields are required before submitting",
        type: "error",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("vendor_profile[full_name]", vendorForm.full_name);
      formData.append("vendor_profile[phone_number]", vendorForm.phone_number);
      formData.append(
        "vendor_profile[second_phone_number]",
        vendorForm.second_phone_number
      );
      formData.append("vendor_profile[address]", vendorForm.address);
      formData.append("vendor_profile[latitude]", vendorForm.latitude);
      formData.append("vendor_profile[longitude]", vendorForm.longitude);
      formData.append("vendor_profile[user_id]", String(userId));

      if (profileImage) {
        formData.append(
          "vendor_profile[profile_image]",
          profileImage,
          profileImage.name
        );
      }

      // Add work portfolios
      portfolioItems.forEach((portfolio, idx) => {
        formData.append(
          `vendor_profile[vendor_portfolios][${idx}][work_experience]`,
          portfolio.experience
        );

        // Only append NEW images (not existing ones)
        portfolio.newImages.forEach((img) => {
          formData.append(
            `vendor_profile[vendor_portfolios][${idx}][work_images][]`,
            img,
            img.name
          );
        });

        // If editing and you want to keep track of which existing images to keep/remove,
        // you might need to send the existing image URLs or IDs that should be kept
        // This depends on your backend API design
      });

      const response = await fetch(
        `http://127.0.0.1:3300/api/v1/vendor/vendor_profiles/${vendorForm.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        // alert("Profile updated successfully!");
        notificationService.notify({
          message: "profile updated successfully",
          type: "success",
        });
        setUpdated(true);
        setIsEditing(false);
      } else {
        notificationService.notify({
          message: JSON.stringify(data.errors),
          type: "error",
        });
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
    }
  };

  const handleAddressChange = async (e: any) => {
    const query = e.target.value;
    setVendorForm((prev) => ({ ...prev, address: query }));

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
    setVendorForm((prev) => ({
      ...prev,
      address: item.display_name,
      latitude: item.lat,
      longitude: item.lon,
    }));
    setSuggestions([]);
  };

  const handleCreateProfile = async () => {
    if (!validateForm()) {
      notificationService.notify({
        message: "Please fill all fields before submitting",
        type: "error",
      });
      return;
    }

    try {
      setCreatingProfile(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("vendor_profile[full_name]", vendorForm.full_name);
      formData.append("vendor_profile[phone_number]", vendorForm.phone_number);
      formData.append(
        "vendor_profile[second_phone_number]",
        vendorForm.second_phone_number
      );
      formData.append("vendor_profile[address]", vendorForm.address);
      formData.append("vendor_profile[latitude]", vendorForm.latitude);
      formData.append("vendor_profile[longitude]", vendorForm.longitude);
      formData.append("vendor_profile[user_id]", String(userId));

      if (profileImage) {
        formData.append(
          "vendor_profile[profile_image]",
          profileImage,
          profileImage.name
        );
      }

      // Add work portfolios
      portfolioItems.forEach((portfolio, idx) => {
        formData.append(
          `vendor_profile[vendor_portfolios][${idx}][work_experience]`,
          portfolio.experience
        );

        // Only append NEW images (not existing ones)
        portfolio.newImages.forEach((img) => {
          formData.append(
            `vendor_profile[vendor_portfolios][${idx}][work_images][]`,
            img,
            img.name
          );
        });
      });

      console.log("request intiated ------1");
      const response = await fetch(
        "http://127.0.0.1:3300/api/v1/vendor/vendor_profiles",
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
        // console.error("Server responded with error:", data);
        console.log("Response status text:");
        notificationService.notify({ message: data.errors[0], type: "error" });
      } else {
        console.log("PROFILE CREATED:");
        setCreated(true);
        setIsEditing(false);
        setCreatingProfile(true);
        notificationService.notify({
          message: "Vendor Profile Created !",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Create profile error:", error);
    } finally {
      setCreatingProfile(false);
    }
  };

  const totalPortfolioImages = portfolioItems.reduce(
    (sum, item) =>
      sum + item.existingImages.length + item.newImagePreviews.length,
    0
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Card */}
      <div
        style={{ background: "#3730a3" }}
        className=" rounded-3xl p-8 text-white shadow-xl relative overflow-hidden"
      >
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
            {(isEditing || !creatingProfile) && activeTab === "profile" && (
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
            <p className="text-blue-100 mb-3">Professional Service Provider</p>
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
              {creatingProfile ? "Creating..." : "Create Profile"}
            </button>
          ) : (
            <button
              onClick={(e) => {
                if (isEditing) {
                  handleEdit(e);
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

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === "profile"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <User className="w-5 h-5" />
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === "portfolio"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Images className="w-5 h-5" />
            Work Portfolios ({portfolioItems.length})
          </button>
          {exists && (
            <button
              onClick={() => setActiveTab("service")}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === "service"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <HandymanIcon className="w-5 h-5" />
              Add Service
            </button>
          )}
        </div>
      </div>

      {activeTab === "profile" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        value={vendorForm.full_name}
                        onChange={(e) => {
                          setVendorForm((prev) => ({
                            ...prev,
                            full_name: e.target.value,
                          }));
                          if (errors.full_name) {
                            setErrors((prev) => {
                              const { full_name, ...rest } = prev;
                              return rest;
                            });
                          }
                        }}
                        placeholder="Enter your full name"
                        className={`w-full text-gray-900 font-semibold px-4 py-2 border-2 rounded-xl focus:outline-none transition ${
                          errors.full_name
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-200 focus:border-blue-500"
                        }`}
                      />
                      {errors.full_name && (
                        <div className="flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3 text-red-500" />
                          <p className="text-xs text-red-500">
                            {errors.full_name}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-900 font-semibold">
                      {vendorForm.full_name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">
                    Phone Number
                  </p>
                  {isEditing || !creatingProfile ? (
                    <>
                      <input
                        type="tel"
                        value={vendorForm.phone_number}
                        onKeyDown={(e) => {
                          if (
                            !/[0-9]/.test(e.key) &&
                            e.key !== "Backspace" &&
                            e.key !== "Delete" &&
                            e.key !== "ArrowLeft" &&
                            e.key !== "ArrowRight"
                          ) {
                            e.preventDefault();
                          }
                        }}
                        onChange={(e) => {
                          setVendorForm((prev) => ({
                            ...prev,
                            phone_number: e.target.value,
                          }));
                          if (errors.phone_number) {
                            setErrors((prev) => {
                              const { phone_number, ...rest } = prev;
                              return rest;
                            });
                          }
                        }}
                        placeholder="Enter your phone number"
                        className={`w-full text-gray-900 font-semibold px-4 py-2 border-2 rounded-xl focus:outline-none transition ${
                          errors.phone_number
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-200 focus:border-green-500"
                        }`}
                      />
                      {errors.phone_number && (
                        <div className="flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3 text-red-500" />
                          <p className="text-xs text-red-500">
                            {errors.phone_number}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-900 font-semibold">
                      {vendorForm.phone_number}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">
                    Secondary Phone Number
                  </p>
                  {isEditing || !creatingProfile ? (
                    <>
                      <input
                        type="tel"
                        value={vendorForm.second_phone_number}
                        onKeyDown={(e) => {
                          if (
                            !/[0-9]/.test(e.key) &&
                            e.key !== "Backspace" &&
                            e.key !== "Delete" &&
                            e.key !== "ArrowLeft" &&
                            e.key !== "ArrowRight"
                          ) {
                            e.preventDefault();
                          }
                        }}
                        onChange={(e) => {
                          setVendorForm((prev) => ({
                            ...prev,
                            second_phone_number: e.target.value,
                          }));
                          if (errors.second_phone_number) {
                            setErrors((prev) => {
                              const { second_phone_number, ...rest } = prev;
                              return rest;
                            });
                          }
                        }}
                        placeholder="Enter your phone number"
                        className={`w-full text-gray-900 font-semibold px-4 py-2 border-2 rounded-xl focus:outline-none transition ${
                          errors.second_phone_number
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-200 focus:border-green-500"
                        }`}
                      />
                      {errors.second_phone_number && (
                        <div className="flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3 text-red-500" />
                          <p className="text-xs text-red-500">
                            {errors.second_phone_number}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-900 font-semibold">
                      {vendorForm.second_phone_number}
                    </p>
                  )}
                </div>
              </div>
            </div>
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
                        value={vendorForm.address}
                        onChange={handleAddressChange}
                        placeholder="Search your address..."
                        className={`w-full text-gray-900 px-4 py-2 border-2 rounded-xl focus:outline-none transition ${
                          errors.address
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-200 focus:border-orange-500"
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
                        <p className="text-xs text-gray-500 mt-1">
                          Searching...
                        </p>
                      )}

                      {errors.address && (
                        <div className="flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3 text-red-500" />
                          <p className="text-xs text-red-500">
                            {errors.address}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-900 font-semibold">
                      {vendorForm.address}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total Jobs', value: '142', icon: Calendar, color: 'from-blue-500 to-cyan-500' },
              { label: 'Active Projects', value: '8', icon: Clock, color: 'from-green-500 to-emerald-500' },
              { label: 'Total Earned', value: '$12,450', icon: CreditCard, color: 'from-purple-500 to-pink-500' }
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
      )}

      {/* Portfolio Tab */}
      {activeTab === "portfolio" && (
        <div className="space-y-6">
          {/* Add Portfolio Button */}
          {(isEditing || !creatingProfile) && (
            <div className="flex justify-end">
              <button
                onClick={addPortfolioItem}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Portfolio
              </button>
            </div>
          )}

          {/* Portfolio Items */}
          {portfolioItems.length > 0 ? (
            portfolioItems.map((portfolio, portfolioIdx) => (
              <div
                key={portfolioIdx}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative"
              >
                {/* Remove Portfolio Button */}
                {(isEditing || !creatingProfile) && (
                  <button
                    onClick={() => removePortfolioItem(portfolioIdx)}
                    className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all hover:scale-110 shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Experience Field */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium mb-2">
                        Work Experience #{portfolioIdx + 1}
                      </p>
                      {isEditing || !creatingProfile ? (
                        <input
                          type="text"
                          value={portfolio.experience}
                          onChange={(e) =>
                            updatePortfolioExperience(
                              portfolioIdx,
                              e.target.value
                            )
                          }
                          placeholder="e.g., 5 years in plumbing"
                          className="w-full text-gray-900 font-semibold px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition"
                        />
                      ) : (
                        <p className="text-gray-900 font-semibold">
                          {portfolio.experience}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Portfolio Images Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        Work Samples
                      </h4>
                      <p className="text-sm text-gray-500">
                        Upload images for this portfolio
                      </p>
                    </div>
                    {(isEditing || !creatingProfile) && (
                      <label className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-xl cursor-pointer hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Images
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) =>
                            handlePortfolioImagesChange(portfolioIdx, e)
                          }
                        />
                      </label>
                    )}
                  </div>

                  {portfolio.existingImages.length +
                    portfolio.newImagePreviews.length >
                  0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {/* Show all images: existing + new */}
                      {[
                        ...portfolio.existingImages,
                        ...portfolio.newImagePreviews,
                      ].map((preview, imgIdx) => (
                        <div key={imgIdx} className="relative group">
                          <div className="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                            <img
                              src={preview}
                              alt={`Sample ${imgIdx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          {(isEditing || !creatingProfile) && (
                            <button
                              onClick={() => {
                                // Determine if it's an existing or new image
                                const isExisting =
                                  imgIdx < portfolio.existingImages.length;
                                removePortfolioImage(
                                  portfolioIdx,
                                  imgIdx,
                                  isExisting
                                );
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:scale-110 shadow-lg"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <Images className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">
                        No images added yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-16 shadow-lg border border-gray-100 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No Work Portfolios Yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start building your professional portfolio by adding your work
                experience and samples
              </p>
              <button
                onClick={addPortfolioItem}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Create Your First Portfolio
              </button>
            </div>
          )}

          {/* Portfolio Stats */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Total Portfolios",
                value: portfolioItems.length.toString(),
                icon: Briefcase,
                color: "from-blue-500 to-cyan-500",
              },
              {
                label: "Total Images",
                value: totalPortfolioImages.toString(),
                icon: Images,
                color: "from-rose-500 to-pink-500",
              },
              {
                label: "Portfolio Views",
                value: "1,234",
                icon: Eye,
                color: "from-indigo-500 to-purple-500",
              },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:-translate-y-1"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div> */}
        </div>
      )}
      {activeTab === "service" && <ServiceForm user_id={userId} />}
    </div>
  );
};

export default VendorProfileSettings;
