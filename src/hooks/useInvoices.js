/**
 * RestaurantOS — Invoice React Query Hooks
 * All hooks use real backend APIs only.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceService } from '../services/invoice.service';

// Query key factory
export const invoiceKeys = {
  all: ['invoices'],
  lists: () => [...invoiceKeys.all, 'list'],
  list: (filters) => [...invoiceKeys.lists(), filters],
  details: () => [...invoiceKeys.all, 'detail'],
  detail: (id) => [...invoiceKeys.details(), id],
};

/**
 * Fetch paginated + filtered invoice list.
 * GET /api/invoices?status&search&page&limit
 */
export const useInvoiceList = (filters = {}) => {
  return useQuery({
    queryKey: invoiceKeys.list(filters),
    queryFn: () => invoiceService.getInvoices(filters),
    select: (data) => data?.data,
    keepPreviousData: true,
    staleTime: 30_000,
  });
};

/**
 * Derive dashboard stats from the full invoice list (no status filter).
 * Counts by status: PROCESSED, FAILED, PROCESSING, UPLOADED, and today's.
 */
export const useInvoiceStats = () => {
  return useQuery({
    queryKey: invoiceKeys.list({ limit: 1000 }),
    queryFn: () => invoiceService.getInvoices({ limit: 1000 }),
    select: (data) => {
      const invoices = data?.data?.invoices || [];
      const today = new Date().toDateString();
      return {
        total: invoices.length,
        processed: invoices.filter((i) => i.status === 'PROCESSED').length,
        failed: invoices.filter((i) => i.status === 'FAILED').length,
        processing: invoices.filter((i) => i.status === 'PROCESSING').length,
        pending: invoices.filter((i) => i.status === 'UPLOADED' || i.status === 'PROCESSING').length,
        todayUploads: invoices.filter(
          (i) => new Date(i.createdAt).toDateString() === today
        ).length,
      };
    },
    staleTime: 30_000,
  });
};

/**
 * Fetch single invoice detail — includes items[] and expense.
 * GET /api/invoices/:id
 */
export const useInvoiceDetail = (id) => {
  return useQuery({
    queryKey: invoiceKeys.detail(id),
    queryFn: () => invoiceService.getInvoiceById(id),
    select: (data) => data?.data,
    enabled: !!id,
    staleTime: 15_000,
  });
};

/**
 * Upload invoice file mutation.
 * POST /api/invoices/upload — multipart/form-data, field: "file"
 * On 409 Conflict the error.status === 409 (duplicate).
 */
export const useUploadInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, onUploadProgress }) =>
      invoiceService.uploadInvoice(file, onUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
    },
  });
};

/**
 * Process invoice mutation — triggers OCR + AI on existing invoice.
 * POST /api/invoices/:id/process
 */
export const useProcessInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => invoiceService.processInvoice(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
    },
  });
};

/**
 * Reprocess invoice mutation — re-runs OCR + AI.
 * POST /api/invoices/:id/reprocess
 */
export const useReprocessInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => invoiceService.reprocessInvoice(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
    },
  });
};

/**
 * Delete invoice mutation.
 * DELETE /api/invoices/:id
 */
export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => invoiceService.deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
    },
  });
};
