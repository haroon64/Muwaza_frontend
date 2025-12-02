"use client";

import * as React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UseSwitch } from "@/hooks/userSwitch";
import { useUserProfiles } from "@/context/UserProfileContext";

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [userId, setUserId] = useState<number>();
  const open = Boolean(anchorEl);
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useAuth();
  const { switchMode, isVendorMode, isCustomerMode } = UseSwitch();
  const { activeImage } = useUserProfiles();

  useEffect(() => {
    setUserId(user?.id);
  }, []);

  const handleMode = (role: any) => {
    console.log("handle mode hit ===", role);
    if (role === "vendor") {
      switchMode("customer");
    } else {
      switchMode("vendor");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authStateChanged"));
    setUser(null);

    if (pathname === "/") {
      console.log("Refreshing home page after logout");
      router.refresh();
    } else {
      router.push("/");
    }
  };

  const handleSettingsClicked = (role: any) => {
    if (role === "vendor") {
      router.push("/settings/vendor-profile");
    } else {
      router.push("/settings/customer-profile");
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigateTo = (path: string) => {
    handleClose(); // close menu
    router.push(path); // navigate
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              sx={{
                width: 50,
                height: 50,
                // Optional: Add border or shadow
                border: "2px solid white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
              src={activeImage} // Will be undefined if no image, showing default avatar
              alt="profile"
              imgProps={{
                style: {
                  objectFit: "cover", // Ensures image covers the circular area properly
                },
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* <MenuItem onClick={() => navigateTo('/settings')}>
          <Avatar /> Profile
        </MenuItem> */}

        <Divider />

        <MenuItem onClick={() => handleSettingsClicked(user?.role)}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={() => handleMode(user?.role)}>
          <ListItemIcon>
            <Avatar sx={{ width: 7.5, height: 7.5 }}></Avatar>
          </ListItemIcon>
          {user?.role === "vendor"
            ? "Switch to Customer Mode"
            : "Switch to Vendor Mode"}
        </MenuItem>

        <MenuItem onClick={() => handleLogout()}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
