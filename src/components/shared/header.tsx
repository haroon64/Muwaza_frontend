"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User, ChevronDown, LogOut, Settings, Home, Briefcase, Info } from "lucide-react";
import AccountMenu from "@/components/shared/menueBar";
import { header } from "framer-motion/client";
import { useAuth } from "@/context/AuthContext";
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Function to check authentication status
  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    console.log("Checking token in header:", token);
    setIsLoggedIn(!!token);
    setIsLoading(false);
  };

  // Check token on component mount and when pathname changes
  useEffect(() => {
    checkAuthStatus();
  }, [pathname]);

  // Listen for storage changes (when user logs in/out in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        checkAuthStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Custom event listener for login/logout within the same window
  useEffect(() => {
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("authStateChanged", handleAuthChange);
    return () => window.removeEventListener("authStateChanged", handleAuthChange);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  


  const handleLogout = () => {
    console.log("Current pathname:1", pathname);
  
    localStorage.removeItem("token");
    localStorage.removeItem("full_name");
    setIsLoggedIn(false);

   
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("authStateChanged"));
  
     console.log("Logging out useer2");
     console.log("Current pathname:", pathname);
      if (pathname === "/") {
        console.log("Refreshing home page after logout");
      router.refresh();
    } else {
      setIsLoading(true);
      router.push("/");
      
    }

  };

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Services", href: "/services", icon: Briefcase },
    { name: "About Us", href: "/about", icon: Info },
  ];

  // Prevent flash of wrong content
  if (isLoading) {
    return (
      <header
        className="bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-500 sticky top-0 z-50"
        style={{ height: "80px" }}
      >
        <div  style={{ maxWidth: "80px" }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div  className="flex justify-between items-center h-full">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative">
                <Image
                  src="/logos/Muawza_logo_header.png"
                  alt="Company Logo"
                  width={120}
                  height={120}
                  priority
                />
              </div>
            </Link>
            <div className="w-32 h-10 bg-white/20 rounded-xl animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header 
    
      className={`sticky  top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-lg shadow-lg"
          : "bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-500"
      }`}
      style={{ height: "120px" }}
    >
      <div  style={{ maxWidth: "1900px" }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Image
                src="/logos/Muawza_logo_header.png"
                alt="Company Logo"
                width={120}
                height={120}
                priority
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  style={{fontSize:"20px"}}

                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    isActive
                      ? scrolled
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                        : "bg-white/20 text-white backdrop-blur-sm"
                      : scrolled
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-white/90 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {link.name}
                </Link>
              );
            })}

            {!isLoggedIn ? (
              <div className="flex items-center space-x-3 ml-4">
                <Link
                  href="/login"
                       style={{fontSize:"20px"}}
                  className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    scrolled
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  Login
                </Link>
                <Link
                     style={{fontSize:"20px"}}
                  href="/signup"
                  className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    scrolled
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-white text-teal-600 hover:bg-gray-50"
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="ml-4">
                <AccountMenu />
              </div>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
              scrolled
                ? "text-gray-700 hover:bg-gray-100"
                : "text-white hover:bg-white/20"
            }`}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-20 left-0 right-0 transition-all duration-300 ${
          menuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-lg shadow-2xl mx-4 rounded-2xl overflow-hidden border border-gray-200">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} />
                  {link.name}
                </Link>
              );
            })}

            {!isLoggedIn ? (
              <div className="pt-3 mt-3 border-t border-gray-200 space-y-2">
                <Link
                  href="/login"
                  className="flex items-center justify-center px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-all duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  
                  className="flex items-center justify-center px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => setMenuOpen(false)}
             
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="pt-3 mt-3 border-t border-gray-200 space-y-1">
               
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-all duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings size={20} />
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-all duration-300"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}