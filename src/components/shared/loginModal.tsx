import { useState ,useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation';
import { notificationService } from "@/service/NotificationService";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }:AuthModalProps) => {
   
  
  const [formData, setFormData] = useState({
      email: "",
      password: "",
      full_name: "",
      role: "customer",
    });
  
    const handleGoogleSignup = () => {
       window.location.href = "http://127.0.0.1:3300/api/v1/auth/google_oauth2";
    };
  
    
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const router = useRouter();
  const pathname = usePathname();
useEffect(() => {
    console.log('Current path:', pathname); // e.g., /about
    // console.log('Full URL:', window.location.href); // optional full URL
}, [pathname]);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
        setError("Email/Phone and password are required");
        setLoading(false);
        return;
    }

    try {
        const response = await axios.post(
            "http://127.0.0.1:3300/api/v1/signin",
            { user: formData }
        );

        console.log("Response data:", response.data);

        if (response.data.status.code === 200) {
            const full_name = response.data.data.user.full_name;
            const token = response.data.data.token;
            console.log("Token:", token);

            if (!token) {
                setError("Token is missing from response");
                setLoading(false);
                return;
            }

            localStorage.setItem("token", token);
            localStorage.setItem("full_name", full_name);

            // Close modal on successful login then navigate
            onClose();
            await router.push(pathname);
        } else {
            setError(response.data.status.message || "Login failed");
        }
    } catch (err: any) {
        setError(err.response?.data?.status?.message || "Something went wrong");
    } finally {
        setLoading(false);
    }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Welcome</h2>
          <button
            onClick={onClose}
            className="text-black-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full text-black  p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border  text-black  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Continue'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        {/* Google Signup */}
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default AuthModal;