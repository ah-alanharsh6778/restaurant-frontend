import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import Footer from '../Footer';

export const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Sticky Navbar */}
      <Navbar onToggleSidebar={handleToggleSidebar} sidebarOpen={sidebarOpen} />

      {/* Main Container */}
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Collapsible Sidebar */}
        <Sidebar
          open={sidebarOpen}
          isMobile={isMobile}
          onCloseMobile={() => setSidebarOpen(false)}
        />

        {/* Page View Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2.5, sm: 3.5 },
            width: '100%',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: (theme) => theme.palette.background.default,
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Outlet />
          </Box>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
