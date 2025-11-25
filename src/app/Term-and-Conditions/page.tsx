"use client;"
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ExpandMore,
  Article,
  Security,
  Payment,
  Cancel,
  LocalShipping,
  Build,
} from '@mui/icons-material';

export default function TermsAndConditions() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Paper
          elevation={8}
          sx={{
            p: 6,
            mb: 6,
            textAlign: 'center',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            borderRadius: 4,
          }}
        >
          <Article sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Terms & Conditions
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, opacity: 0.8 }}>
            Please read these terms carefully before using our services
          </Typography>
        </Paper>

        {/* Introduction */}
        <Paper elevation={4} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Introduction
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to Mahir Company. These terms and conditions outline the rules and regulations 
            for the use of our platform. By accessing this website and using our services, you 
            accept these terms and conditions in full.
          </Typography>
          <Typography variant="body1">
            For any confusion or queries, please feel free to contact us at{' '}
            <Link href="mailto:info@mrmahir.com" color="primary">
              info@mrmahir.com
            </Link>{' '}
            or call us at{' '}
            <Link href="tel:+923096661919" color="primary">
              +92 309 6661919
            </Link>
            .
          </Typography>
        </Paper>

        {/* Main Content Accordion */}
        <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          {/* Platform Overview */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Build color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Platform Overview
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" paragraph>
                <strong>www.mahircompany.com</strong> is an online platform bridging the gap between 
                service users (customers) and service providers (technicians).
              </Typography>
              <Typography variant="body1">
                In these terms, "Customer" means the customer for whom the works are to be carried out, 
                and "Mahir Company" means the Company. "Contract" means the agreement between the 
                Customer and Mahir Company to carry out the works.
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Scope of Services */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocalShipping color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Scope of Mahir Company Services
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {[
                "Company offers the Mahir Company Platform to support technicians in finding work and help customers avail their services.",
                "Company assigns verified technicians (according to their availability) for the selected service.",
                "Customer can change order details or cancel the order if it has not yet been accepted.",
                "After task assignment, technician details will be shared with the customer through SMS and Mahir Company's platforms.",
                "Payment can be made in cash or through online means (Bank transfer, Easypaisa, JazzCash).",
                "Technicians will pay agreed-upon service charges to Mahir Company after receiving payment.",
                "Both technician and customer will provide reviews after service completion."
              ].map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      mt: 1,
                      mr: 2,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body1">{item}</Typography>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Data Privacy */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Security color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Data Collection & Privacy
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="h6" gutterBottom>
                Data Collected:
              </Typography>
              <Typography variant="body1" paragraph>
                Phone Number, email, gender, and name for account creation and order placement.
              </Typography>

              <Typography variant="h6" gutterBottom>
                Data Usage:
              </Typography>
              <Typography variant="body1" paragraph>
                Account creation, booking management, and service personalization (e.g., gender-based service filtering for salon services).
              </Typography>

              <Typography variant="h6" gutterBottom>
                Data Deletion:
              </Typography>
              <Typography variant="body1" paragraph>
                Users can delete their account through the app, email{' '}
                <Link href="mailto:info@mrmahir.com">info@mrmahir.com</Link>, call{' '}
                <Link href="tel:+923096661919">+92 309 6661919</Link>, or use the contact form.
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Fees & Payments */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Payment color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Fees & Payments
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {[
                "Service Fee is deducted from the agreed fee held in the account",
                "Increased fees for enhanced tasks are not added to agreed fees",
                "All charges are non-refundable and non-cancellable",
                "Mahir Company may restrict accounts until all fees are paid",
                "Customers pay service charges online; materials are paid directly to the technician"
              ].map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      mt: 1,
                      mr: 2,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body1">{item}</Typography>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Cancellation Policy */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Cancel color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Cancellation & Refund Policy
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="h6" gutterBottom>
                Cancellation:
              </Typography>
              {[
                "₹50 charged for cancellations not informed before arrival time",
                "Full refund for cancellations before vendor assignment",
                "Vendor arrival time has 1-hour margin from scheduled time"
              ].map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      mt: 1,
                      mr: 2,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body1">{item}</Typography>
                </Box>
              ))}

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Refunds:
              </Typography>
              {[
                "Applicable only on service charges, not materials",
                "Partner vendor/beautician liable for returns",
                "Valid only for the specific service provided",
                "Refund amount transferred to customer's digital wallet"
              ].map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      mt: 1,
                      mr: 2,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body1">{item}</Typography>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Guarantee */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Service Guarantee
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" paragraph>
                <strong>Warranty Periods:</strong>
              </Typography>
              {[
                "15 days on Home Services",
                "2 days on cleaning services",
                "On-spot check warranty on specific services"
              ].map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      mt: 1,
                      mr: 2,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body1">{item}</Typography>
                </Box>
              ))}
              
              <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                <strong>Note:</strong> Re-service claims after guarantee period require payment of service charges again.
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* User Obligations */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                User Obligations
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {[
                "Obey all applicable regulations and laws",
                "Post only correct information on the platform",
                "Perform duties competently and quickly",
                "Maintain your own account - no transferring or selling",
                "Do not use platform for immoral or illegal activities",
                "Technicians must not charge additional fees beyond advertised price",
                "Avoid demanding payments separate from the platform"
              ].map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      mt: 1,
                      mr: 2,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body1">{item}</Typography>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        </Paper>

        {/* Contact Section */}
        <Paper
          elevation={4}
          sx={{
            p: 4,
            mt: 4,
            textAlign: 'center',
            background: alpha(theme.palette.primary.main, 0.05),
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Need Help?
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about these Terms & Conditions, please contact us:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
            <Link href="mailto:info@mrmahir.com" variant="h6" color="primary">
              info@mrmahir.com
            </Link>
            <Link href="tel:+923096661919" variant="body1" color="primary">
              +92 309 6661919
            </Link>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              26-A, J 3 Block Block J 3 Phase 2 Johar Town, Lahore, Punjab 54000
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}