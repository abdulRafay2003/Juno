import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {MainContainer} from '@/components/MainContainer';
import {CustomInput} from '@/components/CustomInput';
import {PrimaryButton} from '@/components/PrimaryButton';
import Images from '@/config/images';
import Colors from '@/config/colors';
import Metrix from '@/config/metrix';
import {dispatchToStore, RootState} from '@/redux/store';
import {NavigationService} from '@/config';
import {useForm} from 'react-hook-form';
import {useMutation} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';
import {showToast} from '@/utils/business.helper';
import {useSelector} from 'react-redux';
import * as Keychain from 'react-native-keychain';
import {Loader} from '@/components';
import {setFaceIdCredentials} from '@/redux/slice/AuthSlice/authSlice';
import {yupResolver} from '@hookform/resolvers/yup';
import {FaceIdValidation} from '@/components/Validations';

interface loginBody {
  email: string;
  password: string;
  fcm_token: string;
}

export default function FaceIdCredentials({navigation}) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const fcmToken = useSelector((state: RootState) => state?.user.fcm);
  const email = useSelector(
    (state: RootState) => state?.user.userDetail?.agent?.email,
  );

  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: email,
    },
    resolver: yupResolver(FaceIdValidation),
  });

  const handleSaveCredentials = values => {
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
      setLoading(false);
      await Keychain.setGenericPassword(variables?.email, variables?.password);
      dispatchToStore(
        setFaceIdCredentials({
          email: variables?.email,
          password: variables?.password,
        }),
      );
      showToast('success', 'Success', 'Credentials saved for Face ID login');
      NavigationService.goBack();
    },
    onError: (error: any) => {
      setLoading(false);
    },
  });

  return (
    <MainContainer
      heading="Save Credentials"
      isHeader
      mainContainerStyle={{backgroundColor: Colors.Transparent}}>
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
          editable={false}
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
      </View>
      <PrimaryButton
        title="Save Credentials"
        onPress={handleSubmit(handleSaveCredentials)}
      />
      <Loader isLoading={loading} />
    </MainContainer>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingVertical: Metrix.VerticalSize(20),
  },
});
