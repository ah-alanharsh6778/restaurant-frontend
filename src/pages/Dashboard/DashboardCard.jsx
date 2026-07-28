import { Card, CardContent, Box, Typography, Avatar, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export const DashboardCard = ({
  title,
  value,
  icon,
  color = 'primary',
  trend,
  trendText,
  subtitle,
}) => {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <Card
      elevation={3}
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.22s ease-in-out',
        borderRadius: 3.5,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[4],
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
            {title}
          </Typography>
          <Avatar
            sx={{
              bgcolor: `${color}.main`,
              color: `${color}.contrastText`,
              width: 44,
              height: 44,
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            {icon}
          </Avatar>
        </Box>

        <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
          {value}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {trend !== undefined && (
            <Chip
              size="small"
              icon={isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
              label={`${isPositive ? '+' : ''}${trend}%`}
              color={isPositive ? 'success' : 'error'}
              sx={{ height: 22, fontSize: '0.75rem', fontWeight: 800 }}
            />
          )}

          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {trendText || subtitle || 'vs last month'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
