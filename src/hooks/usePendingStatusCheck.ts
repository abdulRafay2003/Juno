import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { checkUserStatusAndHandleLogout } from '@/utils/business.helper';

/**
 * Hook to check user status on every pending screen focus
 * This ensures the status is checked whenever user navigates to any pending screen
 */
export const usePendingStatusCheck = () => {
  useFocusEffect(
    useCallback(() => {
      // Check user status every time the screen comes into focus
      checkUserStatusAndHandleLogout();
    }, [])
  );
};
