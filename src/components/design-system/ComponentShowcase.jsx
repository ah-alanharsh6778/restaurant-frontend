import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Stack,
  Divider,
} from '@mui/material';
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdFilterList,
  MdRestaurant,
  MdShoppingCart,
  MdAttachMoney,
  MdPeople,
  MdStar,
  MdCloudUpload,
} from 'react-icons/md';

import PageContainer from '../../layout/PageContainer';
import {
  Button,
  Card,
  GlassCard,
  Modal,
  Input,
  Search,
  Dropdown,
  Select,
  Table,
  Badge,
  Avatar,
  AvatarGroup,
  Tabs,
  ToastAlert,
  showToast,
  Loader,
  Progress,
  StatCard,
} from '../ui';

export const ComponentShowcase = () => {
  // Component Interactive States
  const [modalOpen, setModalOpen] = useState(false);
  const [tabValue, setTabValue] = useState('orders');
  const [selectValue, setSelectValue] = useState('dine-in');
  const [multiSelectValue, setMultiSelectValue] = useState(['chef', 'waiter']);
  const [inputValue, setInputValue] = useState('Truffle Mushroom Pasta');
  const [searchQuery, setSearchQuery] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);

  const sampleTableRows = [
    { id: '#ORD-9821', table: 'Table 04', items: '2x Steak, 1x Wine', total: '$148.50', status: 'ready', time: '12 mins ago' },
    { id: '#ORD-9822', table: 'Table 12', items: '1x Pasta, 1x Salad', total: '$42.00', status: 'preparing', time: '5 mins ago' },
    { id: '#ORD-9823', table: 'Bar 02', items: '3x Craft Beer', total: '$27.00', status: 'served', time: ' Just now' },
  ];

  const handleSimulateLoading = () => {
    setButtonLoading(true);
    setTimeout(() => {
      setButtonLoading(false);
      showToast.success('Simulated task completed successfully!');
    }, 2000);
  };

  return (
    <PageContainer
      title="STEP 3 — Reusable UI Components"
      subtitle="Interactive Component Suite: 16 original, theme-aware components supporting Light/Dark modes, Glassmorphism, and spring animations."
      breadcrumbs={[{ label: 'Design System', path: '/design-system' }, { label: 'UI Components' }]}
    >
      {/* 1. Stat Cards Showcase */}
      <Box mb={6}>
        <Typography variant="h5" fontWeight={800} mb={3}>
          1. Stat Cards (KPI & Metric Cards)
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Daily Revenue"
              value="$4,285.50"
              trend="+18.4%"
              trendDirection="up"
              subtitle="vs yesterday"
              color="primary"
              icon={<MdAttachMoney size={24} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active POS Orders"
              value="38 Orders"
              trend="+6 Orders"
              trendDirection="up"
              subtitle="Live kitchen queue"
              color="secondary"
              icon={<MdShoppingCart size={24} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Avg Table Turn"
              value="34 mins"
              trend="-4 mins"
              trendDirection="down"
              subtitle="Faster turnover"
              color="success"
              icon={<MdRestaurant size={24} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Guests"
              value="142 Guests"
              trend="+24 Guests"
              trendDirection="up"
              subtitle="Occupancy 88%"
              color="accent"
              icon={<MdPeople size={24} />}
            />
          </Grid>
        </Grid>
      </Box>

      {/* 2. Buttons & Actions */}
      <Box mb={6}>
        <Typography variant="h5" fontWeight={800} mb={3}>
          2. Button System (7 Variants, Sizes & States)
        </Typography>

        <Card sx={{ p: 4, borderRadius: '24px' }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" fontWeight={800} color="text.secondary" mb={1.5}>
                Button Variants
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <Button variant="contained" startIcon={<MdAdd />}>Primary Gradient</Button>
                <Button variant="glass" glow>Glassmorphism</Button>
                <Button variant="outlined" startIcon={<MdFilterList />}>Outlined</Button>
                <Button variant="soft">Soft Tint</Button>
                <Button variant="success">Success</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="danger" startIcon={<MdDelete />}>Danger</Button>
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" fontWeight={800} color="text.secondary" mb={1.5}>
                Button Sizes & Interactive Loading State
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
                <Button size="small" variant="contained">Small (32px)</Button>
                <Button size="medium" variant="contained">Medium (40px)</Button>
                <Button size="large" variant="contained">Large (48px)</Button>

                <Button
                  variant="glass"
                  loading={buttonLoading}
                  onClick={handleSimulateLoading}
                >
                  Click to Simulate Loading
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Card>
      </Box>

      {/* 3. Cards & GlassCards */}
      <Box mb={6}>
        <Typography variant="h5" fontWeight={800} mb={3}>
          3. Surface Card & GlassCard Components
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card
              title="Standard Surface Card"
              subtitle="Uses system surface background with smooth hover lift"
              action={
                <Button size="small" variant="soft">
                  Action
                </Button>
              }
              footer={
                <Button size="small" variant="contained">
                  Card Footer CTA
                </Button>
              }
            >
              <Typography variant="body2" color="text.secondary">
                Standard surface card component designed for forms, detail pages, and table views in RestaurantOS.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <GlassCard
              title="Glassmorphism Card"
              subtitle="Backdrop blur 16px with translucent border and ambient primary glow"
              gradient
              action={<Badge label="VIP GLASS" variant="glass" dot />}
            >
              <Typography variant="body2" color="text.secondary" mb={2}>
                High-end glass card with interactive ambient glow effects and mesh gradient background.
              </Typography>
              <Button variant="contained" fullWidth glow>
                Glass Card CTA Button
              </Button>
            </GlassCard>
          </Grid>
        </Grid>
      </Box>

      {/* 4. Form Controls: Input, Search, Dropdown, Select */}
      <Box mb={6}>
        <Typography variant="h5" fontWeight={800} mb={3}>
          4. Form Controls (Input, Search, Dropdown, Select)
        </Typography>

        <Card sx={{ p: 4, borderRadius: '24px' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Input
                label="Dish / Item Title"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter item title"
                startIcon={<MdRestaurant />}
                helperText="Appears on POS menu and guest digital receipts."
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Search
                placeholder="Global Search (Orders, Recipes, Ingredients)..."
                value={searchQuery}
                onSearch={(q) => setSearchQuery(q)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Select
                label="Order Dining Option"
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                options={[
                  { label: 'Dine-In Table POS', value: 'dine-in' },
                  { label: 'Takeaway / Counter Pick', value: 'takeaway' },
                  { label: 'Online Delivery Feed', value: 'delivery' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Select
                label="Assigned Kitchen Staff (Multi-Select)"
                multiple
                value={multiSelectValue}
                onChange={(e) => setMultiSelectValue(e.target.value)}
                options={[
                  { label: 'Head Chef Marco', value: 'chef' },
                  { label: 'Sous Chef Elena', value: 'sous-chef' },
                  { label: 'Waiter Alex', value: 'waiter' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" fontWeight={700} display="block" mb={0.8}>
                Action Dropdown Popover
              </Typography>
              <Dropdown
                trigger={
                  <Button variant="outlined" fullWidth startIcon={<MdFilterList />}>
                    Open Action Dropdown
                  </Button>
                }
                items={[
                  { label: 'Edit Dish Recipe', icon: <MdEdit />, onClick: () => showToast.info('Editing Recipe...') },
                  { label: 'Print Kitchen Ticket', icon: <MdRestaurant />, onClick: () => showToast.success('Printing Ticket...') },
                  { divider: true },
                  { label: 'Delete Item', icon: <MdDelete />, danger: true, onClick: () => showToast.error('Deleted item') },
                ]}
              />
            </Grid>
          </Grid>
        </Card>
      </Box>

      {/* 5. Navigation & Status Components: Tabs, Badges, Avatars, Toast */}
      <Box mb={6}>
        <Typography variant="h5" fontWeight={800} mb={3}>
          5. Navigation Tabs, Badges, Avatars & Toast Alerts
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card title="Tabs & Badges" sx={{ p: 3, borderRadius: '20px' }}>
              <Box mb={3}>
                <Tabs
                  value={tabValue}
                  onChange={(e, val) => setTabValue(val)}
                  tabs={[
                    { value: 'orders', label: 'POS Orders', badge: 12 },
                    { value: 'tables', label: 'Active Tables', badge: 8 },
                    { value: 'recipes', label: 'Kitchen Prep' },
                  ]}
                />
              </Box>

              <Typography variant="subtitle2" fontWeight={800} mb={1}>
                Status Badges & Tags
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mb={3}>
                <Badge label="Active" variant="success" dot />
                <Badge label="Preparing" variant="warning" dot />
                <Badge label="Cancelled" variant="danger" dot />
                <Badge label="Info Tag" variant="info" />
                <Badge label="Primary" variant="primary" />
                <Badge label="Secondary" variant="secondary" />
                <Badge label="Glass Tag" variant="glass" />
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card title="Avatars & Toast Alerts" sx={{ p: 3, borderRadius: '20px' }}>
              <Box display="flex" alignItems="center" gap={3} mb={3}>
                <Avatar name="Head Chef" status="online" size="large" />
                <Avatar name="Sous Chef" status="busy" size="medium" />
                <Avatar name="Alex Waiter" status="offline" size="sm" />
                <AvatarGroup max={3}>
                  <Avatar name="User A" />
                  <Avatar name="User B" />
                  <Avatar name="User C" />
                  <Avatar name="User D" />
                </AvatarGroup>
              </Box>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Button size="small" variant="success" onClick={() => showToast.success('Order #9821 marked paid!')}>
                  Trigger Success Toast
                </Button>
                <Button size="small" variant="danger" onClick={() => showToast.error('Kitchen stock shortage alert!')}>
                  Trigger Error Toast
                </Button>
                <Button size="small" variant="warning" onClick={() => showToast.warning('Table 04 waiting > 20 mins')}>
                  Trigger Warning Toast
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* 6. Data Table & Modal Showcase */}
      <Box mb={6}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight={800}>
            6. Data Table & Glass Modal Dialog
          </Typography>
          <Button variant="contained" startIcon={<MdAdd />} onClick={() => setModalOpen(true)}>
            Open Glass Modal Dialog
          </Button>
        </Box>

        <Table
          columns={[
            { id: 'id', label: 'Order ID', minWidth: 120 },
            { id: 'table', label: 'Table / POS Source', minWidth: 140 },
            { id: 'items', label: 'Items Summary', minWidth: 200 },
            { id: 'total', label: 'Bill Total', minWidth: 120 },
            {
              id: 'status',
              label: 'Kitchen Status',
              minWidth: 140,
              render: (row, val) => (
                <Badge
                  label={val.toUpperCase()}
                  variant={val === 'ready' ? 'success' : val === 'preparing' ? 'warning' : 'info'}
                  dot
                />
              ),
            },
            { id: 'time', label: 'Time Elapsed', minWidth: 120 },
          ]}
          rows={sampleTableRows}
          totalCount={sampleTableRows.length}
        />
      </Box>

      {/* 7. Loaders & Progress System */}
      <Box mb={6}>
        <Typography variant="h5" fontWeight={800} mb={3}>
          7. Loaders & Progress Bar Indicators
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card title="Linear & Circular Progress" sx={{ p: 3, borderRadius: '20px' }}>
              <Stack spacing={3}>
                <Progress value={75} color="primary" />
                <Progress value={45} color="secondary" />
                <Progress value={90} color="success" />

                <Box display="flex" gap={3} alignItems="center">
                  <Progress variant="circular" value={82} color="primary" size={54} />
                  <Progress variant="circular" value={60} color="success" size={54} />
                  <Progress variant="circular" value={35} color="danger" size={54} />
                </Box>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card title="Kitchen Loader & Skeleton Shimmer" sx={{ p: 3, borderRadius: '20px' }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Loader variant="kitchen" text="Kitchen Order Syncing..." size={32} />
                </Grid>
                <Grid item xs={6}>
                  <Loader variant="skeleton" rows={3} height={36} />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Modal Dialog Instance */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Glassmorphic Order Dialog"
        subtitle="Create or edit RestaurantOS POS order details"
        actions={
          <>
            <Button variant="outlined" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setModalOpen(false);
                showToast.success('Order saved successfully!');
              }}
            >
              Save Order
            </Button>
          </>
        }
      >
        <Stack spacing={2} py={1}>
          <Input label="Table Number" placeholder="e.g. Table 05" defaultValue="Table 05" />
          <Select
            label="Order Type"
            defaultValue="dine-in"
            options={[
              { label: 'Dine-In', value: 'dine-in' },
              { label: 'Takeaway', value: 'takeaway' },
            ]}
          />
          <ToastAlert type="info" title="Kitchen Notice" message="Orders placed before 2 PM apply lunch discount rate." />
        </Stack>
      </Modal>
    </PageContainer>
  );
};

export default ComponentShowcase;
