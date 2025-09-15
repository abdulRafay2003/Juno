import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import {MainContainer} from '@/components/MainContainer';
import CustomText from '@/components/CustomText';
import {CustomInput} from '@/components/CustomInput';
import {PrimaryButton} from '@/components/PrimaryButton';
import Images from '@/config/images';
import Colors from '@/config/colors';
import Metrix from '@/config/metrix';
import {ACTIVE_OPACITY, readableVersion} from '@/constants/globalConst';
import {dispatchToStore, RootState} from '@/redux/store';
import {
  loginSucces,
  setAuthPayload,
  setFaceIdCredentials,
  setUserEmail,
} from '@/redux/slice/AuthSlice/authSlice';
import {FontType, NavigationService} from '@/config';
import {RouteNames} from '@/config/routes';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup/src/yup';
import {LoginValidation} from '@/components/Validations';
import {Loader, SecondaryButton} from '@/components';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import {useMutation} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';
import {showToast} from '@/utils/business.helper';
import {useSelector} from 'react-redux';
import {
  isAgent,
  setTokens,
  setUserDetail,
} from '@/redux/slice/UserSlice/userSlice';
import * as Keychain from 'react-native-keychain';

const rnBiometrics = new ReactNativeBiometrics();

interface loginBody {
  email: string;
  password: string;
  fcm_token: string;
}

