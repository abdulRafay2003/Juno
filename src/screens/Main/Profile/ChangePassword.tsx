import { CustomInput, Loader, PrimaryButton } from '@/components';
import CustomText from '@/components/CustomText';
import { MainContainer } from '@/components/MainContainer';
import { Colors, FontType, Metrix, NavigationService } from '@/config';
import { RouteNames } from '@/config/routes';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup/src/yup';
import {
  ChangePasswordValidation,
  SetPasswordValidation,
} from '@/components/Validations';
import { useMutation } from '@tanstack/react-query';
import { APIS } from '@/services/apiMethods';
import { showToast } from '@/utils/business.helper';

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(ChangePasswordValidation),
  });

  const handleChangePassword = values => {
    setLoading(true);
    const body = {
      old_password: values?.oldPassword,
      new_password: values?.confirmPassword,
    };
    mutation.mutate(body);
  };

  const mutation = useMutation({
    mutationFn: (body: { old_password: string; new_password: string }) =>
      APIS.changePassword(body),
    onSuccess: data => {
      setLoading(false);
      NavigationService.navigate(RouteNames.HomeRoutes.Success, {
        from: 'changePassword',
        heading: 'Password Updated Successfully.',
        buttonText: 'Close',
        headingStyle: { width: '60%' },
      });
    },
    onError: (error: any) => {
      setLoading(false);
      showToast(
        'error',
        'Error',
        error?.response?.data?.message || 'Login Failed',
      );
    },
  });

  return (
    <MainContainer
      customeStyle={{ flex: 1 }}
      isHeader
      isFlatList
      heading="Change Password">
      <View style={styles.cardContainer}>
        <CustomInput
          heading="Old Password"
          placeholder="e.g. yourpassword123"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry={!showPassword}
          isRequired
          eye
          hidepswdState={!showPassword}
          onEyePress={() => setShowPassword(prev => !prev)}
          returnKeyType="done"
          fieldName={'oldPassword'}
          control={control}
          errTxt={errors?.oldPassword && errors?.oldPassword?.message}
        />
        <CustomInput
          heading="New Password"
          placeholder="e.g. yourpassword123"
          value={newPassword}
          onChangeText={setNewPassword}
          autoCapitalize="none"
          secureTextEntry={!showNewPassword}
          isRequired
          eye
          hidepswdState={!showNewPassword}
          onEyePress={() => setShowNewPassword(prev => !prev)}
          returnKeyType="done"
          mainContainerStyle={styles.inputContainer}
          fieldName={'newPassword'}
          control={control}
          errTxt={errors?.newPassword && errors?.newPassword?.message}
        />
        <CustomInput
          heading="Confirm Password"
          placeholder="e.g. yourpassword123"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          autoCapitalize="none"
          secureTextEntry={!showConfirmPassword}
          isRequired
          eye
          hidepswdState={!showConfirmPassword}
          onEyePress={() => setShowConfirmPassword(prev => !prev)}
          returnKeyType="done"
          mainContainerStyle={styles.inputContainer}
          fieldName={'confirmPassword'}
          control={control}
          errTxt={errors?.confirmPassword && errors?.confirmPassword?.message}
        />
        <CustomText.RegularText customStyle={styles.passwordText}>
          Your password must be more than 8 characters long, should contain at
          least 1 uppercase character, 1 lowercase character, 1 numeric
          character and 1 special character.
        </CustomText.RegularText>
      </View>
      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Update"
          onPress={handleSubmit(handleChangePassword)}
        />
      </View>
      <Loader isLoading={loading} />
    </MainContainer>
  );
};
const styles = StyleSheet.create({
  passwordText: {
    marginTop: Metrix.VerticalSize(20),
    fontSize: FontType.FontSmall,
  },
  cardContainer: {
    backgroundColor: Colors.White,
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    borderRadius: Metrix.Radius,
    paddingVertical: Metrix.VerticalSize(15),
    paddingHorizontal: Metrix.HorizontalSize(20),
    marginTop: Metrix.VerticalSize(20),
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  inputContainer: {
    marginVertical: Metrix.HorizontalSize(0),
  },
});

export default ChangePassword;
