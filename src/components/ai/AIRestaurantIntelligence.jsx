import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Button,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { toast } from 'react-toastify';

import aiService from '../../services/ai.service';

export const AIRestaurantIntelligence = () => {
  const [loading, setLoading] = useState(true);
  const [shortages, setShortages] = useState([]);
  const [reorders, setReorders] = useState([]);
  const [pricingSuggestions, setPricingSuggestions] = useState([]);
  const [wasteData, setWasteData] = useState(null);

  // Prep Time Simulator State
  const [dishName, setDishName] = useState('Woodfired Truffle Pizza');
  const [orderQty, setOrderQty] = useState(2);
  const [prepEstimate, setPrepEstimate] = useState(null);
  const [estimating, setEstimating] = useState(false);

  useEffect(() => {
    const fetchAIAnalytics = async () => {
      setLoading(true);
      try {
        const [shortageRes, reorderRes, pricingRes, wasteRes] = await Promise.all([
          aiService.predictShortages(),
          aiService.recommendReorders(),
          aiService.suggestMenuPricing(),
          aiService.analyzeWaste(),
        ]);

        setShortages(shortageRes.data || []);
        setReorders(reorderRes.data || []);
        setPricingSuggestions(pricingRes.data || []);
        setWasteData(wasteRes.data || null);
      } catch (err) {
        toast.error('Failed to load AI predictive telemetry');
      } finally {
        setLoading(false);
      }
    };

    fetchAIAnalytics();
  }, []);

  const handleEstimatePrep = async () => {
    setEstimating(true);
    try {
      const res = await aiService.estimatePrepTime(dishName, orderQty);
      setPrepEstimate(res.data);
      toast.success('AI prep time calculation updated!');
    } catch (err) {
      toast.error('Failed to estimate prep time');
    } finally {
      setEstimating(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress color="primary" />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 700 }}>
          Running Neural Predictive Models & Inventory Telemetry...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Module Title Banner */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3.5,
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#4F46E5', width: 50, height: 50, boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)' }}>
            <AutoAwesomeIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
              RestaurantOS AI Intelligence Suite
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              Neural forecasting, demand optimization, and waste diagnostics engine
            </Typography>
          </Box>
        </Box>

        <Chip
          label="AI Model v4.2 Active"
          color="success"
          size="small"
          sx={{ fontWeight: 800, px: 1, height: 28 }}
        />
      </Paper>

      {/* Grid of 5 AI Capabilities */}
      <Grid container spacing={3}>
        {/* 1. Predict Ingredient Shortages */}
        <Grid item xs={12} lg={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <WarningAmberIcon color="error" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Predict Ingredient Shortages
                </Typography>
              </Box>
              <Chip label="AI Shortage Alert" color="error" variant="outlined" size="small" sx={{ fontWeight: 700 }} />
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Predictive stockout dates based on historical sales velocity and daily consumption rates
            </Typography>

            <List disablePadding>
              {shortages.map((item, idx) => (
                <React.Fragment key={idx}>
                  <ListItem sx={{ px: 0, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {item.ingredient}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Current: {item.currentStock} • Min Threshold: {item.reorderPoint}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        label={item.projectedStockout}
                        color={item.riskLevel === 'HIGH' ? 'error' : 'warning'}
                        size="small"
                        sx={{ fontWeight: 800, height: 22, fontSize: '0.68rem', mb: 0.5 }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Confidence: {item.confidence}
                      </Typography>
                    </Box>
                  </ListItem>
                  {idx < shortages.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* 2. Recommend Stock Reorder Quantities */}
        <Grid item xs={12} lg={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <ShoppingCartIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Recommend Stock Reorder Quantities
                </Typography>
              </Box>
              <Chip label="EOQ Optimization" color="primary" variant="outlined" size="small" sx={{ fontWeight: 700 }} />
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              AI Economic Order Quantity (EOQ) recommendations to minimize holding and stockout costs
            </Typography>

            <List disablePadding>
              {reorders.map((item, idx) => (
                <React.Fragment key={idx}>
                  <ListItem sx={{ px: 0, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {item.ingredient}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Supplier: {item.supplier} • Model: {item.eoqModel}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        + {item.recommendedQty}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Est. Cost: ${item.estimatedCost.toFixed(2)}
                      </Typography>
                    </Box>
                  </ListItem>
                  {idx < reorders.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* 3. Suggest Menu Pricing */}
        <Grid item xs={12} lg={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <AttachMoneyIcon color="success" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Suggest Menu Pricing
                </Typography>
              </Box>
              <Chip label="Margin Engine" color="success" variant="outlined" size="small" sx={{ fontWeight: 700 }} />
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Dynamic AI price optimization balancing ingredient cost surges and consumer price elasticity
            </Typography>

            <List disablePadding>
              {pricingSuggestions.map((item, idx) => (
                <React.Fragment key={idx}>
                  <ListItem sx={{ px: 0, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ pr: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {item.menuItem}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {item.recommendation}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'right', minWidth: 110 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through', display: 'block' }}>
                        ${item.currentPrice.toFixed(2)}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'success.main' }}>
                        ${item.suggestedPrice.toFixed(2)}
                      </Typography>
                      <Chip label={`Margin: ${item.margin}`} size="small" color="success" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800 }} />
                    </Box>
                  </ListItem>
                  {idx < pricingSuggestions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* 4. Estimate Food Preparation Time */}
        <Grid item xs={12} lg={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <AccessTimeIcon color="info" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Estimate Food Preparation Time
                </Typography>
              </Box>
              <Chip label="Kitchen AI Engine" color="info" variant="outlined" size="small" sx={{ fontWeight: 700 }} />
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Calculate kitchen prep & cook duration based on order volume, recipe steps, and line queue
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Dish / Recipe Name"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    label="Order Quantity"
                    value={orderQty}
                    onChange={(e) => setOrderQty(Number(e.target.value))}
                  />
                </Grid>
              </Grid>

              <Button
                variant="contained"
                color="info"
                onClick={handleEstimatePrep}
                disabled={estimating}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
              >
                {estimating ? <CircularProgress size={20} color="inherit" /> : 'Run AI Prep Estimator'}
              </Button>

              {prepEstimate && (
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'info.main' }}>
                      Estimated Prep Duration: {prepEstimate.estimatedMinutes} Minutes
                    </Typography>
                    <Chip label={`AI Confidence ${prepEstimate.confidence}`} size="small" color="info" sx={{ fontWeight: 800, height: 20 }} />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Station: {prepEstimate.station} • Active Queue: {prepEstimate.activeStationQueue}
                  </Typography>
                </Paper>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* 5. Analyze Ingredient Waste & Recommendations */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <DeleteSweepIcon color="warning" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Analyze Ingredient Waste & Recommendations
                </Typography>
              </Box>
              <Chip label="Food Waste Diagnostic" color="warning" variant="outlined" size="small" sx={{ fontWeight: 700 }} />
            </Box>

            {wasteData && (
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200', textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      Est. Monthly Food Waste Loss
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.main', my: 0.5 }}>
                      ${wasteData.monthlyWasteCost.toFixed(2)}
                    </Typography>
                    <Chip label={wasteData.wasteReductionOpportunity} color="success" size="small" sx={{ fontWeight: 800 }} />
                  </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                    Actionable Operational Recommendations:
                  </Typography>
                  <List disablePadding>
                    {wasteData.recommendations.map((rec, idx) => (
                      <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={rec}
                          slotProps={{ primary: { fontSize: '0.85rem', fontWeight: 600 } }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AIRestaurantIntelligence;