export default function Login({navigation}) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasKeychainPermission, setHasKeychainPermission] = useState(false);
  const fcmToken = useSelector((state: RootState) => state?.user.fcm);

  // Check if credentials exist in keychain on component mount
  useEffect(() => {
    const checkExistingCredentials = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials && credentials.username && credentials.password) {
          setHasKeychainPermission(true);
        }
      } catch (error) {
        console.log('Error checking existing credentials:', error);
      }
    };

    checkExistingCredentials();
  }, []);

  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(LoginValidation),
  });

  const handleLogin = values => {
    setLoading(true);
    const body = {
      email: values?.email.toLowerCase(),
      password: values?.password,
      fcm_token: fcmToken,
    };
    mutation.mutate(body);
  };

  const mutation = useMutation({
    mutationFn: (body: loginBody) => APIS?.login(body),
    onSuccess: async (data, variables) => {
      dispatchToStore(
        setUserEmail(data?.data?.data?.user?.email?.toLowerCase()),
      );
      setLoading(false);
      dispatchToStore(
        setTokens({
          ...data?.data?.data?.tokens,
        }),
      );
      dispatchToStore(isAgent(!!data?.data?.data?.user?.is_agent));
      dispatchToStore(
        setUserDetail({
          ...data?.data?.data?.user,
          status: data?.data?.data?.status,
        }),
      );
      if (
        data?.data?.data?.status == 'PENDING' &&
        data?.data?.data?.has_onboarded == false
      ) {
        // navigate to onbaording
        NavigationService.navigate(RouteNames.AuthRoutes.Registeration);
      } else {
        // Store credentials for Face ID login with user permission
        await handleStoreCredentials(
          variables.email?.toLowerCase(),
          variables.password,
        );
        dispatchToStore(loginSucces(true));
      }
    },
    onError: (error: any) => {
      setLoading(false);
      if (
        error?.response?.data?.data?.detail == 'REDIRECT_TO_OTP_VERIFICATION'
      ) {
        // Fix: variables is not defined in this scope, use error.config.data to get the email from the request payload
        let email = '';
        try {
          // error.config.data is a JSON string of the request body
          const requestData =
            typeof error?.config?.data === 'string'
              ? JSON.parse(error.config.data)
              : {};
          email = requestData.email || '';
        } catch (e) {
          email = '';
        }
        dispatchToStore(
          setAuthPayload({
            email: email?.toLowerCase(),
          }),
        );
        setTimeout(() => {
          NavigationService.navigate(RouteNames.AuthRoutes.OtpScreen);
        }, 300);
      } else if (
        error?.response?.data?.data?.detail === 'REDIRECT_TO_REGISTER'
      ) {
        // navigae to registeration screen.
        setTimeout(() => {
          NavigationService.navigate(RouteNames.AuthRoutes.Signup);
        }, 300);
      } else {
        console.log('error', error?.response);
        showToast(
          'error',
          'Error',
          error?.response?.data?.message || 'Login Failed',
        );
      }
    },
  });

  const handleForgotNavigation = () => {
    NavigationService.navigate(RouteNames.AuthRoutes.ForgotPassword);
  };

  const handleSignup = () => {
    NavigationService.navigate(RouteNames.AuthRoutes.Signup);
  };

  const requestKeychainPermission = () => {
    return new Promise(resolve => {
      Alert.alert(
        'Save Login Credentials',
        "We would like to save your login credentials securely in your device's keychain to enable Face ID login. This information is stored locally and encrypted.",
        [
          {
            text: "Don't Allow",
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: 'Allow',
            onPress: () => resolve(true),
          },
        ],
        {cancelable: false},
      );
    });
  };

  const handleStoreCredentials = async (email: string, password: string) => {
    if (!hasKeychainPermission) {
      const permissionGranted = await requestKeychainPermission();
      if (permissionGranted) {
        setHasKeychainPermission(true);
        dispatchToStore(
          setFaceIdCredentials({
            email: email?.toLowerCase(),
            password: password,
          }),
        );
        await Keychain.setGenericPassword(email?.toLowerCase(), password);
        showToast('success', 'Success', 'Credentials saved for Face ID login');
      } else {
        showToast(
          'alert',
          'Info',
          'Credentials not saved. Face ID login will not be available.',
        );
      }
    } else {
      // Permission already granted, save credentials
      await Keychain.setGenericPassword(email?.toLowerCase(), password);
    }
  };

  const handleFaceIDLogin = async () => {
    // Check if user has granted permission to store credentials
    if (!hasKeychainPermission) {
      showToast(
        'error',
        'Error',
        'Please sign in first to enable Face ID login',
      );
      return;
    }

    const {available, biometryType} = await rnBiometrics.isSensorAvailable();

    if (!available) {
      showToast('error', 'Error', 'Face ID not available');
      return;
    }

    // Authenticate user
    const {success} = await rnBiometrics.simplePrompt({
      promptMessage: 'Log in with Face ID',
    });

    if (success) {
      // Get stored credentials
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const {username: email, password} = credentials;
        setLoading(true);
        mutation.mutate({email, password, fcm_token: fcmToken});
      } else {
        showToast(
          'error',
          'Error',
          'No saved credentials found. Please sign in manually first.',
        );
      }
    } else {
      showToast(
        'error',
        'Error',
        'Face ID authentication failed. Please try again.',
      );
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
        <View style={styles.headerContent}>
          <CustomText.RegularText customStyle={styles.welcomeText}>
            Welcome to
          </CustomText.RegularText>
          <View style={styles.headerRow}>
            <Image
              resizeMode="contain"
              source={Images.Beyond}
              style={styles.beyondLogo}
            />
            <View style={styles.languageRow}>
              <Image
                resizeMode="contain"
                source={Images.UAE}
                style={styles.flagIcon}
              />
              <CustomText.MediumText>English</CustomText.MediumText>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <CustomInput
            heading="Email Address"
            placeholder="e.g. john.doe@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            isRequired
            isIcon={() => (
              <Images.EmailSVG
                width={Metrix.HorizontalSize(18)}
                height={Metrix.HorizontalSize(18)}
                marginLeft={Metrix.HorizontalSize(10)}
              />
            )}
            fieldName={'email'}
            control={control}
            errTxt={errors?.email && errors?.email?.message}
          />
          <CustomInput
            heading="Password"
            placeholder="Enter your secure password"
            autoCapitalize="none"
            secureTextEntry={!showPassword}
            eye
            hidepswdState={!showPassword}
            onEyePress={() => setShowPassword(prev => !prev)}
            returnKeyType="done"
            isRequired
            isIcon={() => (
              <Images.PasswordSVG
                width={Metrix.HorizontalSize(18)}
                height={Metrix.HorizontalSize(18)}
                marginLeft={Metrix.HorizontalSize(10)}
              />
            )}
            fieldName={'password'}
            control={control}
            errTxt={errors?.password && errors?.password?.message}
          />
          <TouchableOpacity
            onPress={handleForgotNavigation}
            style={styles.forgotBtn}
            activeOpacity={ACTIVE_OPACITY}>
            <CustomText.RegularText customStyle={styles.forgotText}>
              Forgot Password?
            </CustomText.RegularText>
          </TouchableOpacity>
        </View>
      </MainContainer>
      <View style={styles.bottomButtonContainer}>
        <PrimaryButton
          isRightIcon
          title="Sign In"
          onPress={handleSubmit(handleLogin)}
        />
        <SecondaryButton
          leftIcon={() => (
            <Images.FaceIdSVG marginRight={Metrix.HorizontalSize(10)} />
          )}
          title={
            hasKeychainPermission
              ? 'Use Face ID to Sign In'
              : 'Face ID Login (Sign in first)'
          }
          onPress={handleFaceIDLogin}
          disabled={!hasKeychainPermission}
          customStyles={!hasKeychainPermission ? {opacity: 0.6} : {}}
          // onLongPress={
          //   hasKeychainPermission ? handleClearCredentials : undefined
          // }
        />
        {/* {hasKeychainPermission && (
          <CustomText.RegularText customStyle={styles.hintText}>
            Long press to remove Face ID login
          </CustomText.RegularText>
        )} */}
        <SecondaryButton
          leftIcon={() => (
            <Images.BagSVG marginRight={Metrix.HorizontalSize(10)} />
          )}
          title="Register Agency"
          onPress={handleSignup}
        />
        <CustomText.LargeSemiBoldText customStyle={styles.bottomText}>
          {` Ver: ${readableVersion}`}
        </CustomText.LargeSemiBoldText>
      </View>
      <Loader isLoading={loading} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  mainContainerCustomStyle: {
    paddingHorizontal: Metrix.HorizontalSize(0),
    paddingVertical: Metrix.HorizontalSize(0),
  },
  headerContent: {
    paddingHorizontal: Metrix.HorizontalSize(20),
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: Metrix.HorizontalSize(20),
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: Metrix.VerticalSize(5),
    marginBottom: Metrix.VerticalSize(10),
  },
  forgotText: {
    textDecorationLine: 'underline',
  },
  featureText: {
    lineHeight: Metrix.VerticalSize(12),
  },
  welcomeText: {
    fontSize: FontType.FontLarge,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  beyondLogo: {
    width: '40%',
    height: Metrix.VerticalSize(30),
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagIcon: {
    width: Metrix.HorizontalSize(22),
    height: Metrix.VerticalSize(22),
    marginRight: Metrix.HorizontalSize(5),
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
    paddingBottom: Metrix.VerticalSize(25),
  },
  hintText: {
    fontSize: FontType.FontSmall,
    color: Colors.PieChartGray2,
    textAlign: 'center',
    marginTop: Metrix.VerticalSize(5),
    marginBottom: Metrix.VerticalSize(5),
  },
});
