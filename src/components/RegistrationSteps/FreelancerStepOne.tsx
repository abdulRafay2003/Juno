import React from 'react';
import {StyleSheet} from 'react-native';
import {CustomInput} from '../CustomInput';
import CustomDatePicker from '../CustomDatePicker';
import CustomPhoneInput from '../CustomPhoneInput';
import DropDownPicker from '../DropDownPicker';
import {countries} from '@/constants/dummyData';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux/store';
import {EmiratesInput} from '../CustomInput/EmiratesInput';

const FreelancerStepOne = ({
  errors,
  control,
  watch,
  checkType,
  setValue,
  mobileCountryCode,
  setMobileCountryCode,
  heading,
  countryAndCity,
}) => {
  const dropDownData = useSelector(
    (state: RootState) => state?.user?.dropdownData,
  );
  const checkavailibility = () => {
    if (heading === 'UAE Freelancer') {
      return true;
    } else {
      return false;
    }
  };
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
      <DropDownPicker
        heading={'Country'}
        customMainContainerStyle={styles.inputContainer}
        isRequired
        placeholder={'Select'}
        // disable={checkavailibility()}
        data={
          countryAndCity
            ? dropDownData?.country?.filter(item => item?.meta?.isUAE !== true)
            : dropDownData?.country
        }
        fieldName={'country'}
        changeValue={() => setValue('city', '')}
        control={control}
        errTxt={errors?.country && errors?.country?.message}
      />

      {countryAndCity ? (
        <CustomInput
          heading="City"
          containerStyle={styles.inputContainer}
          placeholder="Enter city"
          autoCapitalize="none"
          isRequired
          returnKeyType="next"
          fieldName={'city'}
          control={control}
          errTxt={errors?.city && errors?.city?.message}
        />
      ) : (
        <DropDownPicker
          heading={'City'}
          customMainContainerStyle={styles.inputContainer}
          isRequired
          placeholder={'Select'}
          data={
            dropDownData?.uae_city
            //   dropDownData?.uae_city?.filter(
            //   item => item?.meta?.isOther !== true,
            // )
          }
          fieldName={'city'}
          control={control}
          errTxt={errors?.city && errors?.city?.message}
        />
      )}

      <CustomPhoneInput
        heading="Signatory Mobile"
        isRequired
        placeholder="e.g.  4 123 4567"
        fieldName={'signatoryMobile'}
        errTxt={errors?.signatoryMobile && errors?.signatoryMobile?.message}
        control={control}
        mainContainerStyle={styles.inputContainer}
        setValue={setMobileCountryCode}
        value={mobileCountryCode}
      />
      <CustomInput
        heading="Signatory Email"
        placeholder="e.g. evans@gmail.com"
        autoCapitalize="none"
        returnKeyType="next"
        keyboardType={'email-address'}
        editable={false}
        isRequired
        fieldName={'signatoryEmail'}
        containerStyle={styles.inputContainer}
        control={control}
        errTxt={errors?.signatoryEmail && errors?.signatoryEmail?.message}
      />
      {!checkType ? (
        <>
          <EmiratesInput
            heading="Emirates ID Number"
            placeholder="e.g. 123-1234-1234567-1"
            autoCapitalize="none"
            returnKeyType="next"
            keyboardType="numeric"
            fieldName={'emiratesIdNum'}
            containerStyle={styles.inputContainer}
            isRequired={!checkType}
            control={control}
            errTxt={errors?.emiratesIdNum && errors?.emiratesIdNum?.message}
          />
          <CustomDatePicker
            heading={'Emirates ID Expiry Date'}
            minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // disables today
            placeholder="Select"
            fieldName={'eidExpiryDate'}
            isRequired={!checkType}
            control={control}
            errTxt={errors?.eidExpiryDate && errors?.eidExpiryDate?.message}
            style={styles.inputContainer}
          />
        </>
      ) : (
        <>
          <CustomInput
            heading="National ID Number"
            placeholder="e.g. 6515161506"
            autoCapitalize="none"
            returnKeyType="next"
            keyboardType="default"
            fieldName={'nationalIdNumber'}
            containerStyle={styles.inputContainer}
            control={control}
            errTxt={
              errors?.nationalIdNumber && errors?.nationalIdNumber?.message
            }
          />
          <CustomDatePicker
            heading={'National ID Expiry Date'}
            minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // disables today
            placeholder="Select"
            fieldName={'nationalExpiryDate'}
            control={control}
            errTxt={
              errors?.nationalExpiryDate && errors?.nationalExpiryDate?.message
            }
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
        returnKeyType="next"
        fieldName={'passportIssuePlace'}
        containerStyle={styles.inputContainer}
        control={control}
        isRequired
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
      <CustomInput
        heading="Address Line 1"
        placeholder="e.g. 26th Floor, OMNIYAT Business Bay"
        autoCapitalize="none"
        returnKeyType="next"
        isRequired
        fieldName={'addressLine1'}
        containerStyle={styles.inputContainer}
        multiline={true}
        control={control}
        errTxt={errors?.addressLine1 && errors?.addressLine1?.message}
      />

      <CustomInput
        heading="Address Line 2"
        placeholder="e.g. 26th Floor, OMNIYAT Business Bay"
        autoCapitalize="none"
        returnKeyType="next"
        fieldName={'addressLine2'}
        containerStyle={styles.inputContainer}
        multiline={true}
        control={control}
        errTxt={errors?.addressLine2 && errors?.addressLine2?.message}
      />
      <CustomInput
        heading="P.O. Box"
        placeholder="e.g. 555588"
        autoCapitalize="none"
        returnKeyType="next"
        isRequired
        fieldName={'poBox'}
        containerStyle={styles.inputContainer}
        control={control}
        errTxt={errors?.poBox && errors?.poBox?.message}
      />
    </>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    // marginTop: Metrix.VerticalSize(20),
  },
});

export default FreelancerStepOne;
