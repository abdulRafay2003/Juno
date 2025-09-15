import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  ImageProps,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Colors, FontType, Images, Metrix} from '@/config';
import CustomText from '@/components/CustomText';
import AddTabBarButton from '@/components/AddTabBarButton';
import PendingDashboardStack from './PendingDashboardStack';
import PendingLeads from '@/screens/Pending/PendingLeads';
import PendingEoi from '@/screens/Pending/PendingEoi';
import PendingMenuStack from './PendingMenuStack';
import PendingNotification from '@/screens/Pending/PendingNotification';
const Tab = createBottomTabNavigator();

// Types
type PendingTabStackType = {
  name: string;
  component: React.FC;
  icons: (focused: boolean) => React.ReactNode;
}[];

export const PendingTabStack: React.FC = () => {
  const tabsData: PendingTabStackType = [
    {
      name: 'Dashboard',
      component: PendingDashboardStack,
      icons: (focused: boolean) => (
        <Images.DashboardSVG
          color={focused ? Colors.LightBlack : Colors.inactiveGrey}
          height={focused ? Metrix.VerticalSize(20) : Metrix.VerticalSize(18)}
          width={
            focused ? Metrix.HorizontalSize(20) : Metrix.HorizontalSize(18)
          }
        />
      ),
    },
    {
      name: 'Leads',
      component: PendingLeads,
      icons: (focused: boolean) => (
        <Images.LeadsSVG
          color={focused ? Colors.LightBlack : Colors.inactiveGrey}
          height={focused ? Metrix.VerticalSize(20) : Metrix.VerticalSize(18)}
          width={
            focused ? Metrix.HorizontalSize(20) : Metrix.HorizontalSize(18)
          }
        />
      ),
    },
    {
      name: 'Add',
      component: PendingNotification,
      icons: (focused: boolean) => <Images.DashboardSVG />,
    },
    {
      name: 'Eoi',
      component: PendingEoi,
      icons: (focused: boolean) => (
        <Images.EoiSVG
          color={focused ? Colors.LightBlack : Colors.inactiveGrey}
          height={focused ? Metrix.VerticalSize(22) : Metrix.VerticalSize(20)}
          width={
            focused ? Metrix.HorizontalSize(22) : Metrix.HorizontalSize(20)
          }
        />
      ),
    },
    {
      name: 'Menu',
      component: PendingMenuStack,
      icons: (focused: boolean) => (
        <Images.MenuSVG
          color={focused ? Colors.LightBlack : Colors.inactiveGrey}
          height={focused ? Metrix.VerticalSize(20) : Metrix.VerticalSize(18)}
          width={
            focused ? Metrix.HorizontalSize(20) : Metrix.HorizontalSize(18)
          }
        />
      ),
    },
  ];

  return (
    <>
      <Tab.Navigator
        id={undefined}
        screenOptions={{
          tabBarStyle: styles.tabBarStyle,
          // added this to remove the ripple effect.
          tabBarButton: props => (
            <TouchableWithoutFeedback onPress={props.onPress}>
              <View style={props.style}>{props.children}</View>
            </TouchableWithoutFeedback>
          ),
        }}>
        {tabsData?.map(item => (
          <Tab.Screen
            key={item?.name}
            name={item?.name}
            component={item?.component}
            options={
              {
                animation: 'fade',
                tabBarHideOnKeyboard: true,
                headerShown: false,
                tabBarLabel: ({color, focused}) => (
                  <CustomText.MediumText
                    customStyle={[
                      styles.tabLabel,
                      {color: focused ? Colors.LightBlack : color},
                    ]}>
                    {item?.name}
                  </CustomText.MediumText>
                ),
                tabBarIcon: ({focused}) => <>{item?.icons(focused)}</>,
              } as any
            }
            listeners={({navigation, route}) => ({
              tabPress: e => {
                const state = navigation.getState();
                const tab = state.routes.find(r => r.name === route.name);
                const isMenuTab = route.name === 'Menu';
                const isFocused =
                  state.index ===
                  state.routes.findIndex(r => r.name === route.name);
                if (isMenuTab && isFocused) {
                  // Prevent default navigation for Menu tab if already focused
                  return;
                }
                if (tab?.state && tab.state.index > 0) {
                  navigation.navigate(route.name, {
                    screen: tab.state.routeNames[0],
                  });
                }
              },
            })}
          />
        ))}
      </Tab.Navigator>
      <AddTabBarButton />
    </>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: Colors.TabBarBg,
    height: Metrix.VerticalSize(90),
    paddingTop:
      Platform.OS === 'ios' ? Metrix.VerticalSize(15) : Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(15),
  },
  tabLabel: {
    fontSize: FontType.FontSuperSmall,
  },
  tabIcon: {
    width: Metrix.HorizontalSize(18),
    height: Metrix.VerticalSize(18),
  },
  addContainer: {
    bottom: Metrix.VerticalSize(28),
    width: Metrix.HorizontalSize(65),
    height: Metrix.HorizontalSize(50),
    borderRadius: Metrix.Radius,
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.Black,
  },
  plusIcon: {
    width: Metrix.HorizontalSize(20),
    height: Metrix.VerticalSize(20),
  },
});
