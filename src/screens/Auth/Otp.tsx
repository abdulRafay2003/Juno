import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {FONT_FAMILY, FontType, Images, NavigationService} from '@/config';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Colors from '@/config/colors';
import Metrix from '@/config/metrix';
import CustomText from '@/components/CustomText';
import {RouteNames} from '@/config/routes';
import {PrimaryButton} from '@/components/PrimaryButton';
import {MainContainer} from '@/components/MainContainer';
import {OTP_DIGITS, readableVersion} from '@/constants/globalConst';
import {Loader, SecondaryButton} from '@/components';
import {useRoute} from '@react-navigation/native';
import {useMutation} from '@tanstack/react-query';
import {showToast} from '@/utils/business.helper';
import {APIS} from '@/services/apiMethods';
import {useSelector} from 'react-redux';
import {dispatchToStore, RootState} from '@/redux/store';
import {setAuthPayload} from '@/redux/slice/AuthSlice/authSlice';
import moment from 'moment';
interface AuthPayload {
  email?: string;
}

export default function Otp(props) {
  const authPayload = useSelector(
    (state: RootState) => state?.auth?.authPayload as AuthPayload,
  );
  const email = authPayload?.email;
  const expiryTime = props?.route?.params?.expiryTime;
  const otpRef = useRef(null);
  const [otpCode, setOtpCode] = useState('');
  const [seconds, setSeconds] = useState(expiryTime);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const mutation = useMutation({
    mutationFn: (body: {otp_code: string; email: string; purpose: string}) =>
      APIS?.verifyOtp(body),
    onSuccess: data => {
      setLoading(false);
      dispatchToStore(
        setAuthPayload({
          email: data?.data?.data?.email,
          token: data?.data?.data?.token,
        }),
      );
      NavigationService.replace(RouteNames.AuthRoutes.Success, {
        from: 'otp',
        heading: 'Thank You! Your email verification is completed',
        buttonText: 'Close',
      });
    },
    onError: (error: any) => {
      setLoading(false);
      showToast(
        'error',
        'Error',
        error?.response?.data?.message || 'OTP Verification Failed',
      );
    },
  });
  const otpMutation = useMutation({
    mutationFn: (body: {email: string}) => APIS?.resendOtp(body),
    onSuccess: data => {
      setLoading(false);
      setSeconds(expiryTime);
      showToast(
        'success',
        'OTP Resend',
        data?.data?.message || 'OTP Resend Successfully',
      );
    },
    onError: (error: any) => {
      setLoading(false);
      showToast(
        'error',
        'Error',
        error?.response?.data?.message || 'OTP Verification Failed',
      );
    },
  });
  const handleOtpVerify = () => {
    setLoading(true);
    mutation.mutate({
      otp_code: otpCode,
      email: email?.toLowerCase(),
      purpose: 'register', // login, forgot_password, or register
    });
  };

  useEffect(() => {
    // setSeconds(80);
    const timer = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleResend = () => {
    setLoading(true);
    otpMutation.mutate({
      email: email?.toLowerCase(),
    });
  };
  function formatMinutesSeconds(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes > 0) {
      return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds} Min`;
    } else if (seconds > 0) {
      return `00:${seconds < 10 ? '0' : ''}${seconds} Sec`;
    } else {
      return `00:00    `;
    }
  }
  const handleLoginNavigation = () => {
    setOtpCode('');
    NavigationService.reset_0(RouteNames.AuthRoutes.Login);
  };
  return (
    <ImageBackground
      resizeMode="stretch"
      source={Images.LoginBackground}
      style={{flex: 1}}>
      <View style={styles.contentContainer}>
        <View style={{paddingTop: Metrix.VerticalSize(50)}}>
          <OTPInputView
            ref={otpRef}
            style={styles.otpInput}
            pinCount={OTP_DIGITS}
            code={otpCode}
            editable={seconds > 0}
            onCodeChanged={setOtpCode}
            autoFocusOnLoad
            codeInputFieldStyle={styles.otpBox}
            codeInputHighlightStyle={
              seconds > 0
                ? styles.otpBoxActive
                : {borderColor: Colors.TextInputBorderColor}
            }
            keyboardType="number-pad"
          />
          {error ? (
            <CustomText.RegularText customStyle={styles.error}>
              {error}
            </CustomText.RegularText>
          ) : null}
          <PrimaryButton
            isRightIcon
            title="Verify"
            textColor={
              otpCode.length !== OTP_DIGITS
                ? Colors.PieChartGray2
                : Colors?.White
            }
            onPress={handleOtpVerify}
            disabled={otpCode.length !== OTP_DIGITS || seconds === 0}
            customStyles={
              otpCode.length !== OTP_DIGITS ? styles.buttonDisabled : undefined
            }
            tintColor={
              otpCode.length !== OTP_DIGITS
                ? Colors.PieChartGray2
                : Colors?.White
            }
          />
          <View style={styles.resendRow}>
            <View style={{flexDirection: 'row'}}>
              <CustomText.RegularText>
                Didn't get code yet?
              </CustomText.RegularText>
              <TouchableOpacity onPress={handleResend} disabled={seconds !== 0}>
                <CustomText.MediumText
                  customStyle={{
                    fontSize: FontType.FontRegular,
                    color: seconds === 0 ? Colors.LightBlack : Colors.Grey, // Black when timer is 0, grey otherwise
                  }}>
                  {'  '}
                  Resend
                </CustomText.MediumText>
              </TouchableOpacity>
            </View>
            <CustomText.RegularText
              customStyle={[
                styles.timer,
                {color: seconds > 0 ? Colors.LightBlack : Colors.Grey},
              ]}>
              {formatMinutesSeconds(seconds)}
              {/* {`  00:${seconds < 10 ? '0' : ''}${seconds} Sec`} */}
            </CustomText.RegularText>
          </View>
          <SecondaryButton
            title="Back To Log In"
            onPress={handleLoginNavigation}
            textBold
            customBtnTextStyle={{fontSize: FontType.FontRegular}}
          />
        </View>
      </View>
      <View style={styles.bottomButtonContainer}>
        <CustomText.LargeSemiBoldText customStyle={styles.bottomText}>
          {` Ver: ${readableVersion}`}
        </CustomText.LargeSemiBoldText>
      </View>
      <Loader isLoading={loading} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  otpInput: {
    width: '100%',
    height: Metrix.VerticalSize(70),
    marginBottom: Metrix.VerticalSize(15),
    paddingHorizontal: Metrix.HorizontalSize(20),
  },
  otpBox: {
    width: Metrix.HorizontalSize(48),
    height: Metrix.VerticalSize(65),
    borderRadius: Metrix.VerticalSize(20),
    backgroundColor: Colors.White,
    fontSize: FontType.FontExtraLarge2,
    color: Colors.LightBlack,
    fontFamily: FONT_FAMILY.InterBold,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    marginHorizontal: Metrix.HorizontalSize(5),
  },
  otpBoxActive: {
    borderColor: Colors.LightBlack,
    borderWidth: 2,
  },
  error: {
    color: Colors.Error,
    fontSize: FontType.FontRegular,
    marginBottom: Metrix.VerticalSize(10),
    textAlign: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.UnreadColor,
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Metrix.VerticalSize(10),
    marginBottom: Metrix.HorizontalSize(0),
  },
  timer: {
    fontFamily: FONT_FAMILY.InterRegular,
    fontSize: FontType.FontSemiMedium,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: Metrix.VerticalSize(40),
    paddingHorizontal: Metrix.HorizontalSize(20),
  },
  bottomText: {
    fontSize: FontType.FontSmall,
    color: Colors.PieChartGray2,
    alignSelf: 'center',
    marginVertical: Metrix.HorizontalSize(0),
    marginBottom: Metrix.HorizontalSize(0),
    marginTop: Metrix.VerticalSize(15),
  },
  bottomButtonContainer: {
    paddingHorizontal: Metrix.HorizontalSize(20),
    paddingBottom: Metrix.VerticalSize(30),
  },
});
