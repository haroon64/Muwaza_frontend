"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Divider,
  IconButton,
  Stack,
  useTheme,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  LocationOn,
  Phone,
  Email,
} from "@mui/icons-material";

export default function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)",
        color: "white",
        py: 8,
        mt: "auto",
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  background: "linear-gradient(45deg, #fff, #a5b4fc)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                ServiceHub
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: "grey.300" }}>
                Connecting professionals with customers seamlessly. Find the best services near you or grow your business with our platform.
              </Typography>
              
              {/* Contact Info */}
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOn sx={{ color: "primary.light", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: "grey.300" }}>
                    123 Business Street, City, State 12345
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Phone sx={{ color: "primary.light", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: "grey.300" }}>
                    +1 (555) 123-4567
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Email sx={{ color: "primary.light", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: "grey.300" }}>
                    support@servicehub.com
                  </Typography>
                </Box>
              </Stack>

              {/* Social Media */}
              <Box sx={{ display: "flex", gap: 1 }}>
                {[Facebook, Twitter, Instagram, LinkedIn].map((Icon, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconButton
                      sx={{
                        color: "grey.300",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        "&:hover": {
                          backgroundColor: "primary.main",
                          color: "white",
                        },
                      }}
                    >
                      <Icon />
                    </IconButton>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                {["Home", "Services", "About", ].map((item) => (
                  <Link
                    key={item}
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Typography
                      sx={{
                        color: "grey.300",
                        "&:hover": {
                          color: "primary.light",
                          transform: "translateX(4px)",
                        },
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                    >
                      {item}
                    </Typography>
                  </Link>
                ))}
              </Stack>
            </motion.div>
          </Grid>

          {/* Services */}
          {/* <Grid item xs={12} sm={6} md={2}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
                Services
              </Typography>
              <Stack spacing={1}>
                {["Cleaning", "Repair", "Beauty", "Fitness", "Tutoring"].map((service) => (
                  <Typography
                    key={service}
                    sx={{
                      color: "grey.300",
                      "&:hover": {
                        color: "primary.light",
                        transform: "translateX(4px)",
                      },
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                  >
                    {service}
                  </Typography>
                ))}
              </Stack>
            </motion.div>
          </Grid> */}

          {/* CTA Section */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* <Box
                sx={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                  p: 4,
                  borderRadius: 4,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                  Ready to Get Started?
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, color: "grey.300" }}>
                  Join our growing community of professionals and customers today.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      component={Link}
                      href="/auth/signup?role=customer"
                      variant="contained"
                      fullWidth
                      sx={{
                        background: "linear-gradient(45deg, #4f46e5, #7c3aed)",
                        color: "white",
                        fontWeight: "bold",
                        py: 1.5,
                      }}
                    >
                      Find Services
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      component={Link}
                      href="/auth/signup?role=vendor"
                      variant="outlined"
                      fullWidth
                      sx={{
                        borderColor: "grey.300",
                        color: "grey.300",
                        fontWeight: "bold",
                        py: 1.5,
                        "&:hover": {
                          borderColor: "primary.light",
                          color: "primary.light",
                        },
                      }}
                    >
                      Become Vendor
                    </Button>
                  </motion.div>
                </Stack>
              </Box> */}
            </motion.div>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />

        {/* Copyright */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "grey.400" }}>
            © {currentYear} ServiceHub. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <Link key={item} href="#" style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "grey.400",
                    "&:hover": { color: "primary.light" },
                    transition: "color 0.3s ease",
                  }}
                >
                  {item}
                </Typography>
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}