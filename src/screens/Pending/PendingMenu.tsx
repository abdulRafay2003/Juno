import React, {useCallback, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {CustomText, CustomModal} from '@/components';
import {dispatchToStore} from '@/redux/store';
import {loginSucces, setCategoryType} from '@/redux/slice/AuthSlice/authSlice';
import {NavigationService, Images, Colors, Metrix, FontType} from '@/config';
import {useFocusEffect} from '@react-navigation/native';
import {ACTIVE_OPACITY} from '@/constants/globalConst';
import {RouteNames} from '@/config/routes';
import {usePendingStatusCheck} from '@/hooks/usePendingStatusCheck';

const PendingMenu = ({navigation}) => {
  // Check user status on every screen focus
  usePendingStatusCheck();

  const [modalVisible, setModalVisible] = useState(true);

  const MENU_ITEMS = [
    {
      key: 'Dashboard',

      icons: Images.Dashbboard,
      label: 'Dashboard',
      onPress: () => {
        setModalVisible(false);
        NavigationService.navigate('Dashboard');
      },
    },
    {
      key: 'Leads',

      icons: Images.Leads,
      label: 'Leads',
      onPress: () => {
        setModalVisible(false);
        NavigationService.navigate('Leads');
      },
    },
    {
      key: 'EOI',

      icons: Images.EOI,
      label: 'EOI',
      onPress: () => {
        setModalVisible(false);
        NavigationService.navigate(RouteNames.PendingRoutes.PendingEoi);
      },
    },
    // { removed / commented as per client's requirment
    //   key: 'SalesOffer',
    //   icons: Images.SalesOffer,
    //   label: 'Sales Offer',
    //   onPress: () => {
    //     setModalVisible(false);
    //     NavigationService.navigate(RouteNames.PendingRoutes.PendingSalesOffer);
    //   },
    // },
    {
      key: 'Commission',

      icons: Images.Commission,
      label: 'Commission',
      onPress: () => {
        setModalVisible(false);
        NavigationService.navigate(RouteNames.PendingRoutes.PendingCommissions);
      },
    },
    {
      key: 'Users',

      icons: Images.User,
      label: 'Users',
      onPress: () => {
        setModalVisible(false);
        NavigationService.navigate(RouteNames.PendingRoutes.PendingAgents);
      },
    },

    {
      key: 'Help',

      icons: Images.Menu,
      label: 'Help',
      onPress: () => {
        setModalVisible(false);
        navigation.navigate('Help');
      },
    },
  ];

  const handleLogout = () => {
    dispatchToStore(loginSucces(false));
    dispatchToStore(setCategoryType(''));
  };

  useFocusEffect(
    useCallback(() => {
      setModalVisible(true);
    }, []),
  );

  const handleOnClose = () => {
    NavigationService.goBack();
    setModalVisible(false);
  };

  const renderListItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={item?.onPress}
        style={styles.menuItem}
        activeOpacity={0.7}>
        {/* {item?.icon && item?.icon()} */}
        <Image
          resizeMode={'contain'}
          source={item?.icons}
          style={styles.menuIcon}
        />
        <CustomText.LargeSemiBoldText
          customStyle={{fontSize: FontType.FontMedium}}>
          {item.label}
        </CustomText.LargeSemiBoldText>
      </TouchableOpacity>
    );
  };

  return (
    <CustomModal visible={modalVisible} onClose={handleOnClose}>
      <View style={styles.overlay}>
        <TouchableOpacity onPress={handleOnClose} style={styles.crossContainer}>
          <Image
            source={Images.Cross}
            resizeMode="contain"
            style={styles.crossIcon}
          />
        </TouchableOpacity>
        <View style={styles.menuContainer}>
          <FlatList
            data={MENU_ITEMS}
            keyExtractor={item => item?.key}
            renderItem={renderListItem}
            contentContainerStyle={styles.menuList}
            bounces={false}
          />
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={ACTIVE_OPACITY}
          style={styles.logoutContainer}>
          <Images.LogoutSVG
            transform={[{rotate: '180deg'}]}
            width={Metrix.HorizontalSize(22)}
            height={Metrix.VerticalSize(22)}
            marginRight={Metrix.HorizontalSize(18)}
          />
          <CustomText.LargeSemiBoldText
            customStyle={{fontSize: FontType.FontMedium}}>
            Logout
          </CustomText.LargeSemiBoldText>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  crossContainer: {
    alignSelf: 'flex-end',
    borderRadius: Metrix.RoundRadius,
    padding: Metrix.HorizontalSize(8),
    backgroundColor: Colors.DarkGrey,
    marginBottom: Metrix.VerticalSize(20),
  },
  crossIcon: {
    width: Metrix.HorizontalSize(20),
    height: Metrix.VerticalSize(20),
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    paddingHorizontal: Metrix.HorizontalSize(20),
  },
  menuContainer: {
    width: '100%',
    backgroundColor: Colors.White,
    borderRadius: Metrix.Radius,
  },
  menuList: {
    paddingHorizontal: Metrix.HorizontalSize(18),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Metrix.HorizontalSize(2),
    borderBottomWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    height: Metrix.VerticalSize(75),
  },
  menuIcon: {
    width: Metrix.HorizontalSize(22),
    height: Metrix.VerticalSize(22),
    marginRight: Metrix.HorizontalSize(18),
    resizeMode: 'contain',
  },
  logoutContainer: {
    marginTop: Metrix.VerticalSize(20),
    backgroundColor: Colors.White,
    borderRadius: Metrix.HorizontalSize(8),
    paddingHorizontal: Metrix.HorizontalSize(20),
    height: Metrix.VerticalSize(60),
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutIcon: {
    width: Metrix.HorizontalSize(22),
    height: Metrix.VerticalSize(22),
    marginRight: Metrix.HorizontalSize(18),
  },
});

export default PendingMenu;
