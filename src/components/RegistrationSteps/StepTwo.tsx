import React from 'react';
import {StyleSheet} from 'react-native';
import {CustomInput} from '../CustomInput';
import CustomDatePicker from '../CustomDatePicker';
import CustomPhoneInput from '../CustomPhoneInput';
import {Metrix} from '@/config';
import DropDownPicker from '../DropDownPicker';
import {roleData} from '@/constants/dummyData';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux/store';
import {findConditionStatus} from '@/utils/business.helper';
import {EmiratesInput} from '../CustomInput/EmiratesInput';

const StepTwo = ({
  errors,
  control,
  watch,
  checkDubaiBased,
  checkType,
  checknonEstate,
  signatoryPhoneCountryCode,
  setSignatoryPhoneCountryCode,
}) => {
  const licenseCategory = watch('tradeLicenseCategory');
  const dropDownData = useSelector(
    (state: RootState) => state?.user?.dropdownData,
  );

  return (
    <>
      <CustomInput
        heading="First Name"
        placeholder="e.g. Muhammad"
        containerStyle={styles.inputContainer}
        autoCapitalize="none"
        returnKeyType="next"
        isRequired
        fieldName={'firstName'}
        control={control}
        errTxt={errors?.firstName && errors?.firstName?.message}
      />
      <CustomInput
        heading="Last Name"
        containerStyle={styles.inputContainer}
        placeholder="e.g. Evans"
        autoCapitalize="none"
        returnKeyType="next"
        isRequired
        fieldName={'lastName'}
        control={control}
        errTxt={errors?.lastName && errors?.lastName?.message}
      />
      {checkType ? (
        <>
          <CustomInput
            heading="National ID Number"
            placeholder="e.g. 6515161506"
            containerStyle={styles.inputContainer}
            autoCapitalize="none"
            keyboardType="default"
            returnKeyType="next"
            fieldName={'nationalIdNumber'}
            control={control}
            errTxt={
              errors?.nationalIdNumber && errors?.nationalIdNumber?.message
            }
          />
          <CustomDatePicker
            heading={'National ID Expiry Date'}
            placeholder="Select"
            minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // disables today
            fieldName={'nationalExpiryDate'}
            control={control}
            style={styles.inputContainer}
            errTxt={
              errors?.nationalExpiryDate && errors?.nationalExpiryDate?.message
            }
          />
        </>
      ) : (
        <>
          <EmiratesInput
            heading="Emirates ID Number"
            placeholder="e.g. 123-1234-1234567-1"
            autoCapitalize="none"
            returnKeyType="next"
            isRequired
            fieldName={'emiratesIdNum'}
            keyboardType="numeric"
            control={control}
            containerStyle={styles.inputContainer}
            errTxt={errors?.emiratesIdNum && errors?.emiratesIdNum?.message}
          />
          <CustomDatePicker
            heading={'Emirates ID Expiry Date'}
            minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // disables today
            isRequired
            placeholder="Select"
            fieldName={'eidExpiryDate'}
            control={control}
            errTxt={errors?.eidExpiryDate && errors?.eidExpiryDate?.message}
            style={styles.inputContainer}
          />
        </>
      )}

      <CustomInput
        heading="Passport No"
        placeholder="e.g. AEP6316516160"
        autoCapitalize="none"
        returnKeyType="next"
        isRequired
        fieldName={'passportNumber'}
        containerStyle={styles.inputContainer}
        control={control}
        errTxt={errors?.passportNumber && errors?.passportNumber?.message}
      />

      <CustomInput
        heading="Passport Issue Place"
        placeholder="e.g. United Arab Emirates"
        autoCapitalize="none"
        isRequired
        returnKeyType="next"
        fieldName={'passportIssuePlace'}
        containerStyle={styles.inputContainer}
        control={control}
        errTxt={
          errors?.passportIssuePlace && errors?.passportIssuePlace?.message
        }
      />
      <CustomDatePicker
        heading={'Passport Expiry Date'}
        minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // disables today
        isRequired
        placeholder="Select"
        fieldName={'passportExpiryDate'}
        control={control}
        errTxt={
          errors?.passportExpiryDate && errors?.passportExpiryDate?.message
        }
        style={styles.inputContainer}
      />
      <CustomPhoneInput
        heading="Signatory Mobile"
        isRequired
        placeholder="e.g. 4 123 4567"
        fieldName={'signatoryMobile'}
        errTxt={errors?.signatoryMobile && errors?.signatoryMobile?.message}
        control={control}
        mainContainerStyle={styles.inputContainer}
        value={signatoryPhoneCountryCode}
        setValue={setSignatoryPhoneCountryCode}
      />

      <CustomInput
        heading="Signatory Email"
        placeholder="e.g. evans@beyond.ae"
        autoCapitalize="none"
        returnKeyType="next"
        keyboardType={'email-address'}
        isRequired
        editable={false}
        fieldName={'signatoryEmail'}
        containerStyle={styles.inputContainer}
        control={control}
        errTxt={errors?.signatoryEmail && errors?.signatoryEmail?.message}
        onChangeText={undefined}
      />
      <DropDownPicker
        heading={'Role'}
        customMainContainerStyle={styles.inputContainer}
        isRequired
        placeholder={'Select'}
        data={dropDownData?.role}
        fieldName={'role'}
        control={control}
        errTxt={errors?.role && errors?.role?.message}
      />
      <CustomInput
        heading="Designation"
        placeholder="e.g. Manager"
        autoCapitalize="none"
        returnKeyType="next"
        isRequired
        fieldName={'designation'}
        containerStyle={styles.inputContainer}
        control={control}
        errTxt={errors?.designation && errors?.designation?.message}
      />
      {checkDubaiBased &&
        findConditionStatus(
          licenseCategory,
          dropDownData?.trade_licence_category,
        ) == 'DED' && (
          <>
            <CustomInput
              heading="Broker RERA Number"
              placeholder="e.g. 51165"
              autoCapitalize="none"
              returnKeyType="next"
              keyboardType="default"
              isRequired
              fieldName={'brokenReraNumber'}
              containerStyle={styles.inputContainer}
              control={control}
              errTxt={
                errors?.brokenReraNumber && errors?.brokenReraNumber?.message
              }
            />
            <CustomDatePicker
              heading={'RERA Registration Expiry Date'}
              minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // disables today
              isRequired
              placeholder="Select"
              fieldName={'reraRegistrationExpiryDate'}
              control={control}
              errTxt={
                errors?.reraRegistrationExpiryDate &&
                errors?.reraRegistrationExpiryDate?.message
              }
              style={styles.inputContainer}
            />
          </>
        )}
    </>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    // marginTop: Metrix.VerticalSize(20),
  },
});

export default StepTwo;
