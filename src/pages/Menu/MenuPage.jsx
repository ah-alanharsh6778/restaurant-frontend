import { useState } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CategoryIcon from '@mui/icons-material/Category';
import PageContainer from '../../layout/PageContainer';
import MenuItemsPage from './MenuItemsPage';
import CategoriesPage from './CategoriesPage';

export const MenuPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <PageContainer maxWidth={false}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Header & Breadcrumbs */}
        <Box>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 1 }}>
            <Link underline="hover" color="inherit" href="/dashboard" sx={{ fontWeight: 500 }}>
              Dashboard
            </Link>
            <Typography color="text.primary" sx={{ fontWeight: 700 }}>
              Menu Management
            </Typography>
          </Breadcrumbs>

          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Menu Management
          </Typography>
        </Box>

        {/* Navigation Tabs */}
        <Paper elevation={1} sx={{ borderRadius: 3, backgroundColor: 'background.paper', px: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                minHeight: 48,
              },
            }}
          >
            <Tab icon={<RestaurantMenuIcon />} iconPosition="start" label="Menu Items" />
            <Tab icon={<CategoryIcon />} iconPosition="start" label="Categories" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Box sx={{ mt: 1 }}>
          {activeTab === 0 && <MenuItemsPage />}
          {activeTab === 1 && <CategoriesPage />}
        </Box>
      </Box>
    </PageContainer>
  );
};

export default MenuPage;
