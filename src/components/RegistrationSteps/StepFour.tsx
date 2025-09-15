import React from 'react';
import UploadDocument from '../UploadDocument';
import {Metrix} from '@/config';
import {t} from 'i18next';
import {findConditionStatus} from '@/utils/business.helper';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux/store';

type StepFourTypes = {
  errors: any;
  control: any;
  freelancer?: boolean;
  bank?: boolean;
  watch: (field: string) => any;
  checkDubaiBased?: boolean;
  checkType?: boolean;
  checknonEstate?: boolean;
  headerTitle?: string;
  setError?: any;
};

const StepFour = ({
  errors,
  control,
  bank,
  watch,
  checkDubaiBased,
  checkType,
  checknonEstate,
  headerTitle,
  setError,
}: StepFourTypes) => {
  const trnValue = watch('haveTrn');
  const licenseCategory = watch('tradeLicenseCategory');
  const dropDownData = useSelector(
    (state: RootState) => state?.user?.dropdownData,
  );

  const findDropdownOptionById = (data: any[], id: string) => {
    return data?.find(item => item.id === id || item.value === id);
  };
  const ownershipOption = findDropdownOptionById(
    dropDownData?.ownership,
    watch('ownership'),
  );
  const isPartnership = ownershipOption?.meta?.isPartnership;
  const renderNonInternationalDubaiBased = () => {
    return (
      <>
        {checkDubaiBased && (
          <UploadDocument
            fieldName="validTradeLicense"
            control={control}
            setError={setError}
            customStyle={{paddingTop: Metrix.VerticalSize(0)}}
            errTxt={
              errors?.validTradeLicense && errors?.validTradeLicense?.message
            }
            isRequired
            heading={'Valid Trade License'}
          />
        )}
        {!checkDubaiBased && (
          <UploadDocument
            customStyle={{paddingTop: Metrix.VerticalSize(0)}}
            fieldName="commercialLicense"
            control={control}
            setError={setError}
            errTxt={
              errors?.commercialLicense && errors?.commercialLicense?.message
            }
            isRequired
            heading={'Business / Commercial License'}
          />
        )}

        <UploadDocument
          customStyle={{paddingTop: Metrix.VerticalSize(0)}}
          fieldName="passportCopy"
          control={control}
          errTxt={errors?.passportCopy && errors?.passportCopy?.message}
          isRequired
          setError={setError}
          heading="Signatory Passport Copy"
        />
        {findConditionStatus(
          licenseCategory,
          dropDownData?.trade_licence_category,
        )?.toLowerCase() !== 'freezone' &&
          !checknonEstate && (
            <>
              <UploadDocument
                customStyle={{paddingTop: Metrix.VerticalSize(0)}}
                fieldName="reraCertificate"
                control={control}
                setError={setError}
                errTxt={
                  errors?.reraCertificate && errors?.reraCertificate?.message
                }
                isRequired
                heading="Company RERA Certificate"
              />
              <UploadDocument
                customStyle={{paddingTop: Metrix.VerticalSize(0)}}
                fieldName="brokerCard"
                errTxt={errors?.brokerCard && errors?.brokerCard?.message}
                control={control}
                setError={setError}
                isRequired
                heading="RERA Broker Card"
              />
            </>
          )}
        <UploadDocument
          customStyle={{paddingTop: Metrix.VerticalSize(0)}}
          fieldName="visaCopy"
          control={control}
          setError={setError}
          isRequired={false}
          optionalText="(optional)"
          heading="Signatory Visa Copy"
        />
        <UploadDocument
          customStyle={{paddingTop: Metrix.VerticalSize(0)}}
          control={control}
          fieldName="emiratesIdCopy"
          setError={setError}
          errTxt={errors?.emiratesIdCopy && errors?.emiratesIdCopy?.message}
          isRequired
          heading="Emirates ID Copy of Signatory"
        />
        {trnValue === 'No' && headerTitle != 'Non Real Estate Company' && (
          <UploadDocument
            customStyle={{paddingTop: Metrix.VerticalSize(0)}}
            fieldName="nonVatDisclosure"
            isRequired
            setError={setError}
            control={control}
            heading="Non VAT Disclosure"
            errTxt={
              errors?.nonVatDisclosure && errors?.nonVatDisclosure?.message
            }
          />
        )}
        {trnValue === 'Yes' && headerTitle != 'Non Real Estate Company' && (
          <UploadDocument
            customStyle={{paddingTop: Metrix.VerticalSize(0)}}
            isRequired
            setError={setError}
            control={control}
            fieldName="vatCertificate"
            errTxt={errors?.vatCertificate && errors?.vatCertificate?.message}
            heading="VAT Certificate"
          />
        )}
        {checknonEstate && (
          <UploadDocument
            customStyle={{paddingTop: Metrix.VerticalSize(0)}}
            isRequired
            setError={setError}
            fieldName="bankAccountStamp"
            control={control}
            errTxt={
              errors?.bankAccountStamp && errors?.bankAccountStamp?.message
            }
            heading="Bank Account Details with Signature & Stamp"
          />
        )}
        {isPartnership && (
          <UploadDocument
            customStyle={{paddingTop: Metrix.VerticalSize(0)}}
            isRequired={false}
            optionalText={isPartnership ? '(optional)' : ''}
            fieldName="poaMoa"
            setError={setError}
            control={control}
            errTxt={errors?.poaMoa && errors?.poaMoa?.message}
            heading="POA (Power of Attorney) & MOA (Memorandum of Agreement)"
          />
        )}

        {bank && (
          <UploadDocument
            customStyle={{paddingTop: Metrix.VerticalSize(0)}}
            isRequired
            setError={setError}
            fieldName="bankLetter"
            control={control}
            errTxt={errors?.bankLetter && errors?.bankLetter?.message}
            heading="IBAN Letter / Bank Welcome Letter"
          />
        )}
      </>
    );
  };
  const renderNonInternationalOtherEmirates = () => {
    return (
      <>
        <UploadDocument
          customStyle={{paddingTop: Metrix.VerticalSize(0)}}
          fieldName="commercialLicense"
          setError={setError}
          control={control}
          errTxt={
            errors?.commercialLicense && errors?.commercialLicense?.message
          }
          isRequired
          heading={'Business / Commercial License'}
        />

        <UploadDocument
          customStyle={{paddingTop: Metrix.VerticalSize(0)}}
          fieldName="passportCopy"
          setError={setError}
          control={control}
          errTxt={errors?.passportCopy && errors?.passportCopy?.message}
          isRequired
          heading="Signatory Passport Copy"
        />
        <UploadDocument
          customStyle={{paddingTop: Metrix.VerticalSize(0)}}
          fieldName="visaCopy"
          setError={setError}
          control={control}
          isRequired={false}
          optionalText="(optional)"
          heading="Signatory Visa Copy"
        />

        <UploadDocument
          customStyle={{paddingTop: Metrix.VerticalSize(0)}}
          control={control}
          setError={setError}
          fieldName="emiratesIdCopy"
          errTxt={errors?.emiratesIdCopy && errors?.emiratesIdCopy?.message}
          isRequired
          heading="Emirates ID Copy of Signatory"
        />
        {isPartnership && (
          <UploadDocument
            customStyle={{paddingTop: Metrix.VerticalSize(0)}}
            isRequired={false}
            optionalText={isPartnership ? '(optional)' : ''}
            fieldName="poaMoa"
            setError={setError}
            control={control}
            errTxt={errors?.poaMoa && errors?.poaMoa?.message}
            heading="POA (Power of Attorney) & MOA (Memorandum of Agreement)"
          />
        )}

        {bank && (
          <UploadDocument
            customStyle={{paddingTop: Metrix.VerticalSize(0)}}
            isRequired
            setError={setError}
            fieldName="bankLetter"
            control={control}
            errTxt={errors?.bankLetter && errors?.bankLetter?.message}
            heading="IBAN Letter / Bank Welcome Letter"
          />
        )}
        {trnValue === 'No' && (
          <UploadDocument
            customStyle={{paddingTop: Metrix.VerticalSize(0)}}
            fieldName="nonVatDisclosure"
            isRequired
            setError={setError}
            control={control}
            heading="Non VAT Disclosure"
            errTxt={
              errors?.nonVatDisclosure && errors?.nonVatDisclosure?.message
            }
          />
        )}
        {trnValue === 'Yes' && (
          <UploadDocument
            customStyle={{paddingTop: Metrix.VerticalSize(0)}}
            isRequired
            setError={setError}
            control={control}
            fieldName="vatCertificate"
            errTxt={errors?.vatCertificate && errors?.vatCertificate?.message}
            heading="VAT Certificate"
          />
        )}
      </>
    );
  };

  const renderInternationalDubaiBased = () => {
    return (
      <>
        {checknonEstate ? (
          <UploadDocument
            customStyle={{paddingTop: Metrix.VerticalSize(0)}}
            fieldName="commercialLicense"
            control={control}
            setError={setError}
            errTxt={
              errors?.commercialLicense && errors?.commercialLicense?.message
            }
            isRequired
            heading={'Business / Commercial License'}
          />
        ) : (
          <UploadDocument
            customStyle={{paddingTop: Metrix.VerticalSize(0)}}
            fieldName="registerationCertificate"
            control={control}
            setError={setError}
            errTxt={
              errors?.registerationCertificate &&
              errors?.registerationCertificate?.message
            }
            isRequired
            heading="REGISTRATION CERTIFICATE / COMMERCIAL LICENSE / ACTIVITY PAGE"
          />
        )}
        <UploadDocument
          fieldName="passportCopy"
          control={control}
          setError={setError}
          customStyle={{paddingTop: Metrix.VerticalSize(0)}}
          errTxt={errors?.passportCopy && errors?.passportCopy?.message}
          isRequired
          heading="Signatory Passport Copy"
        />
        <UploadDocument
          customStyle={{paddingTop: Metrix.VerticalSize(0)}}
          fieldName="nationalIdNumberpdf"
          control={control}
          setError={setError}
          optionalText="(optional)"
          errTxt={
            errors?.nationalIdNumberpdf && errors?.nationalIdNumberpdf?.message
          }
          isRequired={checknonEstate}
          heading="National ID Copy of Signatory"
        />
        {bank && (
          <UploadDocument
            customStyle={{paddingTop: Metrix.VerticalSize(0)}}
            fieldName="bankLetter"
            control={control}
            setError={setError}
            errTxt={errors?.bankLetter && errors?.bankLetter?.message}
            isRequired
            heading="Bank Letter or Cancel Cheque or Bank Statement"
          />
        )}
      </>
    );
  };
  const renderInternationalFreelancer = () => {
    return (
      <>
        <UploadDocument
          customStyle={{paddingTop: Metrix.VerticalSize(0)}}
          fieldName="passportCopy"
          control={control}
          setError={setError}
          errTxt={errors?.passportCopy && errors?.passportCopy?.message}
          isRequired
          heading="Signatory Passport Copy"
        />
        <UploadDocument
          customStyle={{paddingTop: Metrix.VerticalSize(0)}}
          fieldName="nationalIdNumberpdf"
          control={control}
          setError={setError}
          errTxt={
            errors?.nationalIdNumberpdf && errors?.nationalIdNumberpdf?.message
          }
          isRequired
          heading="National ID Number"
        />
        <UploadDocument
          customStyle={{paddingTop: Metrix.VerticalSize(0)}}
          isRequired
          fieldName="bankLetter"
          control={control}
          setError={setError}
          errTxt={errors?.bankLetter && errors?.bankLetter?.message}
          heading="IBAN Letter / Bank Welcome Letter"
        />
      </>
    );
  };
  const renderNonInternationalFreelancer = () => {
    return (
      <>
        <UploadDocument
          customStyle={{paddingTop: Metrix.VerticalSize(0)}}
          fieldName="passportCopy"
          control={control}
          setError={setError}
          errTxt={errors?.passportCopy && errors?.passportCopy?.message}
          isRequired
          heading="Signatory Passport Copy"
        />
        <UploadDocument
          customStyle={{paddingTop: Metrix.VerticalSize(0)}}
          fieldName="visaCopy"
          control={control}
          setError={setError}
          heading="Signatory Visa Copy"
          optionalText="(optional)"
        />
        <UploadDocument
          customStyle={{paddingTop: Metrix.VerticalSize(0)}}
          control={control}
          setError={setError}
          fieldName="emiratesIdCopy"
          errTxt={errors?.emiratesIdCopy && errors?.emiratesIdCopy?.message}
          isRequired
          heading="Emirates ID Copy of Signatory"
        />
        <UploadDocument
          customStyle={{paddingTop: Metrix.VerticalSize(0)}}
          isRequired
          fieldName="bankLetter"
          control={control}
          setError={setError}
          errTxt={errors?.bankLetter && errors?.bankLetter?.message}
          heading="IBAN Letter / Bank Welcome Letter"
        />
      </>
    );
  };
  switch (headerTitle) {
    case 'Real Estate Agency (Dubai Based)':
      return renderNonInternationalDubaiBased();
    case 'Real Estate Agency (Other Emirates)':
      return renderNonInternationalOtherEmirates();
    case 'Real Estate Agency':
      return renderInternationalDubaiBased();
    case 'Non Real Estate Company':
      return checkType
        ? renderInternationalDubaiBased()
        : renderNonInternationalDubaiBased();

    case 'Freelancer':
      return checkType
        ? renderInternationalFreelancer()
        : renderNonInternationalFreelancer();

    default:
      return null;
  }
};
export default StepFour;
