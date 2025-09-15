import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Menu from '@/screens/Main/Menu';
import Help from '@/screens/Main/Help';
import {RouteNames} from '@/config/routes';
import {Agents, Commissions, SalesOffer} from '@/screens';
import PendingMenu from '@/screens/Pending/PendingMenu';
import PendingAgents from '@/screens/Pending/PendingAgents';
import PendingCommissions from '@/screens/Pending/PendingCommision';
import PendingSalesOffer from '@/screens/Pending/PendingSalesOffer';

const PendingMenuStack = () => {
  const PendingMenuStack = createStackNavigator();
  return (
    <PendingMenuStack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.ModalFadeTransition,
      }}>
      <PendingMenuStack.Screen name="PendingMenuMain" component={PendingMenu} />
      <PendingMenuStack.Screen name="Help" component={Help} />
      <PendingMenuStack.Screen name="PendingAgents" component={PendingAgents} />
      <PendingMenuStack.Screen
        name="PendingCommissions"
        component={PendingCommissions}
      />
      <PendingMenuStack.Screen
        name="PendingSalesOffer"
        component={PendingSalesOffer}
      />
    </PendingMenuStack.Navigator>
  );
};

export default PendingMenuStack;
