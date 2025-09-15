import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
  ImageStyle,
  Platform,
} from 'react-native';
import {
  Colors,
  FontType,
  Images,
  Metrix,
  NavigationService,
} from '../../config';
import CustomText from '../CustomText';
import {useMutation} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';

export type BackHeaderProps = {
  heading?: string;
  subheading?: string;
  customeHeaderStyle?: StyleProp<ViewStyle>;
  backArrow?: boolean;
  backFunction?: () => void;
  btnImageStyle?: ImageStyle;
  firstIcon?: () => React.ReactNode;
  firstIconPress?: () => void;
  secondIcon?: () => React.ReactNode;
  secondIconPress?: () => void;
  disabled?: boolean;
  notificationData?: any;
};

export const Header: React.FC<BackHeaderProps> = ({
  heading = '',
  subheading = '',
  customeHeaderStyle,
  backArrow = true,
  backFunction = () => NavigationService.goBack(),
  btnImageStyle,
  firstIcon,
  firstIconPress,
  secondIcon,
  secondIconPress,
  disabled = false,
  notificationData,
}) => {
  const getNotifications = useMutation({
    mutationFn: () => APIS.getNotifications(),
    onSuccess: resp => {},
    onError: error => {},
  });
  useEffect(() => {
    getNotifications.mutate();
  }, []);
  return (
    <View style={[styles.container, customeHeaderStyle]}>
      <View style={styles.leftContainer}>
        {backArrow && (
          <TouchableOpacity
            hitSlop={Metrix.HorizontalSize(50)}
            style={{marginRight: Metrix.HorizontalSize(10)}}
            onPress={backFunction}>
            <Image
              source={Images.Arrow}
              resizeMode="contain"
              style={[styles.backImage, btnImageStyle]}
            />
          </TouchableOpacity>
        )}
        <View
          style={[
            styles.headingContainer,
            !firstIcon ? {width: '90%' as const} : {},
          ]}>
          <CustomText.LargeSemiBoldText
            customStyle={{fontSize: FontType.FontExtraLarge}}>
            {heading}
            {subheading && (
              <CustomText.LargeSemiBoldText
                customStyle={{fontSize: FontType.FontSmall}}>
                {subheading}
              </CustomText.LargeSemiBoldText>
            )}
          </CustomText.LargeSemiBoldText>
        </View>
      </View>
      <View style={styles.rightIconsContainer}>
        {firstIcon && (
          <View style={{}}>
            <TouchableOpacity onPress={firstIconPress} disabled={disabled}>
              {heading === 'Dashboard' && (
                <>
                  {notificationData?.any_unread && (
                    <View style={styles.badgeContainer}>
                      <CustomText.RegularText customStyle={styles.badgeText}>
                        {notificationData?.unread_count > 9
                          ? '9+'
                          : notificationData?.unread_count}
                      </CustomText.RegularText>
                    </View>
                  )}
                </>
              )}
              {firstIcon()}
            </TouchableOpacity>
          </View>
        )}
        {secondIcon && (
          <TouchableOpacity onPress={secondIconPress} disabled={disabled}>
            {secondIcon()}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: Metrix.VerticalSize(10),
    paddingTop: Platform.OS === 'android' ? Metrix.VerticalSize(10) : 0,
    paddingHorizontal: Metrix.VerticalSize(20),
    borderBottomWidth: 1,
    borderColor: Colors.TextInputBorderColor,
  },
  leftContainer: {flexDirection: 'row', alignItems: 'center'},
  backImage: {
    width: Metrix.HorizontalSize(16),
    height: Metrix.VerticalSize(16),
  },
  headingContainer: {
    justifyContent: 'center',
    paddingLeft: Metrix.HorizontalSize(3),
  },
  filterButton: {
    width: Metrix.HorizontalSize(25),
    height: Metrix.VerticalSize(25),
  },
  rightIconsContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Metrix.HorizontalSize(18),
  },
  badgeContainer: {
    height: Metrix.HorizontalSize(17),
    width: Metrix.HorizontalSize(17),
    borderRadius: Metrix.HorizontalSize(17) / 2,
    backgroundColor: 'red',
    position: 'absolute',
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    fontSize: FontType.FontSuperSmall,
    color: Colors.White,
  },
});
