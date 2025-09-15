import 'react-native-url-polyfill/auto';
import React, {useEffect, useRef, useState} from 'react';
import {View, Dimensions, LogBox, StyleSheet, Platform} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {dispatchToStore, persistor, RootState, store} from './src/redux/store';
import Video from 'react-native-video';
import {getCrashlytics} from '@react-native-firebase/crashlytics';
import {Metrix} from './src/config';
import {MainStack} from '@/stacks/MainStack';
import {ToastProvider} from '@/components/ToastProvider/ToastProvider';
import Orientation from 'react-native-orientation-locker';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import httpService from '@/services/http.service';
import Endpoints from '@/services/EndPoints';
import {
  setFcmToken,
  setTokens,
  setUserDetail,
} from '@/redux/slice/UserSlice/userSlice';
import notifee, {AndroidImportance} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {registerNotificationListeners} from '@/utils/notificationHelper';
import {
  loginSucces,
  setAuthPayload,
  setCategoryType,
} from '@/redux/slice/AuthSlice/authSlice';

let screenWidth = Math.round(Dimensions.get('window').width);
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs(true);

const Main = props => {
  const queryClient = new QueryClient();
  const refVideo = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const initCrashlytics = async () => {
    const crashlytics = getCrashlytics();
    await crashlytics.setCrashlyticsCollectionEnabled(true); // ✅ must await
    crashlytics.log('App mounted');
  };
  const authorize = store.getState().auth.authorized;

  const getProfile = () => {
    httpService()
      .get(Endpoints.profile)
      .then(response => {
        dispatchToStore(setUserDetail(response.data.data.details));
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  useEffect(() => {
    if (authorize) {
      getProfile();
    }
  }, [authorize]);

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const authorizationStatus = await messaging().requestPermission();
        if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
          getFCMToken();
        } else if (
          authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
        ) {
        } else {
        }
      } catch (error) {}
    };
    const getFCMToken = async () => {
      try {
        if (!messaging().isDeviceRegisteredForRemoteMessages) {
          await messaging().registerDeviceForRemoteMessages();
        }
        const fcmToken = await messaging().getToken();
        dispatchToStore(setFcmToken(fcmToken));

        dispatchToStore(setFcmToken(fcmToken));
      } catch (error) {}
    };
    initCrashlytics();
    requestPermission();

    // Register notification listeners for navigation
    registerNotificationListeners(onDisplayNotification);

    // Set background message handler for displaying notifications
    messaging().setBackgroundMessageHandler(onDisplayNotification);
  }, []);

  const onDisplayNotification = async message => {
    const notification = message.notification;
    if (Platform.OS === 'android') {
      await notifee.displayNotification({
        title: notification.title || '',
        body: notification.body || '',
        android: {
          sound: 'hollow',
          autoCancel: true,
          vibrationPattern: [300, 500],
          importance: AndroidImportance.HIGH,
          smallIcon: 'ic_launcher',
          pressAction: {
            id: 'default',
          },
        },
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.fullScreenStyle}>
        <Video
          ref={refVideo}
          source={require('@/assets/splashVideo/splash.mp4')}
          resizeMode={'cover'}
          onBuffer={() => {}}
          playInBackground={true}
          onError={() => {}}
          style={styles.fullScreenStyle}
          controls={null}
          onEnd={() => (authorize ? null : setIsLoading(false))}
        />
      </View>
    );
  } else {
    return (
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <ToastProvider>
              <MainStack />
            </ToastProvider>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    );
  }
};

export default Main;

const styles = StyleSheet.create({
  fullScreenStyle: {width: screenWidth, height: '100%'},
  skipIntroCOntainer: {
    width: '100%',
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
    paddingHorizontal: Metrix.HorizontalSize(20),
    bottom: Metrix.VerticalSize(20),
    padding: Metrix.VerticalSize(5),
    borderRadius: Metrix.VerticalSize(5),
  },
});
