import React from 'react';
import { Paper, Box, Typography, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export const UploadCard = ({
  title = 'Upload Document',
  subtitle = 'Drag & drop files here or click to browse',
  accept = '.pdf,.png,.jpg,.jpeg',
  onUpload,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        textAlign: 'center',
        borderRadius: 3,
        border: '2px dashed',
        borderColor: 'primary.light',
        bgcolor: 'background.paper',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'action.hover',
        },
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          bgcolor: 'primary.50',
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2,
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 32 }} />
      </Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {subtitle}
      </Typography>
      <Button variant="outlined" component="label" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
        Browse Files
        <input
          type="file"
          hidden
          accept={accept}
          onChange={(e) => onUpload && onUpload(e.target.files)}
        />
      </Button>
    </Paper>
  );
};

export default UploadCard;
