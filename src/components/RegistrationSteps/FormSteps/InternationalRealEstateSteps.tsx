import React from 'react';
import StepOne from '../StepOne';
import StepTwo from '../StepTwo';
import StepThree from '../StepThree';
import StepFour from '../StepFour';
import {ONBOARDING_CATEGORIES, ONBOARDING_STEPS} from '@/constants/globalConst';
import {APIS} from '@/services/apiMethods';

interface InternationalRealEstateStepsProps {
  selectedSteps: number;
  control: any;
  errors: any;
  watch: any;
  setValue: any;
  bankAvailability: boolean;
  onSubmit: (data: any) => void;
  companyPhoneCountryCode: any;
  setCompanyPhoneCountryCode?: any;
  signatoryPhoneCountryCode?: any;
  setSignatoryPhoneCountryCode?: any;
  setError?: any;
}

const InternationalRealEstateSteps = ({
  selectedSteps,
  control,
  errors,
  watch,
  setValue,
  bankAvailability,
  onSubmit,
  companyPhoneCountryCode,
  setCompanyPhoneCountryCode,
  signatoryPhoneCountryCode,
  setSignatoryPhoneCountryCode,
  setError,
}: InternationalRealEstateStepsProps) => {
  const renderSteps = () => {
    switch (selectedSteps) {
      case 1:
        return (
          <StepOne
            control={control}
            setValue={setValue}
            internationRealEstate={true}
            errors={errors}
            watch={watch}
            checknonEstate={false}
            checkType={true}
            checkDubaiBased={false}
            companyPhoneCountryCode={companyPhoneCountryCode}
            setCompanyPhoneCountryCode={setCompanyPhoneCountryCode}
            countryAndCity={true}
          />
        );
      case 2:
        return (
          <StepTwo
            control={control}
            errors={errors}
            checkDubaiBased={false}
            watch={watch}
            checknonEstate={false}
            checkType={true}
            signatoryPhoneCountryCode={signatoryPhoneCountryCode}
            setSignatoryPhoneCountryCode={setSignatoryPhoneCountryCode}
          />
        );
      case 3:
        return (
          <StepThree
            control={control}
            errors={errors}
            bankAvailability={true}
            checknonEstate={false}
            freelancer={false}
            checkType={true}
            countryAndCity={true}
          />
        );
      case 4:
        return (
          <StepFour
            control={control}
            errors={errors}
            bank={bankAvailability}
            checknonEstate={false}
            checkType={true}
            watch={watch}
            checkDubaiBased={false}
            headerTitle="Real Estate Agency"
            setError={setError}
          />
        );
      default:
        return null;
    }
  };

  return renderSteps();
};

export default InternationalRealEstateSteps;
