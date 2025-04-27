import React, { useState, useEffect } from 'react';
import { checkPermission } from './permissionMiddleware';

function withPermission(WrappedComponent, requiredAction, resource) {
  return function WithPermissionComponent(props) {
    const [hasPermission, setHasPermission] = useState(false);
    const [loading, setLoading] = useState(true);
    const { walletAddress } = props;

    useEffect(() => {
      async function checkUserPermission() {
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

      checkUserPermission();
    }, [walletAddress]);
    if (loading) {
      return <div>Checking permissions...</div>;
    }

    if (!hasPermission) {
      return (
        <div className="permission-denied">
          <h3>Access Denied</h3>
          <p>You don't have permission to {requiredAction} this {resource}.</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}

export default withPermission;
