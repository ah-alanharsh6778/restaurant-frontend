import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Navbar from './Navbar';
import Sidebar, { SIDEBAR_WIDTH, COLLAPSED_SIDEBAR_WIDTH } from './Sidebar';

export const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleMobileToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleMobileClose = () => {
    setMobileOpen(false);
  };

  const handleToggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-canvas)',
        color: 'var(--text-primary)',
        overflowX: 'hidden',
        transition: 'background-color 0.25s ease, color 0.25s ease',
      }}
    >
      {/* Fixed Glass Navbar */}
      <Navbar onMobileToggle={handleMobileToggle} collapsed={collapsed} />

      {/* Sidebar Navigation Drawer */}
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={handleMobileClose}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content Viewport Shell */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: '100%',
            md: `calc(100% - ${collapsed ? COLLAPSED_SIDEBAR_WIDTH : SIDEBAR_WIDTH}px)`,
          },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
          transition: (theme) =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        {/* Navbar Offset Spacer */}
        <Toolbar sx={{ minHeight: { xs: '60px !important', md: '70px !important' } }} />

        {/* Dynamic Page Outlet Container */}
        <Box sx={{ flexGrow: 1, overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
