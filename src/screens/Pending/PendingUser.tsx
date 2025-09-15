import {MainContainer, CustomText} from '@/components';
import PendingAccessCard from '@/components/PendingAccessCard';
import {
  Colors,
  FONT_FAMILY,
  FontType,
  Images,
  Metrix,
  NavigationService,
} from '@/config';
import {RouteNames} from '@/config/routes';
import {dispatchToStore, RootState} from '@/redux/store';
import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useSelector} from 'react-redux';
import {usePendingStatusCheck} from '@/hooks/usePendingStatusCheck';
import {
  setAuthPayload,
  setCategoryType,
  loginSucces,
} from '@/redux/slice/AuthSlice/authSlice';
import {
  setUserDetail,
  setTokens,
  setFilterPayload,
} from '@/redux/slice/UserSlice/userSlice';
import {APIS} from '@/services/apiMethods';
import {useMutation} from '@tanstack/react-query';

const PendingUser = ({navigation}) => {
  // Check user status on every screen focus
  usePendingStatusCheck();
  const fcm = useSelector((state: RootState) => state.user.fcm);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const isAgent = useSelector((state: RootState) => state.user.agent);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  const logoutMutation = useMutation({
    mutationFn: (body: {fcm_token: string}) => APIS?.postLogout(body),
    onSuccess: data => {
      dispatchToStore(setUserDetail({}));
      dispatchToStore(setTokens({}));
      dispatchToStore(setFilterPayload({}));
      dispatchToStore(setAuthPayload({}));
      // dispatchToStore(setFcmToken('fcmToken'));
      dispatchToStore(setCategoryType(''));

      dispatchToStore(loginSucces(false));
    },
    onError: (error: any) => {},
  });
  if (loading) {
    return (
      <MainContainer isHeader isFlatList heading="Profile">
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          {/* User Info */}
          <View style={styles.userContainer}>
            <View style={styles.userImgContainer}>
              <SkeletonPlaceholder borderRadius={8}>
                <SkeletonPlaceholder.Item
                  width={50}
                  height={50}
                  borderRadius={25}
                />
              </SkeletonPlaceholder>
              <View>
                <SkeletonPlaceholder borderRadius={8}>
                  <SkeletonPlaceholder.Item
                    width={110}
                    height={18}
                    borderRadius={4}
                  />
                  <SkeletonPlaceholder.Item
                    width={60}
                    height={14}
                    borderRadius={4}
                    style={styles.skeletonItemMargin}
                  />
                </SkeletonPlaceholder>
              </View>
            </View>
            <SkeletonPlaceholder borderRadius={8}>
              <SkeletonPlaceholder.Item
                width={90}
                height={20}
                borderRadius={4}
              />
            </SkeletonPlaceholder>
          </View>

          {/* Agency Info Card with border */}
          {[...Array(5)].map((_, i) => (
            <View style={styles.agencyInformationContainer} key={i}>
              <SkeletonPlaceholder borderRadius={8}>
                <SkeletonPlaceholder.Item
                  width={120}
                  height={18}
                  borderRadius={4}
                />
              </SkeletonPlaceholder>
            </View>
          ))}
        </ScrollView>
      </MainContainer>
    );
  }
  const handleLogout = () => {
    logoutMutation.mutate({
      fcm_token: fcm,
    });
  };
  return (
    <MainContainer
      isHeader
      heading="Profile"
      firstIcon={() => <Images.LogoutSVG transform={[{rotate: '180deg'}]} />}
      firstIconPress={() => {
        handleLogout();
      }}
      customeStyle={styles.mainContainerCustom}>
      <View style={styles.headerRow}>
        <Images.AvatarSVG
          height={Metrix.VerticalSize(50)}
          width={Metrix.VerticalSize(50)}
        />
        <View style={styles.headerNameContainer}>
          <CustomText.LargeBoldText>-</CustomText.LargeBoldText>
          <View style={styles.statusContainer}>
            <CustomText.LargeSemiBoldText customStyle={styles.adminText}>
              {isAgent ? 'Agent' : 'Admin'}
            </CustomText.LargeSemiBoldText>
            <TouchableOpacity
              onPress={() =>
                NavigationService.navigate(RouteNames.HomeRoutes.ChangePassword)
              }
              style={styles.changePasswordBtn}>
              <CustomText.MediumText customStyle={styles.changePasswordText}>
                Change Password
              </CustomText.MediumText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.pendingAccessCardContainer}>
        <PendingAccessCard />
      </View>
    </MainContainer>
  );
};
const styles = StyleSheet.create({
  mainContainerCustom: {
    paddingHorizontal: Metrix.HorizontalSize(15),
    flex: 1,
  },
  avatarImg: {
    height: Metrix.VerticalSize(50),
    width: Metrix.VerticalSize(50),
  },
  headerRow: {
    paddingVertical: Metrix.VerticalSize(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerNameContainer: {
    justifyContent: 'space-between',
    width: '80%',
  },
  userContainer: {
    paddingTop: Metrix.VerticalSize(20),
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  changePasswordBtn: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Metrix.HorizontalSize(10),
    paddingVertical: Metrix.VerticalSize(2),
    borderRadius: Metrix.RoundRadius,
  },
  userImgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Metrix.HorizontalSize(12),
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: Metrix.VerticalSize(2),
  },
  adminText: {
    color: Colors.Grey,
    fontSize: FontType.FontSemiMedium,
  },
  changePasswordText: {
    fontSize: FontType.FontRegular,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.TransparentGrey,
    borderRadius: Metrix.VerticalSize(5),
    justifyContent: 'space-between',
    marginTop: Metrix.VerticalSize(20),
    alignItems: 'center',
    paddingHorizontal: Metrix.HorizontalSize(4),
  },
  tabTextContainer: {
    paddingVertical: Metrix.VerticalSize(10),
    paddingHorizontal: Metrix.HorizontalSize(9),
    marginVertical: Metrix.VerticalSize(2),
  },
  activeTab: {
    backgroundColor: Colors.White,

    borderRadius: Metrix.VerticalSize(5),
    elevation: 1,
    shadowColor: Colors.Black,
    shadowOffset: {
      width: Metrix.HorizontalSize(0),
      height: Metrix.HorizontalSize(2),
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tabLine: {
    height: Metrix.VerticalSize(10),
    width: Metrix.HorizontalSize(1),
    backgroundColor: Colors.Grey,
  },
  agencyInformationContainer: {
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    borderRadius: Metrix.VerticalSize(10),
    paddingVertical: Metrix.VerticalSize(20),
    paddingHorizontal: Metrix.HorizontalSize(15),
    backgroundColor: Colors.White,
    marginTop: Metrix.VerticalSize(20),
  },

  titleText: {
    width: '40%',
    fontSize: FontType.FontSemiMedium,
  },
  titleContainer: {
    flexDirection: 'row',
    marginBottom: Metrix.VerticalSize(10),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pendingText: {
    color: Colors.Yellow,
    borderWidth: 1,
    borderColor: Colors.Yellow,
    borderRadius: Metrix.RoundRadius,
    paddingHorizontal: Metrix.HorizontalSize(13),
    paddingVertical: Metrix.VerticalSize(2),
    backgroundColor: Colors.YellowBadge('0.1'),
    fontSize: FontType.FontSmall,
  },
  documentItem: {
    flexDirection: 'row',
    marginTop: Metrix.VerticalSize(10),
  },
  documentItemImg: {
    height: Metrix.VerticalSize(32),
    width: Metrix.HorizontalSize(32),
    resizeMode: 'contain',
    tintColor: Colors.White,
  },
  documentImgContainer: {
    backgroundColor: Colors.Black,
    padding: Metrix.VerticalSize(5),
    borderRadius: Metrix.VerticalSize(8),
  },
  updateText: {
    textDecorationLine: 'underline',
    fontSize: FontType.FontMedium,
  },
  downloadIcon: {
    height: Metrix.VerticalSize(27),
    width: Metrix.HorizontalSize(27),
    resizeMode: 'contain',
    alignSelf: 'flex-end',
  },
  documentItemText: {
    flexDirection: 'row',
    width: '70%',
    gap: Metrix.HorizontalSize(10),
  },
  documentItemUpdateContainer: {
    alignItems: 'flex-end',
    width: '30%',
  },
  documentItemTextContainer: {
    width: '70%',
    justifyContent: 'space-between',
    marginVertical: Metrix.VerticalSize(2),
  },
  documentItemSize: {
    color: Colors.Grey,
    fontSize: FontType.FontSmall,
  },
  documentItemTitle: {
    fontSize: FontType.FontSemiMedium,
  },
  activeTabText: {
    fontSize: FontType.FontSmall,
  },
  agencyInfoItem: {
    flexDirection: 'row',
    gap: Metrix.HorizontalSize(10),
    marginTop: Metrix.VerticalSize(10),
  },
  agencyInfoValue: {
    fontSize: FontType.FontSemiMedium,
    fontFamily: FONT_FAMILY.InterSemiBold,
    textAlign: 'right',
    flexGrow: 1,
    paddingLeft: Metrix.HorizontalSize(0),
    textAlignVertical: 'top',
  },
  inputContainer: {
    marginTop: Metrix.VerticalSize(0),
    width: '100%',
    marginHorizontal: Metrix.HorizontalSize(0),
    height: 'auto',
    paddingVertical: Metrix.HorizontalSize(0),
    justifyContent: 'flex-end',
    backgroundColor: Colors.White,
    borderRadius: Metrix.HorizontalSize(0),
    borderWidth: Metrix.HorizontalSize(0),
  },
  inputMainContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  btn: {
    marginTop: Metrix.VerticalSize(20),
  },
  pendingAccessCardContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  skeletonItemMargin: {
    marginTop: 6,
  },
});

export default PendingUser;
