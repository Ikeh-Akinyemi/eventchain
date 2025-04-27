import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { checkPermission } from '../middleware/permissionMiddleware';

function ProtectedRoute({ children, walletAddress, requiredAction, resource }) {
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      if (!walletAddress) {
        setHasPermission(false);
        setLoading(false);
        return;
      }

      const permitted = await checkPermission(
        walletAddress,
        requiredAction,
        resource
      );
      
      setHasPermission(permitted);
      setLoading(false);
    }

    checkAccess();
  }, [walletAddress, requiredAction, resource]);

  if (loading) {
    return <div>Checking permissions...</div>;
  }

  return hasPermission ? children : <Navigate to="/" />;
}

export default ProtectedRoute;