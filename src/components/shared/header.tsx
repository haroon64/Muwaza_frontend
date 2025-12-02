"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Settings, LogOut, Home, Briefcase, Info } from "lucide-react";
import AccountMenu from "@/components/shared/menueBar";
import { useAuth } from "@/context/AuthContext";
import {userSwitch} from "@/hooks/userSwitch"
import { useUserProfiles } from "@/context/UserProfileContext";
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser, isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { reloadProfiles, activeImage } = useUserProfiles();

//   useEffect(() => {
//   if (user?.id) {
//     reloadProfiles();
    
//   }
// }, [user]);


useEffect(() => {

   console.log("active}++++==",activeImage)
    

}, [activeImage]);


 

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, [setUser]);

  // Listen for storage changes (login/logout in other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        const updatedUser = e.newValue ? JSON.parse(e.newValue) : null;
        setUser(updatedUser);
      }
      if (e.key === "token" && !e.newValue) {
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [setUser]);

  // Custom event listener for login/logout within the same window
  // useEffect(() => {
  //   const handleAuthChange = () => {
  //     const storedUser = localStorage.getItem("user");
  //     setUser(storedUser ? JSON.parse(storedUser) : null);
  //   };
  //   window.addEventListener("authStateChanged", handleAuthChange);
  //   return () =>
  //     window.removeEventListener("authStateChanged", handleAuthChange);
  // }, [setUser]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
    if (pathname !== "/") router.push("/");
  };

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Services", href: "/services", icon: Briefcase },
    { name: "About Us", href: "/about", icon: Info },
  ];

  if (isLoading) {
    return (
      <header className=" sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logos/Muawza_logo_header.png"
                alt="Company Logo"
                width={120}
                height={120}
                priority
              />
            </Link>
            <div className="w-32 h-10 bg-white/20 rounded-xl animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      style={{ background: "#3730a3", height: "120px" }}
      className={"sticky top-0 z-50 transition-all duration-300"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logos/Muawza_logo_header.png"
              alt="Company Logo"
              width={120}
              height={120}
              priority
              className="transition-transform duration-300 group-hover:scale-105"
            />
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
                  className={
                    "flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 text-white hover:bg-blue hover:text-white"
                  }
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
                  className="px-5 py-2 rounded-xl font-semibold transition-all duration-300 bg-white text-purple-700 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 bg-yellow-500 text-white hover:bg-yellow-600"
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
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
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
                      ? "bg-purple-700 text-white"
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
                  className="flex items-center justify-center px-4 py-3 rounded-xl font-semibold bg-white text-purple-700 border border-purple-200 hover:bg-gray-50 transition-all duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center justify-center px-4 py-3 rounded-xl font-semibold bg-yellow-500 text-white hover:bg-yellow-600 transition-all duration-300"
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
                  onClick={handleLogout}
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
