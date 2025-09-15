import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {Dashboard, Notification, Overview} from '@/screens';

const DashboardStack = () => {
  const DashboardStack = createStackNavigator();
  return (
    <DashboardStack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.ModalFadeTransition,
      }}>
      <DashboardStack.Screen name="Dashboard" component={Dashboard} />
      <DashboardStack.Screen name="Overview" component={Overview} />
    </DashboardStack.Navigator>
  );
};

export default DashboardStack;
