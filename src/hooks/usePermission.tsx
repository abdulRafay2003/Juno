import {useState} from 'react';
import {Platform} from 'react-native';
import {
  check,
  request,
  RESULTS,
  requestMultiple,
  openSettings,
  PermissionStatus,
  Permission,
} from 'react-native-permissions';

interface UsePermissionReturn {
  status: PermissionStatus | null;
  checkPermission: () => Promise<PermissionStatus>;
  requestPermission: () => Promise<PermissionStatus>;
  handlePermission: () => Promise<PermissionStatus>;
}

const usePermission = (permission: Permission) => {
  const [status, setStatus] = useState<PermissionStatus | null>(null);

  // method to check permission status
  const checkPermission = async (): Promise<PermissionStatus> => {
    const result = await check(permission);
    setStatus(result);
    return result;
  };

  // method to request permission
  const requestPermission = async (): Promise<PermissionStatus> => {
    const result = await request(permission);
    setStatus(result);
    return result;
  };

  const requestMultiplePermission = async (
    permissionArray: Permission[],
  ): Promise<Record<Permission, PermissionStatus>> => {
    const result = await requestMultiple(permissionArray);
    // setStatus(result);
    return result;
  };

  //   method to check permission status
  const handlePermission = async (): Promise<PermissionStatus> => {
    const currentStatus = await checkPermission();
    if (currentStatus === RESULTS.DENIED) {
      return requestPermission();
    } else if (currentStatus === RESULTS.BLOCKED) {
      await openSettings();
      return currentStatus;
    }
    return currentStatus;
  };

  return {
    status,
    checkPermission,
    requestPermission,
    handlePermission,
    requestMultiplePermission,
  };
};

export default usePermission;
