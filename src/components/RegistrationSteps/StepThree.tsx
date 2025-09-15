import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import DropDownPicker from '../DropDownPicker';
import {CustomInput} from '../CustomInput';
import {Metrix} from '@/config';
import {bankCountryData, countries} from '@/constants/dummyData';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux/store';

const StepThree = ({
  errors,
  control,
  bankAvailability,
  checkType,
  checknonEstate,
  freelancer,
  countryAndCity,
}) => {
  const dropDownData = useSelector(
    (state: RootState) => state?.user?.dropdownData,
  );
  return (
    <>
      <DropDownPicker
        heading={'Bank Country'}
        customMainContainerStyle={styles.inputContainer}
        isRequired={bankAvailability}
        placeholder={'Select'}
        disable={!bankAvailability}
        data={dropDownData?.country}
        fieldName={'bankCountry'}
        control={control}
        errTxt={errors?.bankCountry && errors?.bankCountry?.message}
      />
      {bankAvailability && !checkType && checknonEstate ? (
        <CustomInput
          heading="Bank Name"
          placeholder="e.g. Commercial Bank of Dubai"
          containerStyle={styles.inputContainer}
          autoCapitalize="none"
          returnKeyType="next"
          isRequired={false}
          fieldName={'bankName'}
          editable={bankAvailability}
          control={control}
          errTxt={errors?.bankName && errors?.bankName?.message}
        />
      ) : (
        <CustomInput
          heading="Bank Name"
          placeholder="e.g. Commercial Bank of Dubai"
          containerStyle={styles.inputContainer}
          autoCapitalize="none"
          returnKeyType="next"
          isRequired={bankAvailability}
          fieldName={'bankName'}
          editable={bankAvailability}
          control={control}
          errTxt={errors?.bankName && errors?.bankName?.message}
        />
      )}

      <CustomInput
        heading="Bank Account Number"
        containerStyle={styles.inputContainer}
        placeholder="e.g. 13651605116"
        autoCapitalize="none"
        keyboardType="default"
        returnKeyType="next"
        editable={bankAvailability}
        isRequired={bankAvailability}
        fieldName={'bankAccountNumber'}
        control={control}
        errTxt={errors?.bankAccountNumber && errors?.bankAccountNumber?.message}
      />

      <CustomInput
        heading="Beneficiary Name"
        placeholder="e.g. Evans"
        autoCapitalize="none"
        editable={bankAvailability}
        returnKeyType="next"
        isRequired={bankAvailability}
        fieldName={'beneficiaryName'}
        control={control}
        containerStyle={styles.inputContainer}
        errTxt={errors?.beneficiaryName && errors?.beneficiaryName?.message}
      />
      <CustomInput
        heading={
          checkType ? 'IBAN Number' : freelancer ? 'IBAN Number' : 'IBAN Number'
        }
        placeholder="e.g. AE07 0331 2345 6789 0123 456"
        autoCapitalize="none"
        returnKeyType="next"
        editable={bankAvailability}
        isRequired={bankAvailability}
        fieldName={'ibanNumber'}
        control={control}
        containerStyle={styles.inputContainer}
        errTxt={errors?.ibanNumber && errors?.ibanNumber?.message}
      />
      <CustomInput
        heading="Swift Code"
        placeholder="e.g. TESTAA00"
        autoCapitalize="none"
        returnKeyType="next"
        isRequired={bankAvailability && !checkType}
        fieldName={'swiftCode'}
        editable={bankAvailability}
        containerStyle={styles.inputContainer}
        control={control}
        errTxt={errors?.swiftCode && errors?.swiftCode?.message}
      />
      <DropDownPicker
        heading={'Currency'}
        customMainContainerStyle={styles.inputContainer}
        isRequired={bankAvailability}
        placeholder={'e.g. AED'}
        disable={!bankAvailability}
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
        editable={bankAvailability}
        fieldName={'bankBranchName'}
        containerStyle={styles.inputContainer}
        control={control}
        errTxt={errors?.bankBranchName && errors?.bankBranchName?.message}
      />
      <CustomInput
        heading="Bank Address"
        placeholder="e.g. Al Mankhool St. Opp. Al Khaleej Center"
        autoCapitalize="none"
        returnKeyType="next"
        isRequired={bankAvailability}
        editable={bankAvailability}
        customStyle={{textAlignVertical: 'top'}}
        fieldName={'bankAddress'}
        containerStyle={styles.inputContainer}
        control={control}
        errTxt={errors?.bankAddress && errors?.bankAddress?.message}
      />
    </>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    // marginTop: Metrix.VerticalSize(20),
  },
});

export default StepThree;
