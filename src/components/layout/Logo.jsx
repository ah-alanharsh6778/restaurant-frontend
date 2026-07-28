import { Box, Typography } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { useNavigate } from 'react-router-dom';

export const Logo = ({ size = 'medium', onClick }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/dashboard');
    }
  };

  const iconSizes = {
    small: { box: 32, icon: 'small', font: 'h6' },
    medium: { box: 38, icon: 'medium', font: 'h6' },
    large: { box: 48, icon: 'large', font: 'h5' },
  };

  const currentSize = iconSizes[size] || iconSizes.medium;

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1.2}
      onClick={handleLogoClick}
      sx={{ cursor: 'pointer', userSelect: 'none' }}
    >
      <Box
        sx={{
          width: currentSize.box,
          height: currentSize.box,
          borderRadius: 2.5,
          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
        }}
      >
        <RestaurantMenuIcon fontSize={currentSize.icon} />
      </Box>
      <Typography variant={currentSize.font} fontWeight={800} letterSpacing="-0.02em" color="text.primary">
        RestaurantOS
      </Typography>
    </Box>
  );
};

export default Logo;
