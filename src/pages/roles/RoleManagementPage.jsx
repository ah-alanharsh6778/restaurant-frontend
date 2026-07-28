import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Checkbox,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  IconButton,
  Alert,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

import PageContainer from '../../layout/PageContainer';
import ResponsiveDialog from '../../components/common/ResponsiveDialog';
import roleService from '../../services/role.service';
import { Loader } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';

export const RoleManagementPage = () => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN');

  const [roles, setRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [assignedPermIds, setAssignedPermIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [permsLoading, setPermsLoading] = useState(false);

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleForm, setRoleForm] = useState({ name: '', description: '' });

  // Fetch all roles from GET /api/roles
  const fetchRolesData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await roleService.getRoles();
      const rData = Array.isArray(res) ? res : res?.data || [];
      setRoles(rData);
      if (rData.length > 0 && !selectedRole) {
        setSelectedRole(rData[0]);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to load roles from backend');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all system permissions from GET /api/permissions
  const fetchAllPermissions = useCallback(async () => {
    try {
      const res = await roleService.getPermissions();
      const pData = Array.isArray(res) ? res : res?.data || [];
      setAllPermissions(pData);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  }, []);

  // Fetch assigned permissions for selected role from GET /api/permissions/role/:roleId
  const fetchRolePermissions = useCallback(async (roleId) => {
    if (!roleId) return;
    try {
      setPermsLoading(true);
      const res = await roleService.getRolePermissions(roleId);
      const pList = Array.isArray(res) ? res : res?.data || [];
      const permSet = new Set(pList.map((p) => p.id));
      setAssignedPermIds(permSet);
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      toast.error('Failed to fetch permissions for selected role');
    } finally {
      setPermsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRolesData();
    fetchAllPermissions();
  }, [fetchRolesData, fetchAllPermissions]);

  useEffect(() => {
    if (selectedRole?.id) {
      fetchRolePermissions(selectedRole.id);
    }
  }, [selectedRole, fetchRolePermissions]);

  // Handle toggling permission assignment via POST /api/permissions/assign-role
  const handleTogglePermission = async (permId) => {
    if (!selectedRole || !isAdmin) {
      toast.info('Only Administrators can assign role permissions');
      return;
    }

    try {
      await roleService.assignPermissionToRole(selectedRole.id, permId);
      toast.success(`Permission updated for role "${selectedRole.name}"`);
      fetchRolePermissions(selectedRole.id);
    } catch (error) {
      console.error('Error assigning permission:', error);
      toast.error(error?.response?.data?.message || 'Failed to update permission');
    }
  };

  const handleOpenAddRole = () => {
    setEditingRole(null);
    setRoleForm({ name: '', description: '' });
    setRoleDialogOpen(true);
  };

  const handleOpenEditRole = (role) => {
    setEditingRole(role);
    setRoleForm({ name: role.name, description: role.description || '' });
    setRoleDialogOpen(true);
  };

  const handleSaveRoleForm = async (e) => {
    e.preventDefault();
    if (!roleForm.name.trim()) return;

    try {
      if (editingRole) {
        await roleService.updateRole(editingRole.id, roleForm);
        toast.success(`Role "${roleForm.name}" updated successfully!`);
      } else {
        await roleService.createRole(roleForm);
        toast.success(`Role "${roleForm.name}" created successfully!`);
      }
      setRoleDialogOpen(false);
      fetchRolesData();
    } catch (error) {
      console.error('Error saving role:', error);
      toast.error(error?.response?.data?.message || 'Failed to save role');
    }
  };

  const handleDeleteRole = async (role) => {
    if (!window.confirm(`Are you sure you want to delete role "${role.name}"?`)) return;
    try {
      await roleService.deleteRole(role.id);
      toast.success(`Role "${role.name}" deleted successfully!`);
      if (selectedRole?.id === role.id) {
        setSelectedRole(null);
      }
      fetchRolesData();
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete role');
    }
  };

  return (
    <PageContainer
      title="Role-Based Access Control (RBAC)"
      subtitle="Manage enterprise security roles, system permissions, and role assignment policies"
      breadcrumbs={[{ label: 'Roles & RBAC' }]}
      actions={
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={() => {
              fetchRolesData();
              fetchAllPermissions();
            }}
          >
            Refresh
          </Button>
          {isAdmin && (
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleOpenAddRole}
              sx={{ fontWeight: 700 }}
            >
              Create New Role
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
        <Grid container spacing={3}>
          {/* Left Column: Roles List */}
          <Grid item xs={12} lg={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={800}>
                  System Roles ({roles.length})
                </Typography>
                <Chip label="Prisma RoleName Enum" size="small" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.65rem' }} />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: 680, overflowY: 'auto' }}>
                {roles.map((role) => {
                  const isSelected = selectedRole?.id === role.id;
                  return (
                    <Paper
                      key={role.id}
                      onClick={() => setSelectedRole(role)}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        border: '1.5px solid',
                        borderColor: isSelected ? 'primary.main' : 'divider',
                        bgcolor: isSelected ? 'action.selected' : 'background.paper',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': { borderColor: 'primary.main' },
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" fontWeight={800} color={isSelected ? 'primary.main' : 'text.primary'}>
                            {role.name}
                          </Typography>
                          {role.name === 'ADMIN' && (
                            <Chip label="FULL ACCESS" color="primary" size="small" sx={{ fontWeight: 800, height: 18, fontSize: '0.6rem' }} />
                          )}
                        </Box>

                        {isAdmin && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Tooltip title="Edit Role">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEditRole(role);
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {role.name !== 'ADMIN' && role.name !== 'MANAGER' && (
                              <Tooltip title="Delete Role">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteRole(role);
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        )}
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.4 }}>
                        {role.description || 'Enterprise security role.'}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Created: {dayjs(role.createdAt).format('MMM DD, YYYY')}
                        </Typography>
                        <Chip
                          icon={<CheckCircleIcon style={{ fontSize: 14 }} />}
                          label="ACTIVE"
                          color="success"
                          variant="outlined"
                          size="small"
                          sx={{ fontWeight: 700, height: 20, fontSize: '0.65rem' }}
                        />
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            </Paper>
          </Grid>

          {/* Right Column: Permission Matrix */}
          <Grid item xs={12} lg={8}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight={800}>
                    Role Permissions: {selectedRole?.name || 'Select a Role'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Backend RBAC permission mappings from GET /api/permissions/role/{selectedRole?.id || ':id'}
                  </Typography>
                </Box>

                {selectedRole?.name === 'ADMIN' && (
                  <Alert severity="info" sx={{ py: 0, px: 2, borderRadius: 2 }}>
                    ADMIN role automatically bypasses all permission checks in backend middleware.
                  </Alert>
                )}
              </Box>

              {permsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                  <Loader />
                </Box>
              ) : allPermissions.length === 0 ? (
                <Alert severity="warning" sx={{ borderRadius: 3 }}>
                  No system permissions configured in database.
                </Alert>
              ) : (
                <TableContainer
                  component={Box}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2.5,
                    overflow: 'hidden',
                  }}
                >
                  <Table sx={{ minWidth: 500 }}>
                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 800 }}>Permission Name</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Action Scope</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Resource Entity</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 800 }}>
                          Assigned to Role
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allPermissions.map((perm) => {
                        const isAssigned = assignedPermIds.has(perm.id) || selectedRole?.name === 'ADMIN';
                        return (
                          <TableRow key={perm.id} hover>
                            <TableCell>
                              <Typography variant="subtitle2" fontWeight={700}>
                                {perm.name}
                              </Typography>
                              {perm.description && (
                                <Typography variant="caption" color="text.secondary" display="block">
                                  {perm.description}
                                </Typography>
                              )}
                            </TableCell>

                            <TableCell>
                              <Chip
                                label={perm.action}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ fontWeight: 700, height: 20, fontSize: '0.65rem' }}
                              />
                            </TableCell>

                            <TableCell>
                              <Chip
                                label={perm.resource}
                                size="small"
                                color="secondary"
                                variant="outlined"
                                sx={{ fontWeight: 700, height: 20, fontSize: '0.65rem' }}
                              />
                            </TableCell>

                            <TableCell align="center">
                              <Checkbox
                                checked={isAssigned}
                                disabled={!isAdmin || selectedRole?.name === 'ADMIN'}
                                onChange={() => handleTogglePermission(perm.id)}
                                size="small"
                                color="primary"
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Role Add/Edit Dialog */}
      <ResponsiveDialog
        open={roleDialogOpen}
        onClose={() => setRoleDialogOpen(false)}
        maxWidth="xs"
        title={editingRole ? 'Edit Security Role' : 'Create Security Role'}
        subtitle="Specify role name and description"
        icon={SecurityIcon}
        iconColor="primary.main"
        actions={
          <>
            <Button onClick={() => setRoleDialogOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleSaveRoleForm} variant="contained" sx={{ borderRadius: 2, px: 3 }}>
              Save Role
            </Button>
          </>
        }
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
          <TextField
            fullWidth
            size="small"
            label="Role Name (e.g., MANAGER, CHEF)"
            value={roleForm.name}
            onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
            helperText="Uses Prisma RoleName enum or custom name"
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            label="Role Description"
            value={roleForm.description}
            onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
          />
        </Box>
      </ResponsiveDialog>
    </PageContainer>
  );
};

export default RoleManagementPage;
