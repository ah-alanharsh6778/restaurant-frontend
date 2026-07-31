import { Card, CardContent, Box, Typography, Avatar, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export const KPICard = ({
  title,
  value,
  icon,
  color = 'primary',
  trend,
  trendText,
  subtitle,
}) => {
  const isPositive = trend > 0;

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '4px',
        border: '1px solid var(--border-subdued)',
        backgroundColor: 'var(--bg-surface)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: 'var(--primary-500)',
          boxShadow: 'var(--shadow-md)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
            {title}
          </Typography>
          <Avatar
            variant="square"
            sx={{
              bgcolor: `${color}.light`,
              color: `${color}.dark`,
              width: 44,
              height: 44,
              borderRadius: '4px',
              opacity: 0.9,
            }}
          >
            {icon}
          </Avatar>
        </Box>

        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          {value}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {trend !== undefined && (
            <Chip
              size="small"
              icon={isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
              label={`${isPositive ? '+' : ''}${trend}%`}
              color={isPositive ? 'success' : 'error'}
              sx={{ height: 22, fontSize: '0.75rem', fontWeight: 700, borderRadius: '4px' }}
            />
          )}

          <Typography variant="caption" color="text.secondary">
            {trendText || subtitle || 'vs. last month'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default KPICard;
