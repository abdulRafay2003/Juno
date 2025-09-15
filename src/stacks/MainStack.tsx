import React, {useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import NavigationService from '@/config/navigationService';
import {RootState} from '@/redux/store';
import {useSelector} from 'react-redux';
import {AuthStack} from '@/stacks/AuthStack';
import {HomeStack} from '@/stacks/HomeStack';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {RouteNames} from '@/config/routes';
import {Colors} from '@/config';
import {DefaultTheme} from '@react-navigation/native';
import {getAccountStatus} from '@/utils/business.helper';
import {PendingStack} from '@/stacks/PendingStack/PendingStack';
import {Linking} from 'react-native';

const CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.BaseBackground, // your custom background color
  },
};

const linking = {
  prefixes: ['beyondbroker://', 'https://beyond-beta.demoz.agency'],
  config: {
    initialRouteName: RouteNames.AuthRoutes.Login,
    screens: {
      // Handle both forgot password and agent registration set password routes
      [RouteNames.AuthRoutes.SetPassword]: {
        path: 'forgot-password/reset-password',
        alias: ['register/set-password'],
        parse: {
          token: (token: string) => token,
          email: (email?: string) => email,
          is_agent: (is_agent?: string) => is_agent === 'true',
        },
      },
    },
  },

  subscribe(listener: (url: string) => void) {
    const onReceiveURL = ({url}: {url: string}) => {
      listener(url);
    };
    const subscription = Linking.addEventListener('url', onReceiveURL);
    return () => subscription.remove();
  },
};

export const MainStack = () => {
  const MainStack = createStackNavigator();
  const authorize = useSelector((state: RootState) => state?.auth.authorized);

  const AuthScreens = AuthStack.map(stack => (
    <MainStack.Screen
      key={stack.key}
      name={stack.name}
      component={stack.component}
    />
  ));
  const HomeScreens = HomeStack.map(stack => (
    <MainStack.Screen
      key={stack.key}
      name={stack.name}
      component={stack.component}
      options={stack.options}
    />
  ));
  const PendingScreens = PendingStack.map(stack => (
    <MainStack.Screen
      key={stack.key}
      name={stack.name}
      component={stack.component}
      options={stack.options}
    />
  ));
  return (
    <NavigationContainer
      linking={linking}
      theme={CustomTheme}
      ref={navigatorRef => {
        if (navigatorRef) {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }
      }}>
      <MainStack.Navigator
        id={undefined}
        initialRouteName={
          authorize && getAccountStatus()
            ? RouteNames.PendingRoutes.PendingTabStack
            : authorize
              ? RouteNames.HomeRoutes.TabStack
              : RouteNames.AuthRoutes.Login
        }
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.DefaultTransition,
        }}>
        {authorize && getAccountStatus()
          ? PendingScreens
          : authorize
            ? HomeScreens
            : AuthScreens}
      </MainStack.Navigator>
    </NavigationContainer>
  );
};
