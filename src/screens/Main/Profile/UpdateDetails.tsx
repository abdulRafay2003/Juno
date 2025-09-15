import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Colors, Metrix, NavigationService} from '@/config';
import {bankCountryData, countries} from '@/constants/dummyData';
import {
  CustomInput,
  CustomText,
  DropDownPicker,
  MainContainer,
  PrimaryButton,
} from '@/components';
import {useForm} from 'react-hook-form';
import UploadDocument from '@/components/UploadDocument';
import {yupResolver} from '@hookform/resolvers/yup';
import {BankDetailsValidation} from '@/components/Validations';
import {useSelector} from 'react-redux';
import {dispatchToStore, RootState} from '@/redux/store';
import {useMutation} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';
import {showToast} from '@/utils/business.helper';
import {setUserDetail} from '@/redux/slice/UserSlice/userSlice';

const UpdateDetails = () => {
  const [loading, setLoading] = useState(false);

  const details = useSelector(
    (state: RootState) => state.user.userDetail?.agency?.bank,
  );
  const category = useSelector(
    (state: RootState) => state.user.userDetail?.agency?.company.category,
  );

  const dropDownData = useSelector(
    (state: RootState) => state?.user?.dropdownData,
  );
  const mandatory =
    category == 'Real Estate Agency (Dubai Based)' ||
    category == 'Real Estate Agency (Other Emirates)'
      ? true
      : false;

  useEffect(() => {
    setValue('currency', details?.currency);
    setValue('bankCountry', details?.country);
  }, []);

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    trigger,
    formState: {errors},
  } = useForm({
    defaultValues: {
      bankName: details?.name,
      bankAccountNumber: details?.account_number,
      bankCountry: dropDownData?.country?.find(
        item => item?.key == details?.country,
      )?.id,
      beneficiaryName: details?.beneficiary_name,
      swiftCode: details?.swift_code,
      ibanNumber: details?.iban,
      bankBranchName: details?.branch_name,
      bankAddress: details?.address,
      currency: details?.currency,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    context: {
      bankNameMandatory: mandatory,
    },
    resolver: yupResolver(BankDetailsValidation),
  });

  const findDropdownIdByValue = (data: any[], displayValue: string) => {
    const option = data?.find(
      item =>
        item.value === displayValue ||
        item.id === displayValue ||
        item.label === displayValue,
    );

    return option?.id || option?.value;
  };

  const getProfile = useMutation({
    mutationFn: () => APIS.getProfileDetails(),
    onSuccess: resp => {
      dispatchToStore(setUserDetail(resp.data.data.details));
      setLoading(false);
      showToast('success', 'Bank Details', 'Details Updated Successfully');
      setTimeout(() => {
        setLoading(false);
        NavigationService.goBack();
      }, 1000);
    },
    onError: error => {},
  });

  const mutation = useMutation({
    mutationFn: (body: FormData) => APIS?.updateBankDetails(body),
    onSuccess: data => {
      getProfile.mutate();
    },
    onError: (error: any) => {
      setLoading(false);
      showToast(
        'error',
        'Error',
        error?.response?.data?.message || 'Update Failed',
      );
    },
  });

  function transformBankDetails(input) {
    const formData = new FormData();

    // Map camelCase input to snake_case output
    const mapping = {
      bankName: 'bank_name',
      bankAccountNumber: 'bank_account_number',
      bankCountry: 'bank_country_id',
      beneficiaryName: 'beneficiary_name',
      ibanNumber: 'iban',
      swiftCode: 'swift_code',
      currency: 'bank_currency_id',
      bankBranchName: 'branch_name',
      bankAddress: 'bank_address',
    };

    // Apply mapped fields
    for (const [camelKey, snakeKey] of Object.entries(mapping)) {
      if (input[camelKey]) {
        if (camelKey === 'bankCountry') {
          formData.append(
            snakeKey,
            findDropdownIdByValue(dropDownData?.country, input[camelKey]),
          );
        } else if (camelKey === 'currency') {
          formData.append(
            snakeKey,
            findDropdownIdByValue(dropDownData?.currency, input[camelKey]),
          );
        } else {
          formData.append(snakeKey, input[camelKey]);
        }
      }
    }

    // Add file (bankDocuments)
    if (input.bankDocuments && input.bankDocuments.uri) {
      const file = {
        uri: input.bankDocuments.uri,
        name: input.bankDocuments.name || 'document.jpg',
        type: input.bankDocuments.type || 'image/jpeg',
      };
      formData.append('file', file);
    }

    return formData;
  }

  const onSubmit = data => {
    setLoading(true);
    mutation.mutate(transformBankDetails(data));
  };

  return (
    <MainContainer isFlatList isHeader heading="Update Details">
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{paddingBottom: Metrix.VerticalSize(50)}}>
        <View style={styles.cardContainer}>
          <CustomText.LargeBoldText>Bank Information</CustomText.LargeBoldText>
          <CustomInput
            heading="Bank Name"
            placeholder="e.g. Commercial Bank of Dubai"
            autoCapitalize="none"
            returnKeyType="next"
            isRequired={mandatory}
            fieldName={'bankName'}
            control={control}
            errTxt={errors?.bankName && errors?.bankName?.message}
          />

          <CustomInput
            heading="Bank Account Number"
            keyboardType="default"
            placeholder="e.g. 13651605116"
            autoCapitalize="none"
            returnKeyType="next"
            isRequired
            fieldName={'bankAccountNumber'}
            control={control}
            errTxt={
              errors?.bankAccountNumber && errors?.bankAccountNumber?.message
            }
          />
          <DropDownPicker
            heading={'Bank Country'}
            customMain
            isRequired
            placeholder={'Select'}
            data={dropDownData?.country}
            fieldName={'bankCountry'}
            control={control}
            errTxt={errors?.bankCountry && errors?.bankCountry?.message}
          />

          <CustomInput
            heading="Beneficiary Name"
            placeholder="e.g. Evans"
            autoCapitalize="none"
            returnKeyType="next"
            isRequired
            fieldName={'beneficiaryName'}
            control={control}
            errTxt={errors?.beneficiaryName && errors?.beneficiaryName?.message}
          />
          <CustomInput
            heading="IBAN Number"
            placeholder="e.g. AE07 0331 2345 6789 0123 456"
            autoCapitalize="none"
            returnKeyType="next"
            isRequired
            fieldName={'ibanNumber'}
            control={control}
            errTxt={errors?.ibanNumber && errors?.ibanNumber?.message}
          />

          <CustomInput
            heading="Swift Code"
            placeholder="e.g. TESTAA00"
            autoCapitalize="none"
            returnKeyType="next"
            isRequired
            fieldName={'swiftCode'}
            control={control}
            errTxt={errors?.swiftCode && errors?.swiftCode?.message}
          />
          <DropDownPicker
            heading={'Currency'}
            customMain
            isRequired
            placeholder={'Select'}
            data={dropDownData?.currency}
            fieldName={'currency'}
            control={control}
            errTxt={errors?.currency && errors?.currency?.message}
          />
          <CustomInput
            heading="Bank Branch Name"
            placeholder="e.g. Bur Dubai Branch"
            autoCapitalize="none"
            returnKeyType="next"
            fieldName={'bankBranchName'}
            control={control}
            errTxt={errors?.bankBranchName && errors?.bankBranchName?.message}
          />
          <CustomInput
            heading="Bank Address"
            placeholder="e.g. Al Mankhool St. Opp. Al Khaleej Center"
            autoCapitalize="none"
            returnKeyType="next"
            isRequired
            multiline={true}
            numberOfLines={2}
            customStyle={{textAlignVertical: 'top'}}
            mainContainerStyle={styles.addressContainer}
            fieldName={'bankAddress'}
            control={control}
            errTxt={errors?.bankAddress && errors?.bankAddress?.message}
          />
          <View style={styles.bankcardContainer}>
            <UploadDocument
              fieldName="bankDocuments"
              control={control}
              customStyle={styles.documentContainer}
              errTxt={errors?.bankDocuments && errors?.bankDocuments?.message}
              heading="IBAN Letter / Bank Welcome Letter"
              isRequired
            />
          </View>
          <PrimaryButton
            title="Update Details"
            customStyles={styles.btn}
            isLoading={loading}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>
    </MainContainer>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    marginTop: Metrix.VerticalSize(20),
  },
  btn: {
    marginTop: Metrix.VerticalSize(20),
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
  bankcardContainer: {
    backgroundColor: Colors.White,
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    borderRadius: Metrix.Radius,
    marginVertical: Metrix.VerticalSize(10),
    paddingVertical: Metrix.VerticalSize(12),
    paddingHorizontal: Metrix.HorizontalSize(20),
  },
  documentContainer: {
    paddingTop: Metrix.HorizontalSize(0),
  },
  addressContainer: {
    height: Metrix.VerticalSize(50),
  },
});

export default UpdateDetails;
