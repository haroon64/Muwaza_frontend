// app/auth/callback/page.tsx  (Next.js 14+ app router)
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert,
  Fade,
  Container,
  Paper
} from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleAuth = () => {
      // Get token from URL query string
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const error = urlParams.get("error");

      if (token) {
        // Save JWT in localStorage
        localStorage.setItem("token", token);
        setStatus("success");
        
        // Redirect after a brief delay to show success state
        setTimeout(() => {
          router.replace("/");
        }, 1500);
      } else if (error) {
        console.error("OAuth Error:", error);
        setStatus("error");
        setErrorMessage(error);
        
        // Redirect to login after showing error
        setTimeout(() => {
          router.replace(`/login?error=${encodeURIComponent(error)}`);
        }, 3000);
      } else {
        setStatus("error");
        setErrorMessage("No authentication data received");
        
        setTimeout(() => {
          router.replace("/login");
        }, 3000);
      }
    };

    handleAuth();
  }, [router]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={500}>
          <Paper
            elevation={8}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)"
            }}
          >
            {status === "loading" && (
              <Box>
                <CircularProgress 
                  size={60} 
                  thickness={4}
                  sx={{ 
                    color: "primary.main",
                    mb: 3
                  }} 
                />
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                  Authenticating...
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Please wait while we process your login
                </Typography>
              </Box>
            )}

            {status === "success" && (
              <Box>
                <CheckCircle 
                  sx={{ 
                    fontSize: 60, 
                    color: "success.main",
                    mb: 2
                  }} 
                />
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                  Success!
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  You have been successfully authenticated
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Redirecting you to the home page...
                </Typography>
                <CircularProgress 
                  size={20} 
                  sx={{ 
                    mt: 2,
                    color: "success.main"
                  }} 
                />
              </Box>
            )}

            {status === "error" && (
              <Box>
                <Error 
                  sx={{ 
                    fontSize: 60, 
                    color: "error.main",
                    mb: 2
                  }} 
                />
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                  Authentication Failed
                </Typography>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 2,
                    mb: 2,
                    textAlign: "left"
                  }}
                >
                  {errorMessage || "An error occurred during authentication"}
                </Alert>
                <Typography variant="body2" color="text.secondary">
                  Redirecting to login page...
                </Typography>
                <CircularProgress 
                  size={20} 
                  sx={{ 
                    mt: 2,
                    color: "error.main"
                  }} 
                />
              </Box>
            )}
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}