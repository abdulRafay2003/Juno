import React, {useState} from 'react';
import {View, StyleSheet, ImageBackground, Platform} from 'react-native';
import {MainContainer} from '@/components/MainContainer';
import CustomText from '@/components/CustomText';
import {CustomInput} from '@/components/CustomInput';
import {PrimaryButton} from '@/components/PrimaryButton';
import Colors from '@/config/colors';
import Metrix from '@/config/metrix';
import {FontType, Images, NavigationService} from '@/config';
import {RouteNames} from '@/config/routes';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {SignupEmailValidation} from '@/components/Validations';
import {Loader, SecondaryButton} from '@/components';
import {readableVersion} from '@/constants/globalConst';
import {useMutation} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';
import {showToast} from '@/utils/business.helper';
import {dispatchToStore} from '@/redux/store';
import {setAuthPayload} from '@/redux/slice/AuthSlice/authSlice';

export default function Signup({navigation}) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(SignupEmailValidation),
  });

  const mutation = useMutation({
    mutationFn: (body: {email: string}) => APIS?.registerAgency(body),
    onSuccess: data => {
      setLoading(false);
      NavigationService.navigate(RouteNames.AuthRoutes.Success, {
        from: 'signup',
        heading: 'An OTP has been sent to your Email address',
        buttonText: 'Close',
        expiryTime: data?.data?.data?.eat,
      });
    },
    onError: (error: any) => {
      setLoading(false);
      showToast(
        'error',
        'Error',
        error?.response?.data?.message || 'Signup Failed',
      );
    },
  });

  const handleSignup = (values: any) => {
    setLoading(true);
    dispatchToStore(
      setAuthPayload({
        email: values?.email?.toLowerCase(),
      }),
    );
    mutation.mutate({email: values?.email?.toLowerCase()});
  };

  const handleLoginNavigation = () => {
    NavigationService.reset_0(RouteNames.AuthRoutes.Login);
  };

  return (
    <ImageBackground
      resizeMode="stretch"
      source={Images.LoginBackground}
      style={{flex: 1}}>
      <View style={styles.contentContainer}>
        <View style={{paddingTop: Metrix.VerticalSize(25)}}>
          <CustomInput
            heading="Email Address"
            placeholder="e.g. john.doe@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="done"
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
          <PrimaryButton
            isRightIcon
            title="Send OTP"
            onPress={handleSubmit(handleSignup)}
          />
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
