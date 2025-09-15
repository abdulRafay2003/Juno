import messaging from '@react-native-firebase/messaging';
import {Platform, Alert} from 'react-native';
import NavigationService from '@/config/navigationService';
import {RouteNames} from '@/config/routes';
import {store} from '@/redux/store';

/**
 * Requests user permission for notifications and returns the FCM token.
 */
export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    return await getFcmToken();
  }
  return null;
};

/**
 * Retrieves the FCM token for the device.
 */
export const getFcmToken = async () => {
  try {
    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      await messaging().registerDeviceForRemoteMessages();
    }
    const fcmToken = await messaging().getToken();
    return fcmToken;
  } catch (error) {
    return error;
  }
};

/**
 * Handles notification received in foreground.
 */
export const onForegroundNotification = (
  callback: (remoteMessage: any) => void,
) => {
  return messaging().onMessage(async remoteMessage => {
    callback(remoteMessage);
  });
};

/**
 * Handles notification received in background or when app is opened from quit state.
 */
export const setNotificationHandlers = () => {
  // When the app is opened from a background state
  messaging().onNotificationOpenedApp(remoteMessage => {
    handleNotificationNavigation(remoteMessage);
  });

  // When the app is opened from a quit state
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        // Add a small delay to ensure navigation is ready
        setTimeout(() => {
          handleNotificationNavigation(remoteMessage);
        }, 1000);
      }
    })
    .catch(error => {
      console.log('Error getting initial notification:', error);
    });
};

/**
 * Navigates based on notification data payload.
 */
export const handleNotificationNavigation = (remoteMessage: any) => {
  // Check if there's a specific screen to navigate to
  if (remoteMessage?.data?.screen) {
    NavigationService.navigate(remoteMessage.data.screen, remoteMessage.data);
  } else {
    // Default navigation to notification screen
    // Check if user is authorized before navigating
    const authorize = store.getState().auth.authorized;

    if (authorize) {
      // Navigate to notification screen
      // NavigationService.navigate(RouteNames.HomeRoutes.Notification);
    } else {
      // If not authorized, do nothing
    }
  }
};

/**
 * Registers all notification listeners. Call this in your app entry point (e.g., App.tsx).
 */
export const registerNotificationListeners = (
  onForeground?: (remoteMessage: any) => void,
) => {
  // Foreground notifications
  if (onForeground) {
    onForegroundNotification(onForeground);
  }
  // Background and quit state notifications
  setNotificationHandlers();
};
