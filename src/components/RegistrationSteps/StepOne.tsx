import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import {CustomInput} from '../CustomInput';
import DropDownPicker from '../DropDownPicker';
import CustomDatePicker from '../CustomDatePicker';
import CustomPhoneInput from '../CustomPhoneInput';
import {LIST_DATA} from '@/constants/dummyData';
import RadioSelection from '../RadioSelection';
import {Metrix} from '@/config';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux/store';
import {
  BooleanDropDownData,
  tradeLicenseCategoryData,
} from '@/constants/globalConst';
import {findConditionStatus} from '@/utils/business.helper';

const StepOne = ({
  errors,
  control,
  watch,
  checkType,
  checkDubaiBased,
  internationRealEstate,
  setValue,
  checknonEstate,
  companyPhoneCountryCode,
  setCompanyPhoneCountryCode,
  heading,
  countryAndCity,
}) => {
  const licenseCategory = watch('tradeLicenseCategory');
  const haveTrnValue = watch('haveTrn');
  const countryValue = watch('country');

  const dropDownData = useSelector(
    (state: RootState) => state?.user?.dropdownData,
  );
  const checkavailibility = () => {
    if (
      heading === 'Real Estate Agency (Dubai Based)' ||
      heading === 'Real Estate Agency (Other Emirates)' ||
      heading === 'Non Real Estate Company'
    ) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <>
      <CustomInput
        fieldName={'companyName'}
        heading="Company Name"
        placeholder="e.g. Roots Heritage"
        containerStyle={styles.inputContainer}
        autoCapitalize="none"
        returnKeyType="next"
        isRequired
        control={control}
        errTxt={errors?.companyName && errors?.companyName?.message}
      />
      {checkType ? (
        <>
          <CustomInput
            fieldName={'registrationNumber'}
            heading="Registration Number"
            containerStyle={styles.inputContainer}
            placeholder="e.g. 96761"
            autoCapitalize="none"
            keyboardType="default"
            returnKeyType="next"
            isRequired
            control={control}
            errTxt={
              errors?.registrationNumber && errors?.registrationNumber?.message
            }
          />
          <CustomDatePicker
            fieldName={'registrationExpiryDate'}
            heading={'Registration Expiry Date'}
            minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // disables today
            placeholder="Select"
            isRequired={checknonEstate}
            control={control}
            errTxt={
              errors?.registrationExpiryDate &&
              errors?.registrationExpiryDate?.message
            }
            style={styles.inputContainer}
          />
        </>
      ) : (
        <>
          <DropDownPicker
            fieldName={'tradeLicenseCategory'}
            heading={'Trade License Category'}
            customMainContainerStyle={styles.inputContainer}
            placeholder={'Select'}
            data={
              checkDubaiBased || checknonEstate
                ? dropDownData?.trade_licence_category
                : dropDownData?.trade_licence_category.filter(
                    item => item.value != 'Freezone',
                  )
            }
            isRequired
            control={control}
            errTxt={
              errors?.tradeLicenseCategory &&
              errors?.tradeLicenseCategory?.message
            }
          />
          <CustomInput
            fieldName={'tradeLicenseNumber'}
            heading="Trade License Number"
            containerStyle={styles.inputContainer}
            placeholder="e.g. 96761"
            autoCapitalize="none"
            keyboardType={'default'}
            returnKeyType="next"
            isRequired
            control={control}
            errTxt={
              errors?.tradeLicenseNumber && errors?.tradeLicenseNumber?.message
            }
          />
          <CustomDatePicker
            fieldName={'tradeLicenseExpiryDate'}
            heading={'Trade License Expiry Date'}
            minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // disables today
            isRequired
            placeholder="Select"
            control={control}
            errTxt={
              errors?.tradeLicenseExpiryDate &&
              errors?.tradeLicenseExpiryDate?.message
            }
            style={styles.inputContainer}
          />
        </>
      )}

      <DropDownPicker
        heading={'Country'}
        customMainContainerStyle={styles.inputContainer}
        isRequired
        // disable={checkavailibility()}
        placeholder={'Select'}
        changeValue={() => setValue('city', '')}
        data={
          countryAndCity
            ? dropDownData?.country?.filter(item => item?.meta?.isUAE !== true)
            : dropDownData?.country?.filter(item => item?.meta?.isUAE === true)
        }
        fieldName={'country'}
        control={control}
        errTxt={errors?.country && errors?.country?.message}
      />

      {countryAndCity ? (
        <CustomInput
          heading="City"
          containerStyle={styles.inputContainer}
          placeholder="Enter city"
          autoCapitalize="none"
          isRequired={internationRealEstate}
          returnKeyType="next"
          fieldName={'city'}
          control={control}
          errTxt={errors?.city && errors?.city?.message}
        />
      ) : (
        <DropDownPicker
          heading={'City'}
          customMainContainerStyle={styles.inputContainer}
          isRequired={internationRealEstate}
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
        heading="Company Phone"
        isRequired
        placeholder="e.g. 4 123 4567"
        errTxt={errors?.companyPhone && errors?.companyPhone?.message}
        control={control}
        fieldName={'companyPhone'}
        value={companyPhoneCountryCode}
        setValue={setCompanyPhoneCountryCode}
        mainContainerStyle={styles.inputContainer}
      />
      <CustomInput
        fieldName={'companyEmail'}
        heading="Company Email"
        placeholder="e.g. roots@beyond.ae"
        autoCapitalize="none"
        returnKeyType="next"
        keyboardType={'email-address'}
        isRequired
        control={control}
        containerStyle={styles.inputContainer}
        errTxt={errors?.companyEmail && errors?.companyEmail?.message}
      />
      <CustomInput
        heading="Address Line 1"
        placeholder="e.g. 26th Floor, One by OMNIYAT"
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
        placeholder="e.g. 26th Floor, One by OMNIYAT"
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
        fieldName={'poBox'}
        containerStyle={styles.inputContainer}
        control={control}
        errTxt={errors?.poBox && errors?.poBox?.message}
      />
      <CustomInput
        heading="Property Consultant"
        placeholder="e.g. Realtor"
        autoCapitalize="none"
        returnKeyType="next"
        fieldName={'propertyConsultant'}
        containerStyle={styles.inputContainer}
        control={control}
        errTxt={
          errors?.propertyConsultant && errors?.propertyConsultant?.message
        }
      />
      {!checkType && (
        <>
          {findConditionStatus(
            licenseCategory,
            dropDownData?.trade_licence_category,
          ) === 'DED' &&
            checkDubaiBased && (
              <>
                <CustomInput
                  heading="Company RERA Number"
                  placeholder="e.g. 47415"
                  autoCapitalize="none"
                  returnKeyType="next"
                  keyboardType="default"
                  isRequired
                  fieldName={'companyReraNumber'}
                  containerStyle={styles.inputContainer}
                  control={control}
                  errTxt={
                    errors?.companyReraNumber &&
                    errors?.companyReraNumber?.message
                  }
                />
                <CustomDatePicker
                  heading={'Company RERA Registration Expiry'}
                  isRequired
                  placeholder="Select"
                  minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // disables today
                  fieldName={'companyReraRegistrationExpiry'}
                  control={control}
                  errTxt={
                    errors?.companyReraRegistrationExpiry &&
                    errors?.companyReraRegistrationExpiry?.message
                  }
                  style={styles.inputContainer}
                />
              </>
            )}
          <DropDownPicker
            heading={'Have TRN'}
            customMainContainerStyle={styles.inputContainer}
            placeholder={'Select'}
            data={BooleanDropDownData}
            fieldName={'haveTrn'}
            isRequired
            control={control}
            errTxt={errors?.haveTrn && errors?.haveTrn?.message}
          />
          {haveTrnValue == 'Yes' && (
            <CustomInput
              heading="TRN Number"
              placeholder="e.g. 555588902634537"
              autoCapitalize="none"
              returnKeyType="next"
              isRequired
              fieldName={'trnNumber'}
              keyboardType="number-pad"
              containerStyle={styles.inputContainer}
              control={control}
              errTxt={errors?.trnNumber && errors?.trnNumber?.message}
            />
          )}
          <RadioSelection
            fieldName="ownership"
            heading="Ownership"
            isRequired
            control={control}
            list={dropDownData?.ownership}
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
  addressContainer: {
    height: Metrix.VerticalSize(50),
  },
});

export default StepOne;
