import React from 'react';
import { Box, Typography, Breadcrumbs, Link as MuiLink, Stack, Button, IconButton, Tooltip, useTheme, useMediaQuery } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

export const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [], // Array of { label, path }
  primaryAction = null, // { label, onClick, icon }
  secondaryAction = null, // { label, onClick, icon }
  onRefresh,
  onExport,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        mb: 3,
        pb: 1,
      }}
    >
      {/* Left: Breadcrumbs + Title + Subtitle */}
      <Box sx={{ flexGrow: 1 }}>
        {breadcrumbs.length > 0 && (
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" sx={{ color: 'text.disabled' }} />}
            aria-label="breadcrumb"
            sx={{ mb: 0.5, fontSize: '0.825rem' }}
          >
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return isLast ? (
                <Typography key={idx} color="text.primary" sx={{ fontSize: '0.825rem', fontWeight: 600 }}>
                  {crumb.label}
                </Typography>
              ) : (
                <MuiLink
                  key={idx}
                  underline="hover"
                  color="inherit"
                  sx={{ cursor: 'pointer', fontSize: '0.825rem', fontWeight: 500 }}
                  onClick={() => crumb.path && navigate(crumb.path)}
                >
                  {crumb.label}
                </MuiLink>
              );
            })}
          </Breadcrumbs>
        )}

        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          sx={{
            fontWeight: 800,
            color: 'text.primary',
            letterSpacing: '-0.5px',
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 400 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Right: Actions */}
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: 'center',
          flexWrap: 'wrap',
          width: { xs: '100%', md: 'auto' },
          justifyContent: { xs: 'flex-start', md: 'flex-end' },
          ml: { md: 'auto' },
        }}
      >
        {onRefresh && (
          <Tooltip title="Refresh Data">
            <IconButton
              onClick={onRefresh}
              size="medium"
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: '#FFFFFF',
                borderRadius: 2.5,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <RefreshIcon fontSize="small" color="action" />
            </IconButton>
          </Tooltip>
        )}

        {onExport && (
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<FileDownloadIcon />}
            onClick={onExport}
            sx={{
              borderRadius: 2.5,
              textTransform: 'none',
              fontWeight: 600,
              bgcolor: '#FFFFFF',
              borderColor: 'divider',
            }}
          >
            Export
          </Button>
        )}

        {secondaryAction && (
          <Button
            variant="outlined"
            color={secondaryAction.color || 'primary'}
            startIcon={secondaryAction.icon}
            onClick={secondaryAction.onClick}
            sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 600 }}
          >
            {secondaryAction.label}
          </Button>
        )}

        {primaryAction && (
          <Button
            variant="contained"
            color={primaryAction.color || 'primary'}
            startIcon={primaryAction.icon || <AddIcon />}
            onClick={primaryAction.onClick}
            sx={{
              borderRadius: 2.5,
              textTransform: 'none',
              fontWeight: 700,
              px: 2.5,
              py: 1,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
            }}
          >
            {primaryAction.label}
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default PageHeader;
