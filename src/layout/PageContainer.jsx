import React from 'react';
import { Box, Container, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { MdNavigateNext } from 'react-icons/md';

/**
 * Standardized Page Container enforcing Global Layout System rules:
 * - Responsive Container Paddings (Mobile: 16px, Tablet: 24px, Desktop: 32px)
 * - Maximum Content Width cap (default 1440px)
 * - Standard Page Header, Breadcrumbs & Header Actions slot
 */
export const PageContainer = ({
  children,
  title,
  subtitle,
  actions,
  breadcrumbs = [],
  maxWidth = 'xl', // 'sm' | 'md' | 'lg' | 'xl' | false
  disableGutters = false,
  sx = {},
}) => {
  const location = useLocation();

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 'calc(100vh - var(--navbar-height, 70px))',
        boxSizing: 'border-box',
        py: { xs: 2.5, sm: 3, md: 4 },
        px: disableGutters ? 0 : { xs: 2, sm: 3, md: 4 }, // 16px, 24px, 32px
        transition: 'padding 0.25s ease',
        ...sx,
      }}
    >
      <Container
        maxWidth={maxWidth}
        disableGutters
        sx={{
          maxWidth: maxWidth === 'xl' ? '1440px !important' : undefined,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {/* Optional Page Header */}
        {(title || breadcrumbs.length > 0 || actions) && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
              mb: 1,
            }}
          >
            <Box>
              {/* Breadcrumb Navigation */}
              {breadcrumbs.length > 0 && (
                <Breadcrumbs
                  separator={<MdNavigateNext size={16} />}
                  aria-label="breadcrumb"
                  sx={{ mb: 1, '& .MuiBreadcrumbs-li': { fontSize: '0.8125rem' } }}
                >
                  <MuiLink component={Link} to="/dashboard" color="inherit" underline="hover">
                    Dashboard
                  </MuiLink>
                  {breadcrumbs.map((crumb, idx) => {
                    const isLast = idx === breadcrumbs.length - 1;
                    return isLast || !crumb.path ? (
                      <Typography key={idx} color="text.primary" fontSize="0.8125rem" fontWeight={600}>
                        {crumb.label}
                      </Typography>
                    ) : (
                      <MuiLink key={idx} component={Link} to={crumb.path} color="inherit" underline="hover">
                        {crumb.label}
                      </MuiLink>
                    );
                  })}
                </Breadcrumbs>
              )}

              {/* Page Title & Subtitle */}
              {title && (
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: 'text.primary',
                  }}
                >
                  {title}
                </Typography>
              )}

              {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>

            {/* Top Right Actions Slot */}
            {actions && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                  gap: 1.5,
                  flexWrap: 'wrap',
                  ml: { sm: 'auto' },
                }}
              >
                {actions}
              </Box>
            )}
          </Box>
        )}

        {/* Main Content Area */}
        <Box sx={{ width: '100%', flexGrow: 1 }}>{children}</Box>
      </Container>
    </Box>
  );
};

export default PageContainer;
