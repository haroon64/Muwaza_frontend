"use client";

import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { notificationService } from "@/service/NotificationService";

export default function GlobalNotifier() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");
  

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(({ message, type = "success", duration = 4000 }) => {
      setMessage(message);
      setSeverity(type);
      setOpen(true);
      setTimeout(() => setOpen(false), duration);
    });
    return unsubscribe;
  }, []);

  const handleClose = () => setOpen(false);

  return (
    <Snackbar open={open} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
