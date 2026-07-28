import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export const LiveOccupancyTimer = ({ startTime, isOccupied }) => {
  const [elapsed, setElapsed] = useState('00:00');

  useEffect(() => {
    if (!isOccupied) {
      setElapsed('00:00');
      return;
    }

    const start = startTime ? new Date(startTime).getTime() : Date.now() - 35 * 60 * 1000;

    const updateTimer = () => {
      const diff = Math.max(0, Math.floor((Date.now() - start) / 1000));
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      const formattedMin = String(minutes).padStart(2, '0');
      const formattedSec = String(seconds).padStart(2, '0');

      if (hours > 0) {
        const formattedHrs = String(hours).padStart(2, '0');
        setElapsed(`${formattedHrs}:${formattedMin}:${formattedSec}`);
      } else {
        setElapsed(`${formattedMin}:${formattedSec}`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime, isOccupied]);

  if (!isOccupied) return null;

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        bgcolor: 'error.50',
        color: 'error.main',
        px: 1,
        py: 0.25,
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: 'error.200',
      }}
    >
      <AccessTimeIcon sx={{ fontSize: 13 }} />
      <Typography variant="caption" sx={{ fontWeight: 800, fontFamily: 'monospace', letterSpacing: 0.5 }}>
        {elapsed}
      </Typography>
    </Box>
  );
};

export default LiveOccupancyTimer;
