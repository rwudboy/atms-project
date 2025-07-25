export const validateRoleName = (name) => {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'Role name is required' };
  }
  if (name.length > 50) {
    return { isValid: false, error: 'Role name cannot exceed 50 characters' };
  }
  if (!/^[a-zA-Z0-9 ]+$/.test(name)) {
    return { isValid: false, error: 'Role name can only contain letters, numbers and spaces' };
  }
  return { isValid: true };
};

export const validateRoleUpdate = (roleData) => {
  return validateRoleName(roleData.RoleName);
};

export const validateRoleDelete = (role) => {
  if (!role || !role.uuid) {
    return { isValid: false, error: 'Invalid role data' };
  }
  if (role.member > 0) {
    return { isValid: false, error: 'Cannot delete role with active members' };
  }
  return { isValid: true };
};