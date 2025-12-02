"use client";
import React, { createContext,useEffect, useContext, useState ,ReactNode} from "react";
import { useAuth } from "@/context/AuthContext";


interface UserProfileContextType {
  customerProfile: any;
  vendorProfile: any;
  activeImage: string | null;
  reloadProfiles: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | null>(null);

export const UserProfileProvider = ({ children }:{children:ReactNode}) => {
  const { user } = useAuth();

  const [customerProfile, setCustomerProfile] = useState(null);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const reloadProfiles = async () => {
    console.group("reload profiles : ")
     console.log("user_id",user?.id)

    if (!user?.id) return;
    console.log("user_id",user?.id)

    const token = localStorage.getItem("token");

    try {
      // Fetch customer profile
      const cRes = await fetch(`http://127.0.0.1:3300/api/v1/customer/customer_profiles/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cData = cRes.ok ? await cRes.json() : null;
      setCustomerProfile(cData);
      console.log('------v----',cData)
      // Fetch vendor profile
      const vRes = await fetch(`http://127.0.0.1:3300/api/v1/vendor/vendor_profiles/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const vData = vRes.ok ? await vRes.json() : null;
      console.log('------v----',vData)
      setVendorProfile(vData);

      console.log("--<----> VendorProfile",vData)
      console.log("-<----- CustomerProfile >",cData?.profile.profile_image)
      console.log("---role---",user.role)

      // Set active image based on mode
      if (user.role === "vendor") {
        
        
        setActiveImage(vData?.profile.profile_image || null);
      } else {
        setActiveImage(cData?.profile.profile_image || null);
      }

    } catch (error) {
      console.log("Profile loading error:", error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      reloadProfiles();
    }
  }, [user]);

  return (
    <UserProfileContext.Provider
      value={{
        customerProfile,
        vendorProfile,
        activeImage,
        reloadProfiles,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfiles = () => useContext(UserProfileContext);
