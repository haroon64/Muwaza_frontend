import { useAuth } from "@/context/AuthContext";
import { useUserProfiles } from "@/context/UserProfileContext";

export function UseSwitch() {
  const { user, setUser } = useAuth();
  const { reloadProfiles } = useUserProfiles();

  const switchMode = async (role: "customer" | "vendor") => {

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://127.0.0.1:3300/api/v1/users/${user?.id}/update_role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role }),
        }
      );

      const data = await response.json();
      console.log("data--->",data)


      if (!response.ok) {
        return { success: false, error: data.message };
      }

      // Rails returns: { status: "success", user: {...} }
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    reloadProfiles();

      return { success: true };
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  };

  return {
    user,
    switchMode,
    isVendorMode: user?.role === "vendor",
    isCustomerMode: user?.role === "customer",
  };
}
