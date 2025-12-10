import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Stack,
  Divider,
} from '@mui/material';
import {
  GitHub,
  Twitter,
  LinkedIn,
  Email,
  Code,
  Web,
  Analytics,
} from '@mui/icons-material';

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { text: 'Features', href: '/#features' },
        { text: 'Pricing', href: '/#pricing' },
        { text: 'Documentation', href: '/docs' },
        { text: 'API Reference', href: '/api-docs' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { text: 'Blog', href: '/blog' },
        { text: 'Tutorials', href: '/tutorials' },
        { text: 'Examples', href: '/examples' },
        { text: 'Support', href: '/support' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About Us', href: '/about' },
        { text: 'Contact', href: '/contact' },
        { text: 'Privacy Policy', href: '/privacy' },
        { text: 'Terms of Service', href: '/terms' },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto',
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  mb: 2,
                }}
              >
                Web Scraper Pro
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Professional web scraping platform for extracting data from any website.
                Built with modern technologies for reliability and performance.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  <GitHub />
                </Link>
                <Link
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  <Twitter />
                </Link>
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  <LinkedIn />
                </Link>
                <Link
                  href="mailto:support@webscraperpro.com"
                  color="inherit"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  <Email />
                </Link>
              </Stack>
            </Box>
          </Grid>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <Grid item xs={6} md={2} key={section.title}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '0.9rem' }}>
                {section.title}
              </Typography>
              <Stack spacing={1}>
                {section.links.map((link) => (
                  <Link
                    key={link.text}
                    href={link.href}
                    color="text.secondary"
                    underline="hover"
                    sx={{
                      fontSize: '0.875rem',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    {link.text}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}

          {/* Features Icons */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '0.9rem' }}>
              Features
            </Typography>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Web sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Web Scraping
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Code sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                  API Access
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Analytics sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Analytics
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Copyright */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Web Scraper Pro. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: { xs: 1, sm: 0 } }}>
            Made with ❤️ for developers
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;

