import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

import PageContainer from '../../layout/PageContainer';
import CommonDataGrid from '../../components/common/CommonDataGrid';
import ResponsiveDialog from '../../components/common/ResponsiveDialog';
import userService from '../../services/user.service';
import roleService from '../../services/role.service';
import staffService from '../../services/staff.service';
import { Loader } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';

export const UserManagementPage = () => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN');

  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // User Register Modal State
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [userForm, setUserForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    roleId: '',
  });

  // Staff Profile Modal State (Create & Edit)
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffForm, setStaffForm] = useState({
    userId: '',
    employeeCode: '',
    department: 'KITCHEN',
    designation: 'Staff Member',
    shift: 'MORNING',
    hireDate: dayjs().format('YYYY-MM-DD'),
    salary: '',
    emergencyContact: '',
  });

  // Staff Delete State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  // Fetch Users, Roles, and Staff Profiles
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersRes, rolesRes, staffRes] = await Promise.all([
        userService.getUsers(),
        roleService.getRoles(),
        staffService.getAllStaff().catch(() => ({ data: [] })),
      ]);

      const uData = Array.isArray(usersRes) ? usersRes : usersRes?.data || [];
      const rData = Array.isArray(rolesRes) ? rolesRes : rolesRes?.data || [];
      const sData = Array.isArray(staffRes) ? staffRes : staffRes?.data || staffRes?.staff || [];

      setUsers(uData);
      setRoles(rData);
      setStaffList(sData);
    } catch (error) {
      console.error('Error loading user management data:', error);
      toast.error('Failed to load user and staff telemetry from backend');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Open User Registration Modal
  const handleOpenAddUser = () => {
    setUserForm({
      fullName: '',
      email: '',
      password: '',
      phone: '',
      roleId: roles.length > 0 ? roles[0].id : '',
    });
    setUserDialogOpen(true);
  };

  // Submit User Registration (POST /api/auth/register)
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!userForm.fullName.trim() || !userForm.email.trim() || !userForm.password.trim() || !userForm.roleId) {
      toast.error('Please fill in all required fields (Full Name, Email, Password, and Role).');
      return;
    }

    try {
      setSubmitting(true);
      const res = await userService.createUser({
        fullName: userForm.fullName.trim(),
        email: userForm.email.trim(),
        password: userForm.password,
        phone: userForm.phone.trim() || null,
        roleId: userForm.roleId,
      });

      toast.success(res?.message || `User "${userForm.fullName}" registered successfully!`);
      setUserDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error.response?.data?.message || 'Failed to register new user account.');
    } finally {
      setSubmitting(false);
    }
  };

  // Open Staff Modal (Create or Edit)
  const handleOpenAddStaff = () => {
    setSelectedStaff(null);
    setStaffForm({
      userId: users.length > 0 ? users[0].id : '',
      employeeCode: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      department: 'KITCHEN',
      designation: 'Line Cook / Staff',
      shift: 'MORNING',
      hireDate: dayjs().format('YYYY-MM-DD'),
      salary: '25000',
      emergencyContact: '',
    });
    setStaffDialogOpen(true);
  };

  const handleOpenEditStaff = (staff) => {
    setSelectedStaff(staff);
    setStaffForm({
      userId: staff.userId || '',
      employeeCode: staff.employeeCode || '',
      department: staff.department || 'KITCHEN',
      designation: staff.designation || 'Staff Member',
      shift: staff.shift || 'MORNING',
      hireDate: staff.hireDate ? dayjs(staff.hireDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      salary: staff.salary ? String(staff.salary) : '',
      emergencyContact: staff.emergencyContact || '',
    });
    setStaffDialogOpen(true);
  };

  // Submit Staff (Create POST /api/staff or Update PUT /api/staff/:id)
  const handleSaveStaff = async (e) => {
    e.preventDefault();
    if (!staffForm.employeeCode.trim() || !staffForm.department.trim() || !staffForm.designation.trim()) {
      toast.error('Please fill in required staff fields (Employee Code, Department, Designation).');
      return;
    }

    try {
      setSubmitting(true);
      if (selectedStaff?.id) {
        await staffService.updateStaff(selectedStaff.id, {
          employeeCode: staffForm.employeeCode.trim(),
          department: staffForm.department.trim(),
          designation: staffForm.designation.trim(),
          shift: staffForm.shift,
          hireDate: staffForm.hireDate,
          salary: staffForm.salary ? parseFloat(staffForm.salary) : undefined,
          emergencyContact: staffForm.emergencyContact.trim() || undefined,
        });
        toast.success(`Staff profile "${staffForm.employeeCode}" updated!`);
      } else {
        if (!staffForm.userId) {
          toast.error('Please select an associated user account.');
          return;
        }
        await staffService.createStaff({
          userId: staffForm.userId,
          employeeCode: staffForm.employeeCode.trim(),
          department: staffForm.department.trim(),
          designation: staffForm.designation.trim(),
          shift: staffForm.shift,
          hireDate: staffForm.hireDate,
          salary: staffForm.salary ? parseFloat(staffForm.salary) : undefined,
          emergencyContact: staffForm.emergencyContact.trim() || undefined,
        });
        toast.success(`Staff profile "${staffForm.employeeCode}" created!`);
      }
      setStaffDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving staff profile:', error);
      toast.error(error.response?.data?.message || 'Failed to save staff profile.');
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm Staff Deletion (DELETE /api/staff/:id)
  const handleOpenDeleteStaff = (staff) => {
    setStaffToDelete(staff);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDeleteStaff = async () => {
    if (!staffToDelete?.id) return;
    try {
      setSubmitting(true);
      await staffService.deleteStaff(staffToDelete.id);
      toast.success(`Staff profile ${staffToDelete.employeeCode} deleted!`);
      setDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error deleting staff profile:', error);
      toast.error(error.response?.data?.message || 'Failed to delete staff profile.');
    } finally {
      setSubmitting(false);
    }
  };

  // User Accounts DataGrid Columns
  const userColumns = [
    {
      field: 'fullName',
      headerName: 'User Profile & Identity',
      flex: 1.8,
      minWidth: 280,
      renderCell: (params) => {
        const nameStr = String(params.value || params.row.name || params.row.email || 'User Account');
        const initials = nameStr
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', minWidth: 0 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.8rem', fontWeight: 800, flexShrink: 0 }}>
              {initials}
            </Avatar>
            <Box sx={{ minWidth: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.25, fontSize: '0.875rem' }} noWrap>
                {nameStr}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.2, fontSize: '0.75rem', mt: 0.25 }} noWrap>
                {String(params.row.email || 'N/A')}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: 'role',
      headerName: 'Security Role',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => {
        const roleObj = params.value;
        let roleName = 'STAFF';
        if (roleObj && typeof roleObj === 'object') {
          roleName = roleObj.name || 'STAFF';
        } else if (roleObj) {
          roleName = String(roleObj);
        }

        return (
          <Chip
            label={roleName}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 800, fontSize: '0.725rem' }}
          />
        );
      },
    },
    {
      field: 'phone',
      headerName: 'Contact Phone',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value ? String(params.value) : '—'}
        </Typography>
      ),
    },
    {
      field: 'isActive',
      headerName: 'Account Status',
      width: 140,
      renderCell: (params) => {
        const active = params.value !== false;
        return (
          <Chip
            icon={<CheckCircleIcon style={{ fontSize: 14 }} />}
            label={active ? 'ACTIVE' : 'INACTIVE'}
            color={active ? 'success' : 'default'}
            size="small"
            sx={{ fontWeight: 800, fontSize: '0.675rem' }}
          />
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Member Since',
      width: 140,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value ? dayjs(params.value).format('MMM DD, YYYY') : '—'}
        </Typography>
      ),
    },
  ];

  // Staff Profiles DataGrid Columns
  const staffColumns = [
    {
      field: 'employeeCode',
      headerName: 'Employee Code',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 800, color: 'primary.main' }}>
          {params.value || '—'}
        </Typography>
      ),
    },
    {
      field: 'fullName',
      headerName: 'Staff Member',
      flex: 1.3,
      minWidth: 180,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
          {params.value || 'Unlinked User'}
        </Typography>
      ),
    },
    {
      field: 'department',
      headerName: 'Department',
      width: 140,
      renderCell: (params) => (
        <Chip label={params.value || 'GENERAL'} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
      ),
    },
    {
      field: 'designation',
      headerName: 'Designation / Role',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value || 'Staff Member'}
        </Typography>
      ),
    },
    {
      field: 'shift',
      headerName: 'Assigned Shift',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value || 'MORNING'}
          color={params.value === 'NIGHT' ? 'secondary' : 'default'}
          size="small"
          sx={{ fontWeight: 800, fontSize: '0.675rem' }}
        />
      ),
    },
    {
      field: 'hireDate',
      headerName: 'Hire Date',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value ? dayjs(params.value).format('MMM DD, YYYY') : '—'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Edit Staff Profile">
            <IconButton size="small" onClick={() => handleOpenEditStaff(params.row)} color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {isAdmin && (
            <Tooltip title="Delete Staff Profile">
              <IconButton size="small" onClick={() => handleOpenDeleteStaff(params.row)} color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <PageContainer
      title="User & Staff Management"
      subtitle="Manage system accounts, authentication security, and staff employment profiles"
      breadcrumbs={[{ label: 'User Management' }]}
      actions={
        <Box sx={{ display: 'flex', gap: 1.5, ml: 'auto', alignItems: 'center' }}>
          <Button size="small" variant="outlined" startIcon={<RefreshIcon />} onClick={fetchData}>
            Refresh
          </Button>
          {activeTab === 0 ? (
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleOpenAddUser}
              sx={{ fontWeight: 700 }}
            >
              Register User
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={handleOpenAddStaff}
              sx={{ fontWeight: 700 }}
            >
              Add Staff Profile
            </Button>
          )}
        </Box>
      }
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Loader size="large" />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, width: '100%' }}>
          {/* Navigation Tabs */}
          <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', px: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(_, val) => setActiveTab(val)}
              indicatorColor="primary"
              textColor="primary"
              sx={{ minHeight: 48 }}
            >
              <Tab icon={<PersonIcon fontSize="small" />} iconPosition="start" label={`User Accounts (${users.length})`} sx={{ fontWeight: 700 }} />
              <Tab icon={<BadgeIcon fontSize="small" />} iconPosition="start" label={`Staff Employment Profiles (${staffList.length})`} sx={{ fontWeight: 700 }} />
            </Tabs>
          </Paper>

          {/* Tab Panel 0: User Accounts */}
          {activeTab === 0 && (
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', width: '100%', overflow: 'hidden' }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={800}>
                  Registered System User Accounts ({users.length})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  System access accounts loaded directly from GET /api/users
                </Typography>
              </Box>
              <CommonDataGrid rows={users} columns={userColumns} loading={loading} height={540} />
            </Paper>
          )}

          {/* Tab Panel 1: Staff Profiles */}
          {activeTab === 1 && (
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', width: '100%', overflow: 'hidden' }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={800}>
                  Staff Employment Profiles ({staffList.length})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Employee profiles, designations, and shifts loaded directly from GET /api/staff
                </Typography>
              </Box>
              <CommonDataGrid rows={staffList} columns={staffColumns} loading={loading} height={540} />
            </Paper>
          )}
        </Box>
      )}

      {/* User Registration Dialog */}
      <ResponsiveDialog
        open={userDialogOpen}
        onClose={() => setUserDialogOpen(false)}
        maxWidth="sm"
        title="Register New System User"
        subtitle="Specify user account identity, credentials, and assigned role"
        icon={PersonIcon}
        iconColor="primary.main"
      >
        <Box component="form" onSubmit={handleCreateUser} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            Registering a user creates an active authentication profile with an assigned backend role.
          </Alert>

          <TextField
            fullWidth
            required
            size="small"
            label="Full Name"
            placeholder="e.g. Sarah Connor"
            value={userForm.fullName}
            onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
          />

          <TextField
            fullWidth
            required
            type="email"
            size="small"
            label="Email Address"
            placeholder="e.g. sarah@restaurant.com"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
          />

          <TextField
            fullWidth
            required
            type="password"
            size="small"
            label="Password"
            placeholder="At least 6 characters"
            value={userForm.password}
            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
          />

          <TextField
            fullWidth
            size="small"
            label="Phone Number (Optional)"
            placeholder="e.g. +1 555-0199"
            value={userForm.phone}
            onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
          />

          <FormControl fullWidth size="small" required>
            <InputLabel id="role-select-label">Assign Security Role</InputLabel>
            <Select
              labelId="role-select-label"
              value={userForm.roleId}
              label="Assign Security Role"
              onChange={(e) => setUserForm({ ...userForm, roleId: e.target.value })}
            >
              {roles.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.name} {r.description ? `— ${r.description}` : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
            <Button onClick={() => setUserDialogOpen(false)} color="inherit" disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={submitting} sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}>
              {submitting ? 'Registering...' : 'Register User'}
            </Button>
          </Box>
        </Box>
      </ResponsiveDialog>

      {/* Staff Profile Dialog (Create / Edit) */}
      <ResponsiveDialog
        open={staffDialogOpen}
        onClose={() => setStaffDialogOpen(false)}
        maxWidth="sm"
        title={selectedStaff ? 'Edit Staff Profile' : 'Create Staff Profile'}
        subtitle="Manage employment code, department, shift, and compensation"
        icon={BadgeIcon}
        iconColor="secondary.main"
      >
        <Box component="form" onSubmit={handleSaveStaff} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {!selectedStaff && (
            <FormControl fullWidth size="small" required>
              <InputLabel>Associated User Account</InputLabel>
              <Select
                value={staffForm.userId}
                label="Associated User Account"
                onChange={(e) => setStaffForm({ ...staffForm, userId: e.target.value })}
              >
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.fullName || u.email} ({u.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <TextField
            fullWidth
            required
            size="small"
            label="Employee Code"
            placeholder="e.g. EMP-9918"
            value={staffForm.employeeCode}
            onChange={(e) => setStaffForm({ ...staffForm, employeeCode: e.target.value })}
          />

          <FormControl fullWidth size="small" required>
            <InputLabel>Department</InputLabel>
            <Select
              value={staffForm.department}
              label="Department"
              onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })}
            >
              <MenuItem value="KITCHEN">Kitchen & Food Prep</MenuItem>
              <MenuItem value="SERVICE">Dining Service & POS</MenuItem>
              <MenuItem value="MANAGEMENT">Management & Ops</MenuItem>
              <MenuItem value="INVENTORY">Inventory & Logistics</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            required
            size="small"
            label="Designation / Job Title"
            placeholder="e.g. Executive Chef, Waiter, Manager"
            value={staffForm.designation}
            onChange={(e) => setStaffForm({ ...staffForm, designation: e.target.value })}
          />

          <FormControl fullWidth size="small">
            <InputLabel>Shift</InputLabel>
            <Select
              value={staffForm.shift}
              label="Shift"
              onChange={(e) => setStaffForm({ ...staffForm, shift: e.target.value })}
            >
              <MenuItem value="MORNING">Morning Shift</MenuItem>
              <MenuItem value="EVENING">Evening Shift</MenuItem>
              <MenuItem value="NIGHT">Night Shift</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            type="date"
            size="small"
            label="Hire Date"
            InputLabelProps={{ shrink: true }}
            value={staffForm.hireDate}
            onChange={(e) => setStaffForm({ ...staffForm, hireDate: e.target.value })}
          />

          <TextField
            fullWidth
            type="number"
            size="small"
            label="Salary ($ / Mo)"
            placeholder="e.g. 3500"
            value={staffForm.salary}
            onChange={(e) => setStaffForm({ ...staffForm, salary: e.target.value })}
          />

          <TextField
            fullWidth
            size="small"
            label="Emergency Contact"
            placeholder="e.g. John (Spouse) +1 555-0922"
            value={staffForm.emergencyContact}
            onChange={(e) => setStaffForm({ ...staffForm, emergencyContact: e.target.value })}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
            <Button onClick={() => setStaffDialogOpen(false)} color="inherit" disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="secondary" disabled={submitting} sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}>
              {submitting ? 'Saving...' : selectedStaff ? 'Update Profile' : 'Create Profile'}
            </Button>
          </Box>
        </Box>
      </ResponsiveDialog>

      {/* Staff Delete Dialog */}
      <ResponsiveDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        title="Delete Staff Profile"
        subtitle="Confirm deletion of staff employment profile"
      >
        <Typography variant="body2" sx={{ py: 1 }}>
          Are you sure you want to delete staff profile <strong>{staffToDelete?.employeeCode}</strong> ({staffToDelete?.fullName})? This action cannot be undone.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit" disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteStaff} variant="contained" color="error" disabled={submitting} sx={{ fontWeight: 700 }}>
            {submitting ? 'Deleting...' : 'Delete Profile'}
          </Button>
        </Box>
      </ResponsiveDialog>
    </PageContainer>
  );
};

export default UserManagementPage;
