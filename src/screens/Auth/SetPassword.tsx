import React, {useState} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import CustomText from '@/components/CustomText';
import {CustomInput} from '@/components/CustomInput';
import Metrix from '@/config/metrix';
import {PrimaryButton} from '@/components/PrimaryButton';
import {Colors, FontType, Images, NavigationService} from '@/config';
import {RouteNames} from '@/config/routes';
import {MainContainer} from '@/components/MainContainer';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {SetPasswordValidation} from '@/components/Validations';
import {readableVersion} from '@/constants/globalConst';
import {useMutation} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';
import {showToast} from '@/utils/business.helper';
import {useSelector} from 'react-redux';
import {dispatchToStore, RootState} from '@/redux/store';
import {Loader} from '@/components';
import {
  isAgent,
  setTokens,
  setUserDetail,
} from '@/redux/slice/UserSlice/userSlice';
import {loginSucces, setUserEmail} from '@/redux/slice/AuthSlice/authSlice';

interface AuthPayload {
  email?: string;
  token?: string;
}
interface resetPasswordPayload {
  new_password: string;
  token: string;
}
interface setPasswordPayload {
  email: string;
  new_password: string;
  token: string;
  is_agent?: boolean;
}

export default function SetPassword(props) {
  const from = props?.route?.params?.from;
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const authPayload = useSelector(
    (state: RootState) => state?.auth?.authPayload as AuthPayload,
  );
  const email = authPayload?.email?.toLowerCase();
  const agentEmail = props?.route?.params?.email?.toLowerCase();
  const agentToken = props?.route?.params?.token;
  const setPasswordToken = authPayload?.token;
  const resetPasswordToken = props?.route?.params?.token || '0900'; // Get token from deep link or use default
  const is_agent = props?.route?.params?.is_agent || false; // Get is_agent parameter from deep link

  const buttonTitle =
    from == 'forgotPassword' ? 'Set New Password' : 'Set Password';

  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(SetPasswordValidation),
  });

  const setPasswordMuatation = useMutation({
    mutationFn: (body: setPasswordPayload) => APIS?.setPassword(body),
    onSuccess: data => {
      dispatchToStore(
        setTokens({
          ...data?.data?.data?.tokens,
        }),
      );
      dispatchToStore(isAgent(data?.data?.data?.user?.is_agent));
      dispatchToStore(
        setUserDetail({
          ...data?.data?.data?.user,
          status: data?.data?.data?.status,
        }),
      );
      setLoading(false);
      if (
        data?.data?.data?.status == 'APPROVED' &&
        data?.data?.data?.detail == 'REDIRECT_TO_DASHBOARD'
      ) {
        dispatchToStore(loginSucces(true));
      } else {
        NavigationService.reset_0(RouteNames.AuthRoutes.Success, {
          from: 'setPassword',
          heading: 'Your password has been set successfully',
          buttonText: 'Close',
        });
      }
    },
    onError: (error: any) => {
      setLoading(false);
      showToast(
        'error',
        'Error',
        error?.response?.data?.message || 'Set Password Failed',
      );
    },
  });

  const resetPasswordMuatation = useMutation({
    mutationFn: (body: resetPasswordPayload) => APIS?.resetPassword(body),
    onSuccess: data => {
      setLoading(false);
      NavigationService.reset_0(RouteNames.AuthRoutes.Success, {
        from: 'resetPaasword',
        heading:
          'Your New Password Has Been Set Successfully. Please Login To Continue.',
        buttonText: 'Login',
      });
    },
    onError: (error: any) => {
      setLoading(false);
      showToast(
        'error',
        'Error',
        error?.response?.data?.message || 'Reset Password Failed',
      );
    },
  });
  const handleSetPassword = (values: any) => {
    setLoading(true);
    if (from == 'otp') {
      dispatchToStore(setUserEmail(email?.toLowerCase()));
      setPasswordMuatation.mutate({
        email: email?.toLowerCase(),
        new_password: values?.newPassword,
        token: setPasswordToken,
      });
    } else if (is_agent) {
      setPasswordMuatation.mutate({
        email: agentEmail?.toLowerCase(),
        new_password: values?.newPassword,
        token: agentToken,
        is_agent: is_agent,
      });
    } else {
      resetPasswordMuatation.mutate({
        new_password: values?.newPassword,
        token: resetPasswordToken,
      });
    }
  };

  return (
    <ImageBackground
      resizeMode="stretch"
      source={Images.LoginBackground}
      style={{flex: 1}}>
      <MainContainer
        mainContainerStyle={{backgroundColor: Colors.Transparent}}
        customeStyle={styles.mainContainerCustomStyle}>
        <View style={styles.contentContainer}>
          <CustomInput
            heading="Password"
            placeholder="e.g Yourpassword@123.."
            autoCapitalize="none"
            secureTextEntry={!showPassword}
            eye
            isIcon={() => (
              <Images.PasswordSVG
                width={Metrix.HorizontalSize(18)}
                height={Metrix.HorizontalSize(18)}
                marginLeft={Metrix.HorizontalSize(10)}
              />
            )}
            isRequired
            hidepswdState={!showPassword}
            onEyePress={() => setShowPassword(prev => !prev)}
            returnKeyType="next"
            fieldName={'newPassword'}
            control={control}
            errTxt={errors?.newPassword && errors?.newPassword?.message}
          />
          <CustomInput
            heading="Confirm Password"
            placeholder="e.g Yourpassword@123.."
            autoCapitalize="none"
            secureTextEntry={!showConfirmPassword}
            eye
            isIcon={() => (
              <Images.PasswordSVG
                width={Metrix.HorizontalSize(18)}
                height={Metrix.HorizontalSize(18)}
                marginLeft={Metrix.HorizontalSize(10)}
              />
            )}
            isRequired
            hidepswdState={!showConfirmPassword}
            onEyePress={() => setShowConfirmPassword(prev => !prev)}
            returnKeyType="done"
            fieldName={'confirmPassword'}
            control={control}
            errTxt={errors?.confirmPassword && errors?.confirmPassword?.message}
          />
          <CustomText.RegularText customStyle={styles.requirements}>
            Your password must be more than 8 characters long, should contain at
            least 1 uppercase character, 1 lowercase character, 1 numeric
            character and 1 special character.
          </CustomText.RegularText>
          <PrimaryButton
            isRightIcon
            title={buttonTitle}
            onPress={handleSubmit(handleSetPassword)}
          />
        </View>
      </MainContainer>
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
  requirements: {
    marginBottom: Metrix.VerticalSize(30),
    fontSize: FontType.FontSmall,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: Metrix.VerticalSize(130),
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
  mainContainerCustomStyle: {
    paddingHorizontal: Metrix.HorizontalSize(0),
    paddingVertical: Metrix.HorizontalSize(0),
  },
});
