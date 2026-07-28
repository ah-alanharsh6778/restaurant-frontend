import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';

export const SummaryCard = ({
  title,
  value,
  icon,
  bgColor = '#EFF6FF',
  borderColor = '#93C5FD',
  isWarning = false,
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        p: 0.5,
        borderRadius: 3,
        border: '1px solid',
        borderColor: borderColor,
        bgcolor: 'background.paper',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: isWarning ? 'warning.main' : 'text.primary' }}>
              {value}
            </Typography>
          </Box>
          {icon && (
            <Avatar
              sx={{
                bgcolor: bgColor,
                width: 44,
                height: 44,
                borderRadius: 2.5,
              }}
            >
              {icon}
            </Avatar>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export const StatisticCard = SummaryCard;
export const DashboardCard = SummaryCard;

export default SummaryCard;
