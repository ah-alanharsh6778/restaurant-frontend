/**
 * RestaurantOS — Notification Service
 *
 * All calls use real backend endpoints (`/api/notifications`).
 */

import axiosInstance from '../config/axios';

export const notificationService = {
  /**
   * Get notifications for the logged in user
   * GET /api/notifications/my-notifications
   */
  getMyNotifications: async () => {
    const response = await axiosInstance.get('/notifications/my-notifications');
    return response.data;
  },

  /**
   * Mark a notification as read
   * PUT /api/notifications/:id/read
   */
  markAsRead: async (id) => {
    const response = await axiosInstance.put(`/notifications/${id}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read for current user
   * PUT /api/notifications/read-all
   */
  markAllAsRead: async () => {
    const response = await axiosInstance.put('/notifications/read-all');
    return response.data;
  },

  /**
   * Create a new notification (Admin/Manager)
   * POST /api/notifications
   */
  createNotification: async (data) => {
    const response = await axiosInstance.post('/notifications', data);
    return response.data;
  },
};

export default notificationService;
