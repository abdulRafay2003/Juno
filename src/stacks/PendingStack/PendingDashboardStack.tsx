import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {Overview} from '@/screens';
import PendingDashboard from '@/screens/Pending/PendingDashboard';

const PendingDashboardStack = () => {
  const PendingDashboardStack = createStackNavigator();
  return (
    <PendingDashboardStack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.ModalFadeTransition,
      }}>
      <PendingDashboardStack.Screen
        name="PendingDashboard"
        component={PendingDashboard}
      />
      <PendingDashboardStack.Screen name="Overview" component={Overview} />
    </PendingDashboardStack.Navigator>
  );
};

export default PendingDashboardStack;
