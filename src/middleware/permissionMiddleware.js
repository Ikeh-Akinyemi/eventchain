import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export async function syncWalletWithPermit(walletAddress) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/sync-user`, {
      walletAddress
    });
    return response.data;
  } catch (error) {
    console.error('Error syncing wallet with Permit:', error);
    throw error;
  }
}

// Function to assign a role to a wallet address
export async function assignRoleToWallet(walletAddress, role) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/assign-role`, {
      walletAddress,
      role
    });
    return response.data;
  } catch (error) {
    console.error('Error assigning role to wallet:', error);
    throw error;
  }
}

// Function to check permissions
export async function checkPermission(walletAddress, action, resource) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/check-permission`, {
      walletAddress,
      action,
      resource
    });
    return response.data.allowed;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

export async function updateUserAttributes(walletAddress, attributes) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/update-user-attributes`, {
      walletAddress,
      attributes
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user attributes:', error);
    throw error;
  }
}

export async function createResourceInstance(resource, key, attributes) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/create-resource`, {
      resource,
      key,
      attributes
    });
    return response.data;
  } catch (error) {
    console.error('Error creating resource instance:', error);
    throw error;
  }
}

export async function checkPermissionWithContext(walletAddress, action, resourceType, resourceKey, context = {}) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/check-context-permission`, {
      walletAddress,
      action,
      resourceType,
      resourceKey,
      context
    });
    return response.data.allowed;
  } catch (error) {
    console.error('Error checking permission with context:', error);
    return false;
  }
}