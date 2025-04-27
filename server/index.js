const express = require('express');
const cors = require('cors');
const { Permit } = require('permitio');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Permit
const permit = new Permit({
  token: process.env.PERMIT_API_KEY,
  pdp: process.env.PERMIT_PDP_URL || 'https://cloudpdp.api.permit.io'
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes for authorization
app.post('/api/auth/sync-user', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    const user = await permit.api.users.sync({
      key: walletAddress,
      email: `${walletAddress.substring(0, 10)}@eventchain.example`,
      first_name: 'Web3',
      last_name: 'User',
      attributes: {
        wallet_address: walletAddress
      }
    });
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/assign-role', async (req, res) => {
  try {
    const { walletAddress, role } = req.body;
    
    const result = await permit.api.roleAssignments.assign({
      user: walletAddress,
      role: role,
      tenant: 'default'
    });
    
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error assigning role:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/check-permission', async (req, res) => {
  try {
    const { walletAddress, action, resource } = req.body;
    
    const allowed = await permit.check(walletAddress, action, resource);
    
    res.json({ allowed });
  } catch (error) {
    console.error('Error checking permission:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/check-context-permission', async (req, res) => {
  try {
    const { walletAddress, action, resourceType, resourceKey, context } = req.body;
    
    const allowed = await permit.check(
      walletAddress, 
      action, 
      {
        type: resourceType,
        key: resourceKey,
        attributes: context
      }
    );
    
    res.json({ allowed });
  } catch (error) {
    console.error('Error checking contextual permission:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/update-user-attributes', async (req, res) => {
  try {
    const { walletAddress, attributes } = req.body;
    
    const user = await permit.api.users.update(walletAddress, {
      attributes: attributes
    });
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user attributes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/create-resource', async (req, res) => {
  try {
    const { resource, key, attributes } = req.body;
    
    const resourceInstance = await permit.api.resourceInstances.create({
      resource: resource,
      key: key,
      tenant: 'default',
      attributes: attributes
    });
    
    res.json({ success: true, resourceInstance });
  } catch (error) {
    console.error('Error creating resource instance:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});