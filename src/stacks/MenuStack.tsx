import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Menu from '@/screens/Main/Menu';
import Help from '@/screens/Main/Help';
import {RouteNames} from '@/config/routes';
import {Agents, Commissions, FaceIdCredentials, SalesOffer} from '@/screens';

const MenuStack = () => {
  const MenuStack = createStackNavigator();
  return (
    <MenuStack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.ModalFadeTransition,
      }}>
      <MenuStack.Screen name="MenuMain" component={Menu} />
      <MenuStack.Screen name="Help" component={Help} />
      <MenuStack.Screen name="Agents" component={Agents} />
      <MenuStack.Screen name="Commissions" component={Commissions} />
      <MenuStack.Screen name="SalesOffer" component={SalesOffer} />
      <MenuStack.Screen
        name="FaceIdCredentials"
        component={FaceIdCredentials}
      />
    </MenuStack.Navigator>
  );
};

export default MenuStack;
