import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Switch,
  Alert,
} from 'react-native';
import {CustomText, CustomModal} from '@/components';
import {dispatchToStore, RootState} from '@/redux/store';
import {
  loginSucces,
  setAuthPayload,
  setCategoryType,
  setFaceIdCredentials,
} from '@/redux/slice/AuthSlice/authSlice';
import {NavigationService, Images, Colors, Metrix, FontType} from '@/config';
import {useFocusEffect} from '@react-navigation/native';
import {ACTIVE_OPACITY} from '@/constants/globalConst';
import {RouteNames} from '@/config/routes';
import {
  setFcmToken,
  setFilterPayload,
  setTokens,
  setUserDetail,
} from '@/redux/slice/UserSlice/userSlice';
import {useSelector} from 'react-redux';
import * as Keychain from 'react-native-keychain';
import {showToast} from '@/utils/business.helper';
import {useMutation} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';

const Menu = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(true);
  const isAgent = useSelector((state: RootState) => state.user.agent);
  const fcm = useSelector((state: RootState) => state.user.fcm);
  const userEmail = useSelector(
    (state: RootState) => state.user?.userDetail?.agent?.email,
  );
  const faceIdCredentials = useSelector(
    (state: RootState) => state.auth.faceIdCredentials,
  );
  const [faceIdEnabled, setFaceIdEnabled] = useState(
    faceIdCredentials?.email == userEmail ? true : false,
  );
  const logoutMutation = useMutation({
    mutationFn: (body: {fcm_token: string}) => APIS?.postLogout(body),
    onSuccess: data => {
      dispatchToStore(setUserDetail({}));
      dispatchToStore(setTokens({}));
      dispatchToStore(setFilterPayload({}));
      dispatchToStore(setAuthPayload({}));
      // dispatchToStore(setFcmToken('fcmToken'));
      dispatchToStore(setCategoryType(''));
      setModalVisible(false);
      dispatchToStore(loginSucces(false));
    },
    onError: (error: any) => {},
  });
  useEffect(() => {
    setFaceIdEnabled(faceIdCredentials?.email == userEmail ? true : false);
  }, [faceIdCredentials]);

  const handleFaceId = async () => {
    if (faceIdEnabled) {
      Alert.alert(
        'Disable Face ID',
        'Are you sure you want to disable Face ID? Your saved credentials will be removed.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: async () => {
              await Keychain.resetGenericPassword();
              dispatchToStore(setFaceIdCredentials({}));
              setFaceIdEnabled(!faceIdEnabled);
            },
          },
        ],
      );
    } else {
      if (faceIdCredentials?.email === userEmail) {
        await Keychain.setGenericPassword(
          faceIdCredentials?.email,
          faceIdCredentials?.password,
        );
        dispatchToStore(
          setFaceIdCredentials({
            email: faceIdCredentials?.email,
            password: faceIdCredentials?.password,
          }),
        );
        setFaceIdEnabled(!faceIdEnabled);
      } else {
        Alert.alert(
          'Replace Face ID Credentials',
          'Are you sure you want to replace your previously saved credentials with the current logged in credentials?',
          [
            {
              text: 'No',
              style: 'cancel',
            },
            {
              text: 'Yes',
              style: 'default',
              onPress: async () => {
                try {
                  setModalVisible(false);
                  NavigationService.navigate(
                    RouteNames.HomeRoutes.FaceIdCredentials,
                  );

                  // setFaceIdEnabled(!faceIdEnabled);
                } catch (error) {
                  showToast('error', 'Error', 'Failed to remove credentials');
                }
              },
            },
          ],
        );
      }
    }
  };

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
        NavigationService.navigate(RouteNames.HomeRoutes.Eoi);
      },
    },
    // { removed / commented as per client's requirment
    //   key: 'SalesOffer',
    //   icons: Images.SalesOffer,
    //   label: 'Sales Offer',
    //   onPress: () => {
    //     setModalVisible(false);
    //     NavigationService.navigate(RouteNames.HomeRoutes.SalesOffer);
    //   },
    // },
    {
      key: 'Commission',

      icons: Images.Commission,
      label: 'Commission',
      onPress: () => {
        setModalVisible(false);
        NavigationService.navigate(RouteNames.HomeRoutes.Commissions);
      },
    },
    {
      key: 'Users',

      icons: Images.User,
      label: 'Users',
      onPress: () => {
        setModalVisible(false);
        NavigationService.navigate(RouteNames.HomeRoutes.Agents);
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
    {
      key: 'Face ID',
      icons: Images.FaceId,
      label: 'Face ID',
      onPress: () => {},
    },
  ];

  const handleLogout = () => {
    logoutMutation.mutate({
      fcm_token: fcm,
    });
  };

  useFocusEffect(
    useCallback(() => {
      setModalVisible(true);
    }, []),
  );

  // Also ensure modal opens when component mounts
  useEffect(() => {
    setModalVisible(true);

    // Reset modal state when component unmounts
    return () => {
      setModalVisible(false);
    };
  }, []);

  const handleOnClose = () => {
    NavigationService.goBack();
    setModalVisible(false);
  };

  const renderListItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={item?.onPress}
        style={[styles.menuItem, styles.menuItemSpaceBetween]}
        activeOpacity={0.7}>
        {/* {item?.icon && item?.icon()} */}
        <View style={styles.menuLeftContainer}>
          <Image
            resizeMode={'contain'}
            source={item?.icons}
            style={styles.menuIcon as any}
          />
          <CustomText.LargeSemiBoldText customStyle={styles.mediumFont}>
            {item.label}
          </CustomText.LargeSemiBoldText>
        </View>
        {item?.key === 'Face ID' && (
          <Switch
            value={faceIdEnabled}
            onValueChange={handleFaceId}
            trackColor={{true: Colors.LightBlack}}
            thumbColor={Colors.White}
            style={styles.switchCompact}
            // ios_backgroundColor={Colors.Grey}
          />
        )}
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
            style={styles.crossIcon as any}
          />
        </TouchableOpacity>
        <View style={styles.menuContainer}>
          <FlatList
            data={
              isAgent
                ? MENU_ITEMS.filter(item => item.key !== 'Users')
                : MENU_ITEMS
            }
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
          <CustomText.LargeSemiBoldText customStyle={styles.mediumFont}>
            Logout
          </CustomText.LargeSemiBoldText>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  menuItemSpaceBetween: {
    justifyContent: 'space-between',
  },
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
    height: Metrix.VerticalSize(68),
  },
  menuLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: Metrix.HorizontalSize(24),
    height: Metrix.VerticalSize(24),
    marginRight: Metrix.HorizontalSize(18),
  },
  mediumFont: {
    fontSize: FontType.FontMedium,
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
  switchCompact: {
    transform: [{scaleX: 0.9}, {scaleY: 0.9}],
  },
  logoutIcon: {
    width: Metrix.HorizontalSize(22),
    height: Metrix.VerticalSize(22),
    marginRight: Metrix.HorizontalSize(18),
  },
});

export default Menu;
