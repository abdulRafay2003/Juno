import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import CustomText from '@/components/CustomText';
import {PrimaryButton} from '@/components/PrimaryButton';
import {MainContainer} from '@/components/MainContainer';
import {Colors, FontType, Metrix, NavigationService} from '@/config';
import Images from '@/config/images';
import {RouteNames} from '@/config/routes';
import moment from 'moment';

export default function Success(props) {
  const from = props?.route?.params?.from;
  const heading = props?.route?.params?.heading;
  const buttonText = props?.route?.params?.buttonText;
  const headingStyle = props?.route?.params?.headingStyle;
  const detailText = props?.route?.params?.detailText;
  const expiryTime = props?.route?.params?.expiryTime;
  function differenceInMinutes(epochMs) {
    const futureDate = new Date(epochMs); // Convert epoch ms to Date object
    const now = new Date(); // Current Date object

    const diffMs = futureDate - now; // Difference in milliseconds
    const diffMinutes = diffMs / (1000 * 60); // Convert ms to minutes

    return Math.ceil(diffMinutes); // Can be positive (future) or negative (past)
  }

  const onBtnPress = async () => {
    switch (from) {
      case 'resetPaasword':
      case 'registeration':
        NavigationService.reset_0(RouteNames.AuthRoutes.Login);
        break;
      case 'signup':
        NavigationService.replace(RouteNames.AuthRoutes.OtpScreen, {
          expiryTime: differenceInMinutes(expiryTime) * 60,
        });
        break;
      case 'otp':
        NavigationService.replace(RouteNames.AuthRoutes.SetPassword, {
          from: from,
        });
        break;
      case 'setPassword':
        NavigationService.reset_0(RouteNames.AuthRoutes.Registeration);
        break;
      case 'changePassword':
      case 'leads':
      case 'eoi':
      case 'agent':
        NavigationService.pop(2);
        break;
      case 'commissions':
        NavigationService.popToTop();
        break;
      case 'homeLead':
        NavigationService.reset_0(RouteNames.HomeRoutes.TabStack, {
          state: {
            index: 0,
            routes: [{name: RouteNames.HomeRoutes.Leads}],
          },
        });
        break;
      case 'homeEoi':
        NavigationService.reset_0(RouteNames.HomeRoutes.TabStack, {
          state: {
            index: 0,
            routes: [{name: RouteNames.HomeRoutes.Eoi}],
          },
        });
        break;
      case 'homeAgent':
        NavigationService.navigate('TabStack', {
          screen: 'Menu',
          params: {
            screen: 'Agents',
          },
        });
        break;

      case 'agentRegistration':
        NavigationService.reset_0(RouteNames.AuthRoutes.Login);
        break;

      default:
        NavigationService.reset_0(RouteNames.AuthRoutes.Login);
        break;
    }
  };

  return (
    <MainContainer>
      <View style={styles.middleContainer}>
        <Image
          source={Images.Success}
          style={styles.successIcon}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <CustomText.RegularText
            customStyle={[styles.headingStyle, headingStyle]}>
            {heading}
          </CustomText.RegularText>
          <CustomText.ExtraLargeBoldText customStyle={styles.detailText}>
            {detailText}
          </CustomText.ExtraLargeBoldText>
        </View>
      </View>
      <PrimaryButton
        title={buttonText ? buttonText : 'Continue'}
        onPress={onBtnPress}
      />
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  middleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieStyle: {
    width: Metrix.HorizontalSize(100),
    height: Metrix.VerticalSize(100),
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Metrix.VerticalSize(10),
  },
  headingStyle: {
    textAlign: 'center',
    fontSize: FontType.FontExtraLarge2,
  },
  subHeading: {textAlign: 'center', width: '100%'},
  successIcon: {
    width: Metrix.HorizontalSize(50),
    height: Metrix.VerticalSize(50),
  },
  detailText: {
    fontSize: FontType.FontRegular,
    paddingTop: Metrix.VerticalSize(10),
    color: Colors.PieChartGray1,
  },
});
