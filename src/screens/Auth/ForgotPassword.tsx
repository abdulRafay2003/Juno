import React, {useState} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import CustomText from '@/components/CustomText';
import {CustomInput} from '@/components/CustomInput';
import Colors from '@/config/colors';
import Metrix from '@/config/metrix';
import {PrimaryButton} from '@/components/PrimaryButton';
import {MainContainer} from '@/components/MainContainer';
import {FontType, Images, NavigationService} from '@/config';
import {RouteNames} from '@/config/routes';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {ForgotPasswordValidation} from '@/components/Validations';
import {Loader, SecondaryButton} from '@/components';
import {readableVersion} from '@/constants/globalConst';
import {useMutation} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';
import {showToast} from '@/utils/business.helper';

export default function ForgotPassword({navigation}) {
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(ForgotPasswordValidation),
  });

  const mutation = useMutation({
    mutationFn: (body: {email: string}) => APIS?.forgotPassword(body),
    onSuccess: data => {
      setLoading(false);
      NavigationService.navigate(RouteNames.AuthRoutes.Success, {
        from: 'forgotPassword',
        heading: 'A Password Reset Link Has Been Sent To Your Email Address',
        buttonText: 'Close',
      });
    },
    onError: (error: any) => {
      setLoading(false);
      showToast(
        'error',
        'Error',
        error?.response?.data?.message || 'Forgot Password Failed',
      );
    },
  });

  const handleForgotPassword = (values: any) => {
    // setLoading(true);
    mutation.mutate({email: values?.email?.toLowerCase()});
  };

  const handleLoginNavigation = () => {
    NavigationService.reset_0(RouteNames.AuthRoutes.Login);
  };

  return (
    <ImageBackground
      resizeMode="cover"
      source={Images.AuthBackground}
      style={{flex: 1}}>
      <View style={styles.contentContainer}>
        <View style={{paddingTop: Metrix.VerticalSize(63)}}>
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
          <PrimaryButton
            isRightIcon
            title="Reset Password"
            onPress={handleSubmit(handleForgotPassword)}
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
