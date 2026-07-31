import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Chip,
  Avatar,
  Button,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../layout/PageContainer';
import { useAuth } from '../../hooks/useAuth';
import { normaliseRole } from '../../utils/rbac';
import tableService from '../../services/table.service';
import { GlassCard } from '../../components/ui';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Tables data state for live open tables counter
  const [tables, setTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(true);

  const userRole = normaliseRole(user?.role);
  const canViewExpenses = !['WAITER', 'CHEF'].includes(userRole);

  const fetchTables = useCallback(async () => {
    try {
      setLoadingTables(true);
      const res = await tableService.getTables();
      const list = Array.isArray(res) ? res : res?.data || res?.items || [];
      setTables(list);
    } catch (err) {
      console.error('Failed to load tables for dashboard:', err);
    } finally {
      setLoadingTables(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [fetchTables]);

  const getUserFullName = () => {
    if (!user) return 'User';
    if (user.name) return user.name;
    if (user.fullName) return user.fullName;
    if (user.firstName) {
      return `${user.firstName} ${user.lastName || ''}`.trim();
    }
    if (user.email) return user.email.split('@')[0];
    return 'User';
  };

  const fullName = getUserFullName();
  const role = user?.role || 'Administrator';

  const formattedDate = currentDateTime.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = currentDateTime.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Table calculations
  const totalTables = tables.length;
  const occupiedTables = tables.filter((t) => t.status === 'OCCUPIED' || t.status === 'IN_USE' || t.status === 'RESERVED').length;
  const availableTables = tables.filter((t) => t.status === 'AVAILABLE' || !t.status).length;
  const occupancyRate = totalTables > 0 ? Math.round((occupiedTables / totalTables) * 100) : 0;

  const overviewCards = [
    {
      title: 'Dining Tables',
      metric: loadingTables ? '...' : `${occupiedTables} Open Tables`,
      subtitle: `${availableTables} Available / ${totalTables} Total (${occupancyRate}% Occupied)`,
      icon: <TableRestaurantIcon fontSize="large" sx={{ color: '#16A34A' }} />,
      route: '/tables',
      color: 'success',
      tag: `${occupiedTables} Open`,
    },
    {
      title: 'POS Orders',
      metric: 'Order Pipeline',
      subtitle: 'Real-time kitchen queue & billing',
      icon: <ShoppingCartIcon fontSize="large" color="primary" />,
      route: '/orders',
      color: 'primary',
      tag: 'Live POS',
    },
    {
      title: 'Inventory & Ingredients',
      metric: 'Stock Management',
      subtitle: 'Ingredient levels & reorder alerts',
      icon: <InventoryIcon fontSize="large" color="secondary" />,
      route: '/ingredients',
      color: 'secondary',
      tag: 'Stock',
    },
    ...(canViewExpenses
      ? [
          {
            title: 'Operational Expenses',
            metric: 'Financial Ledger',
            subtitle: 'OCR invoices & expense entries',
            icon: <AttachMoneyIcon fontSize="large" sx={{ color: '#F59E0B' }} />,
            route: '/expenses',
            color: 'warning',
            tag: 'Expenses',
          },
        ]
      : []),
  ];

  return (
    <PageContainer maxWidth={false}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
        {/* Welcome Header Banner (Strict Rectangular Layout) */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: '4px',
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.95) 0%, rgba(0, 172, 193, 0.9) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 12px 32px -4px rgba(25, 118, 210, 0.3)',
            color: '#FFFFFF',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid xs={12} md={7}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 1 }}>
                <Avatar
                  variant="square"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                    width: 56,
                    height: 56,
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                  }}
                >
                  <PersonIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, fontSize: { xs: '1.6rem', sm: '2.2rem' } }}>
                    Welcome back, {fullName}!
                  </Typography>
                  <Chip
                    label={`Role: ${role}`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.25)',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      mt: 0.5,
                      borderRadius: '4px',
                    }}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid xs={12} md={5}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: { xs: 'flex-start', md: 'flex-end' },
                  gap: 0.8,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(255, 255, 255, 0.15)', px: 2, py: 0.6, borderRadius: '4px' }}>
                  <CalendarTodayIcon fontSize="small" />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {formattedDate}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(255, 255, 255, 0.15)', px: 2, py: 0.6, borderRadius: '4px' }}>
                  <AccessTimeIcon fontSize="small" />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {formattedTime}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Live Overview Cards Grid */}
        <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.2px' }}>
          Live Restaurant Operations
        </Typography>

        <Grid container spacing={3}>
          {overviewCards.map((card) => (
            <Grid xs={12} sm={6} md={canViewExpenses ? 3 : 4} key={card.title}>
              <GlassCard
                gradient
                glowOnHover
                padding={3}
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                onClick={() => navigate(card.route)}
              >
                <Box>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Avatar
                      variant="square"
                      sx={{
                        bgcolor: 'rgba(0, 0, 0, 0.04)',
                        width: 52,
                        height: 52,
                        borderRadius: '4px',
                      }}
                    >
                      {card.icon}
                    </Avatar>
                    <Chip
                      label={card.tag}
                      color={card.color}
                      size="small"
                      sx={{ fontWeight: 800, borderRadius: '4px' }}
                    />
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.5 }}>
                    {card.title}
                  </Typography>

                  <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                    {card.metric}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {card.subtitle}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" justifyContent="flex-end" mt={2}>
                  <Button
                    size="small"
                    endIcon={<ArrowForwardIcon fontSize="small" />}
                    sx={{ fontWeight: 800, textTransform: 'none', borderRadius: '4px' }}
                  >
                    Open Module
                  </Button>
                </Box>
              </GlassCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default DashboardPage;
