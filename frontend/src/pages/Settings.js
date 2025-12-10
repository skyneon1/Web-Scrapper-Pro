import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Container,
  FormControlLabel,
  Switch,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '../contexts/ThemeContext';

function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" gutterBottom sx={{ mb: 1, fontWeight: 'bold' }}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Application information and configuration
        </Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center">
                {darkMode ? (
                  <Brightness7Icon sx={{ mr: 1, color: 'primary.main' }} />
                ) : (
                  <Brightness4Icon sx={{ mr: 1, color: 'primary.main' }} />
                )}
                <Typography variant="h6">
                  Appearance
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={toggleDarkMode}
                  />
                }
                label={darkMode ? 'Dark Mode' : 'Light Mode'}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Toggle between light and dark theme. Your preference will be saved automatically.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">
                About Web Scraper Pro
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            
            <List>
              <ListItem>
                <ListItemText
                  primary="Version"
                  secondary="1.0.0"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="API Endpoint"
                  secondary={process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Features"
                  secondary="Web scraping, CSS selectors, Playwright support, Export (JSON/CSV), Analytics, Dark Mode"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Usage Tips
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="CSS Selectors"
                  secondary="Use CSS selectors to extract specific elements. Examples: h1, .class-name, #id-name"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Playwright Mode"
                  secondary="Enable Playwright for websites that load content dynamically with JavaScript"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Export Options"
                  secondary="Export your scraping results in JSON or CSV format from the History page"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Rate Limiting"
                  secondary="Be respectful when scraping websites. Add delays between requests if scraping multiple pages"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Settings;
