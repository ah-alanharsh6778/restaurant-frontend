import { Card, CardContent, Typography, Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SupplierStatusChip from './SupplierStatusChip';

export const SupplierCard = ({ supplier, onView, onEdit, onDelete, onToggleStatus, onUploadInvoice }) => {
  const isActive = supplier.isActive !== undefined ? supplier.isActive : supplier.status !== 'INACTIVE';

  return (
    <Card
      elevation={2}
      onClick={() => onView && onView(supplier)}
      sx={{
        borderRadius: 3.5,
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 8px 24px rgba(0,0,0,0.5)'
              : '0 8px 24px rgba(37,99,235,0.12)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 3,
                bgcolor: 'primary.light',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LocalShippingIcon />
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={800}>
                {supplier.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Contact: {supplier.contactPerson || supplier.contact || 'N/A'}
              </Typography>
            </Box>
          </Box>

          <SupplierStatusChip status={supplier.status} />
        </Box>

        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <PhoneIcon fontSize="small" />
            <Typography variant="body2">{supplier.phone || supplier.contactPhone || 'No Phone'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <EmailIcon fontSize="small" />
            <Typography variant="body2">{supplier.email || 'No Email'}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, pt: 1.5, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            GST: {supplier.gstNumber || 'N/A'}
          </Typography>

          <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700 }}>
            Tap for Details & Actions →
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SupplierCard;
