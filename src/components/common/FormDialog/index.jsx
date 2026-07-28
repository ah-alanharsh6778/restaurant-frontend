import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const FormDialog = ({
  open,
  title,
  children,
  onClose,
  maxWidth = 'sm',
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      slotProps={{
        paper: {
          elevation: 5,
          sx: { borderRadius: 3.5, p: 1 },
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, pr: 6, fontWeight: 700 }}>
        {title}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Box sx={{ pt: 1 }}>{children}</Box>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
