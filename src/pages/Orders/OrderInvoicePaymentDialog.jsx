import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentsIcon from '@mui/icons-material/Payments';
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TableBarIcon from '@mui/icons-material/TableBar';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

import ResponsiveDialog from '../../components/common/ResponsiveDialog';
import orderService from '../../services/order.service';
import paymentService from '../../services/payment.service';

export const OrderInvoicePaymentDialog = ({
  open,
  onClose,
  order,
  onWorkflowComplete,
}) => {
  const queryClient = useQueryClient();

  const [discount, setDiscount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [amountPaid, setAmountPaid] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  useEffect(() => {
    if (order) {
      setDiscount(order.discount || 0);
      setTaxAmount(order.taxAmount || 0);
      const reqAmt = order.finalAmount || order.totalAmount || 0;
      setAmountPaid(reqAmt ? String(reqAmt) : '');
      setPaymentSuccess(null);
    }
  }, [order]);

  if (!order) return null;

  const rawTotal = order.totalAmount || 0;
  const numDiscount = Number(discount) || 0;
  const numTax = Number(taxAmount) || 0;
  const computedFinalAmount = Math.max(0, parseFloat((rawTotal - numDiscount + numTax).toFixed(2)));
  const numPaid = Number(amountPaid) || 0;
  const changeGiven = Math.max(0, parseFloat((numPaid - computedFinalAmount).toFixed(2)));

  const isOrderPaid = order.status === 'COMPLETED' || paymentSuccess !== null;

  // Print Invoice PDF / Document
  const handlePrintPDF = () => {
    toast.info('Opening clean printable invoice document...');
    window.print();
  };

  // Process Payment & Free Table via Backend Transaction
  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (numPaid < computedFinalAmount) {
      toast.error(`Amount paid ($${numPaid.toFixed(2)}) is less than final amount due ($${computedFinalAmount.toFixed(2)}).`);
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Update Order with Discount & Final Amount
      await orderService.updateOrder(order.id, {
        discount: numDiscount,
        taxAmount: numTax,
        status: 'COMPLETED',
      });

      // 2. Execute Payment via Backend (Auto-releases Table to AVAILABLE)
      const payRes = await paymentService.processPayment({
        orderId: order.id,
        paymentMethod,
        amountPaid: numPaid,
      });

      setPaymentSuccess(payRes);
      toast.success(`Payment processed! Order ${order.orderNumber} marked PAID and Table freed.`);

      // 3. Invalidate caches across Tables, Orders, Invoices, and Dashboard
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });

      if (onWorkflowComplete) {
        onWorkflowComplete();
      }
    } catch (err) {
      console.error('Payment Workflow Error:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to process payment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const orderItems = order.orderItems || order.items || [];
  const tableNum = order.table?.tableNumber || order.tableNumber || 'N/A';
  const invoiceRef = `INV-${order.id?.substring(0, 8).toUpperCase()}`;

  return (
    <>
      {/* Print-Only CSS Styles */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden !important;
            }
            #printable-invoice-receipt, #printable-invoice-receipt * {
              visibility: visible !important;
            }
            #printable-invoice-receipt {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              padding: 32px !important;
              background: #ffffff !important;
              color: #000000 !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
              display: block !important;
            }
          }
        `}
      </style>

      {/* Screen Checkout Modal */}
      <ResponsiveDialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        title={`Order Invoice & Checkout — ${order.orderNumber}`}
        subtitle={`Table ${tableNum} • Created ${dayjs(order.createdAt).format('MMM DD, YYYY HH:mm')}`}
        icon={ReceiptIcon}
        iconColor="primary.main"
      >
        <Box sx={{ py: 1 }}>
          {paymentSuccess && (
            <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2, borderRadius: 2 }}>
              <strong>Payment Completed Successfully!</strong> Transaction ID: <code>{paymentSuccess.transactionId || paymentSuccess.id}</code>. Order marked PAID and Table {tableNum} released to AVAILABLE.
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Left Column: Invoice Details & Items */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={800} color="text.primary">
                    Invoice Items & Charges
                  </Typography>
                  <Chip label={`Table ${tableNum}`} icon={<TableBarIcon />} size="small" color="primary" variant="outlined" sx={{ fontWeight: 700 }} />
                </Box>

                {/* Items List Table */}
                <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
                  <Box sx={{ display: 'flex', bgcolor: 'action.hover', p: 1.5, borderBottom: '1px solid', borderColor: 'divider', fontWeight: 800, fontSize: '0.8rem' }}>
                    <Box sx={{ flex: 2 }}>Item Description</Box>
                    <Box sx={{ width: 60, textAlign: 'center' }}>Qty</Box>
                    <Box sx={{ width: 90, textAlign: 'right' }}>Price</Box>
                    <Box sx={{ width: 100, textAlign: 'right' }}>Subtotal</Box>
                  </Box>
                  {orderItems.map((item, idx) => {
                    const mName = item.menuItem?.name || item.name || `Item #${idx + 1}`;
                    const qty = item.quantity || 1;
                    const price = item.price || item.unitPrice || 0;
                    const itemSub = item.subtotal || price * qty;
                    return (
                      <Box key={idx} sx={{ display: 'flex', p: 1.5, borderBottom: idx < orderItems.length - 1 ? '1px solid' : 'none', borderColor: 'divider', fontSize: '0.875rem' }}>
                        <Box sx={{ flex: 2, fontWeight: 700 }}>{mName}</Box>
                        <Box sx={{ width: 60, textAlign: 'center', color: 'text.secondary' }}>{qty}</Box>
                        <Box sx={{ width: 90, textAlign: 'right', color: 'text.secondary' }}>${price.toFixed(2)}</Box>
                        <Box sx={{ width: 100, textAlign: 'right', fontWeight: 800 }}>${itemSub.toFixed(2)}</Box>
                      </Box>
                    );
                  })}
                </Box>

                {/* Invoice PDF Print Trigger */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    startIcon={<PrintIcon />}
                    onClick={handlePrintPDF}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                  >
                    Print / Download Invoice PDF
                  </Button>
                  <Typography variant="caption" color="text.secondary">
                    Invoice Ref: {invoiceRef}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Right Column: Discount & Payment Settlement */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Typography variant="subtitle1" fontWeight={800} color="text.primary" sx={{ mb: 2 }}>
                  Payment & Discount Settlement
                </Typography>

                {/* Calculations */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Gross Order Subtotal:</Typography>
                    <Typography variant="body2" fontWeight={800}>${rawTotal.toFixed(2)}</Typography>
                  </Box>

                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    label="Discount ($)"
                    placeholder="0.00"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    disabled={isOrderPaid || isSubmitting}
                  />

                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    label="Tax Amount ($)"
                    placeholder="0.00"
                    value={taxAmount}
                    onChange={(e) => setTaxAmount(e.target.value)}
                    disabled={isOrderPaid || isSubmitting}
                  />

                  <Divider sx={{ my: 0.5 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight={800}>Final Net Payable:</Typography>
                    <Typography variant="h6" fontWeight={800} color="success.main">${computedFinalAmount.toFixed(2)}</Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Payment Processing Form */}
                <Box component="form" onSubmit={handleProcessPayment} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={paymentMethod}
                      label="Payment Method"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      disabled={isOrderPaid || isSubmitting}
                    >
                      <MenuItem value="CASH">Cash Payment</MenuItem>
                      <MenuItem value="CARD">Credit / Debit Card</MenuItem>
                      <MenuItem value="UPI">UPI / Digital Wallet</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    required
                    type="number"
                    size="small"
                    label="Tendered Amount ($)"
                    placeholder={String(computedFinalAmount)}
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    disabled={isOrderPaid || isSubmitting}
                  />

                  {numPaid >= computedFinalAmount && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: 'action.hover', p: 1.5, borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary">Change Due to Guest:</Typography>
                      <Typography variant="subtitle2" fontWeight={800} color="primary.main">${changeGiven.toFixed(2)}</Typography>
                    </Box>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    disabled={isOrderPaid || isSubmitting}
                    startIcon={<PaymentsIcon />}
                    sx={{ py: 1.2, fontWeight: 800, borderRadius: 2, mt: 1 }}
                  >
                    {isSubmitting ? 'Processing Payment...' : isOrderPaid ? 'Order Paid & Completed' : `Settle $${computedFinalAmount.toFixed(2)} & Free Table`}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </ResponsiveDialog>

      {/* DEDICATED PRINTABLE INVOICE RECEIPT HTML (Only Visible During Browser Print / PDF Export) */}
      <div id="printable-invoice-receipt" style={{ display: 'none' }}>
        <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '16px', marginBottom: '20px' }}>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '24px', fontWeight: '800', textTransform: 'uppercase' }}>
            RestaurantOS Official Invoice
          </h1>
          <p style={{ margin: '0', fontSize: '13px', color: '#444' }}>
            Fine Dining & Culinary Telemetry • Official Tax Invoice & Guest Receipt
          </p>
        </div>

        {/* Invoice Metadata Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '14px', lineHeight: '1.6' }}>
          <div>
            <div><strong>Invoice Ref:</strong> {invoiceRef}</div>
            <div><strong>Order Number:</strong> {order.orderNumber}</div>
            <div><strong>Restaurant Table:</strong> Table {tableNum}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div><strong>Date & Time:</strong> {dayjs(order.createdAt).format('MMM DD, YYYY hh:mm A')}</div>
            <div><strong>Payment Status:</strong> {isOrderPaid ? 'PAID' : 'UNPAID / PENDING'}</div>
            {isOrderPaid && (
              <div><strong>Payment Method:</strong> {paymentSuccess?.paymentMethod || paymentMethod}</div>
            )}
          </div>
        </div>

        {/* Line Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #000' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>#</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Item Description</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Qty</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Unit Price ($)</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Subtotal ($)</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, idx) => {
              const mName = item.menuItem?.name || item.name || `Item #${idx + 1}`;
              const qty = item.quantity || 1;
              const price = item.price || item.unitPrice || 0;
              const itemSub = item.subtotal || price * qty;
              return (
                <tr key={idx} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{idx + 1}</td>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{mName}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{qty}</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>${price.toFixed(2)}</td>
                  <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>${itemSub.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Financial Summary */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
          <div style={{ width: '280px', fontSize: '14px', lineHeight: '1.8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Gross Subtotal:</span>
              <span>${rawTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Discount Applied:</span>
              <span>-${numDiscount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tax Amount:</span>
              <span>+${numTax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #000', paddingTop: '8px', marginTop: '8px', fontSize: '18px', fontWeight: 'bold' }}>
              <span>Net Final Amount:</span>
              <span>${computedFinalAmount.toFixed(2)}</span>
            </div>
            {isOrderPaid && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#444', marginTop: '6px' }}>
                <span>Amount Tendered ({paymentSuccess?.paymentMethod || paymentMethod}):</span>
                <span>${numPaid.toFixed(2)} (Change: ${changeGiven.toFixed(2)})</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', borderTop: '1px solid #ccc', paddingTop: '16px', fontSize: '12px', color: '#666' }}>
          <p style={{ margin: '0 0 4px 0' }}>Thank you for dining with us! Please retain this invoice for your records.</p>
          <p style={{ margin: 0 }}>RestaurantOS Enterprise Management • {dayjs().format('YYYY')}</p>
        </div>
      </div>
    </>
  );
};

export default OrderInvoicePaymentDialog;
