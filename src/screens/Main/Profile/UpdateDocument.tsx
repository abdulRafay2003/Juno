import {
  CustomDatePicker,
  CustomInput,
  Loader,
  PrimaryButton,
} from '@/components';
import {EmiratesInput} from '@/components/CustomInput/EmiratesInput';
import {MainContainer} from '@/components/MainContainer';
import UploadDocument from '@/components/UploadDocument';
import {
  UpdateDocumentValidation,
  UpdateEmiratesCardValidation,
  UpdateNationalCardValidation,
  UpdatePassportValidation,
  UpdateRERACertificateValidation,
  UpdateTradeLicenseValidation,
} from '@/components/Validations';
import {Colors, FontType, Metrix, NavigationService} from '@/config';
import {RootState} from '@/redux/store';
import {APIS} from '@/services/apiMethods';
import {formatDate, showToast} from '@/utils/business.helper';
import {yupResolver} from '@hookform/resolvers/yup';
import {useMutation} from '@tanstack/react-query';
import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {ScrollView, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

const UpdateDocument = ({route}) => {
  const {doc, type} = route.params;

  const [loading, setLoading] = useState(false);
  const isAgent = useSelector((state: RootState) => state.user.agent);

  const getResolver = () => {
    switch (type) {
      case 'Authorized Signatory passport copy':
        return UpdatePassportValidation;
      case 'RERA Certificate':
      case 'Broker RERA Card':
        return UpdateRERACertificateValidation;
      case 'Emirates ID':
      case 'National ID':
        return UpdateEmiratesCardValidation;
      case 'Trade License':
        return UpdateTradeLicenseValidation;
      case 'Visa':
      case 'VAT Disclosure':
        return UpdateDocumentValidation;
      case 'VAT Certificate':
        return UpdateDocumentValidation;
      case 'NATIONAL_ID':
        return UpdateNationalCardValidation;

      case 'Bank Account':
      case 'POA or MOA':
        return UpdateDocumentValidation;
      default:
        return UpdateDocumentValidation;
    }
  };
  const {
    handleSubmit,
    control,
    trigger,
    setError,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(getResolver()),
  });

  const getPayload = data => {
    const formData = new FormData();
    // Append data to formData based on document type
    switch (type) {
      case 'Authorized Signatory passport copy':
        formData.append('passport_expiry_date', formatDate(data?.expiry));
        formData.append('passport_issue_place', data?.passportIssuePlace);
        formData.append('passport', data?.passportNumber);
        return formData;
      case 'RERA Certificate':
      case 'Broker RERA Card':
        formData.append(
          'rera_registration_expiry_date',
          formatDate(data?.expiry),
        );
        formData.append('rera_number', data?.reraNumber);
        return formData;
      case 'Emirates ID':
      case 'National ID':
        formData.append('national_id_expiry_date', formatDate(data?.expiry));
        formData.append('national_id_number', data?.documentNumber);
        return formData;
      case 'Trade License':
        formData.append('trade_license_number', data?.documentNumber);
        formData.append(
          'trade_licence_expiry_date',
          formatDate(formatDate(data?.expiry)),
        );
        return formData;
      case 'Visa':
        return formData;
      case 'VAT Disclosure':
        return formData;
      case 'VAT Certificate':
        return formData;
      case 'Bank Account':
        return formData;
      case 'POA or MOA':
        return formData;

      default:
        break;
    }
  };

  const displayTextInput = () => {
    switch (type) {
      case 'Authorized Signatory passport copy':
        return (
          <>
            <CustomInput
              heading="Passport Number"
              placeholder="e.g. AEP6316516160"
              autoCapitalize="none"
              returnKeyType="next"
              isRequired
              fieldName={'passportNumber'}
              control={control}
              errTxt={errors?.passportNumber && errors?.passportNumber?.message}
            />
            <CustomInput
              heading="Passport Issue Place"
              placeholder="e.g. United Arab Emirates"
              autoCapitalize="none"
              isRequired
              returnKeyType="next"
              fieldName={'place'}
              control={control}
              errTxt={errors?.place && errors?.place?.message}
            />
            <CustomDatePicker
              heading={'Passport Expiry'}
              isRequired
              placeholder="Select"
              fieldName={'expiry'}
              control={control}
              errTxt={errors?.expiry && errors?.expiry?.message}
              minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // disables today
            />
          </>
        );
      case 'RERA Certificate':
      case 'Broker RERA Card':
        return (
          <>
            <CustomInput
              heading={
                type == 'RERA Certificate'
                  ? `RERA Number`
                  : `Broker RERA Number`
              }
              placeholder="e.g. 4741"
              autoCapitalize="none"
              returnKeyType="next"
              isRequired
              keyboardType="default"
              fieldName={'reraNumber'}
              control={control}
              errTxt={errors?.reraNumber && errors?.reraNumber?.message}
            />
            <CustomDatePicker
              heading={`${type == 'RERA Certificate' ? 'RERA' : 'Broker RERA'} Registration Expiry`}
              isRequired
              placeholder="Select"
              fieldName={'expiry'}
              control={control}
              errTxt={errors?.expiry && errors?.expiry?.message}
              minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // disables today
            />
          </>
        );
      case 'Emirates ID':
        return (
          <>
            <EmiratesInput
              heading={'Emirates ID Number'}
              placeholder="e.g. 123-1234-1234567-1"
              autoCapitalize="none"
              returnKeyType="next"
              isRequired
              fieldName={'documentNumber'}
              control={control}
              errTxt={errors?.documentNumber && errors?.documentNumber?.message}
            />
            <CustomDatePicker
              heading={`Emirates ID Expiry`}
              isRequired
              placeholder="Select"
              fieldName={'expiry'}
              control={control}
              errTxt={errors?.expiry && errors?.expiry?.message}
              minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // disables today
            />
          </>
        );
      case 'Trade License':
        return (
          <>
            <CustomInput
              heading={'Trade License Number'}
              placeholder={`e.g. ${doc} No`}
              autoCapitalize="none"
              returnKeyType="next"
              isRequired
              fieldName={'documentNumber'}
              control={control}
              errTxt={errors?.documentNumber && errors?.documentNumber?.message}
            />
            <CustomDatePicker
              heading={'Trade License Expiry'}
              isRequired
              placeholder="Select"
              fieldName={'expiry'}
              control={control}
              errTxt={errors?.expiry && errors?.expiry?.message}
              minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // disables today
            />
          </>
        );
      case 'National ID':
        return (
          <>
            <CustomInput
              heading={'National ID Number'}
              placeholder={`e.g. ${doc} No`}
              autoCapitalize="none"
              returnKeyType="next"
              isRequired
              keyboardType="default"
              fieldName={'documentNumber'}
              control={control}
              errTxt={errors?.documentNumber && errors?.documentNumber?.message}
            />
            <CustomDatePicker
              heading={'National ID Expiry'}
              isRequired
              placeholder="Select"
              fieldName={'expiry'}
              control={control}
              errTxt={errors?.expiry && errors?.expiry?.message}
              minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // disables today
            />
          </>
        );
      default:
        return null;
    }
  };

  const mutation = useMutation({
    mutationFn: (body: FormData) => APIS?.uploadDocument(body),
    onSuccess: data => {
      setLoading(false);
      showToast(
        'success',
        type + ' Updated',
        'The document wiil be updated within 24 hours.',
      );
      NavigationService.goBack();
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
  const onSubmit = data => {
    const formData = getPayload(data);
    formData.append('type', type);
    formData.append('file', data.updateDocument);
    setLoading(true);
    mutation.mutate(formData);
  };

  return (
    <MainContainer isHeader isFlatList heading="Update Document">
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.cardContainer}>
        <UploadDocument
          control={control}
          fieldName="updateDocument"
          heading={doc}
          setError={setError}
          isRequired
          customStyle={styles.documentContainer}
          errTxt={errors?.updateDocument && errors?.updateDocument?.message}
        />
        {displayTextInput()}
        <PrimaryButton title="Update" onPress={handleSubmit(onSubmit)} />
      </ScrollView>
      <Loader isLoading={loading} />
    </MainContainer>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.White,
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    borderRadius: Metrix.Radius,
    paddingVertical: Metrix.VerticalSize(15),
    paddingHorizontal: Metrix.HorizontalSize(20),
    marginTop: Metrix.VerticalSize(20),
    paddingBottom: Metrix.VerticalSize(50),
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dottedLineContainer: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.TextInputBorderColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Metrix.Radius,
    marginTop: Metrix.VerticalSize(5),
    paddingVertical: Metrix.VerticalSize(20),
  },

  pdfText: {
    marginTop: Metrix.VerticalSize(10),
    fontSize: FontType.FontSuperSmall,
    color: Colors.Grey,
  },
  documentImage: {
    height: Metrix.VerticalSize(24),
    width: Metrix.HorizontalSize(24),
    resizeMode: 'contain',
    marginBottom: Metrix.VerticalSize(12),
  },
  inputContainer: {
    marginTop: Metrix.VerticalSize(20),
  },
  documentContainer: {
    paddingTop: Metrix.HorizontalSize(0),
  },
});

export default UpdateDocument;
