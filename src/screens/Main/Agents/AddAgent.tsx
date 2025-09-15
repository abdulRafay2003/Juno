import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  CustomDatePicker,
  DropDownPicker,
  MainContainer,
  PrimaryButton,
  CustomPhoneInput,
  CustomInput,
  CustomText,
  Loader,
} from '@/components';
import {Colors, FontType, Metrix, NavigationService} from '@/config';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {AddAgentValidtion} from '@/components/Validations';
import UploadDocument from '@/components/UploadDocument';
import {globalStyles} from '@/constants/globalStyles';
import {RouteNames} from '@/config/routes';
import {useMutation} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';
import {
  findCountryByCode,
  formatDate,
  showToast,
} from '@/utils/business.helper';
import {AxiosError} from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux/store';
import {EmiratesInput} from '@/components/CustomInput/EmiratesInput';
import {
  AddAgentFormData,
  AddAgentRequestBody,
  DocumentData,
} from '@/constants/Types';

const AddAgent = ({route}) => {
  const dropDownData = useSelector(
    (state: RootState) => state?.user?.dropdownData,
  );
  const [countryCode, setCountryCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    setError,
    formState: {errors},
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(AddAgentValidtion),
  });

  const postAgent = useMutation({
    mutationFn: (body: AddAgentRequestBody) => APIS?.createUser(body),
    onSuccess: data => {
      setLoading(false);
      NavigationService.replace(RouteNames.HomeRoutes.Success, {
        from: route?.params?.from || 'agent',
        heading:
          'Thank you! The user information has been submitted for approval',
        buttonText: 'Close',
      });
    },
    onError: (error: any) => {
      const err = error as AxiosError;

      setLoading(false);
      showToast(
        'error',
        'Error',
        error?.response?.data?.message || 'Login Failed',
      );
    },
  });

  const uploadDocument = useMutation({
    mutationFn: (body: FormData) => APIS?.uploadDocument(body),
    onSuccess: data => {
      return data;
    },
    onError: (error: any) => {
      setLoading(false);
      showToast(
        'error',
        'Error',
        error?.response?.data?.message || 'Add Agent Failed',
      );
    },
  });

  useEffect(() => {
    if (countryCode == null) {
      const dialCodeOption = dropDownData?.mobile_country_code?.find(
        item => item?.key == '971',
      );
      if (dialCodeOption) {
        setCountryCode({
          dial_code: `+${dialCodeOption?.key}`,
          flag: dialCodeOption?.icon_url,
        });
        setValue('dialCode', `+${dialCodeOption?.key}`);
      }
    } else {
      if (countryCode?.dial_code) {
        setValue('dialCode', countryCode.dial_code);
      }
    }
  }, [countryCode]);

  function transformAgentInput(
    input: AddAgentFormData,
    docs: DocumentData[],
  ): AddAgentRequestBody {
    function extractFileData(file: any, type: string): DocumentData | null {
      if (!file || !file.file_name) return null;

      return {
        type: type,
        file_name: file.file_name,
        file_extension: file.file_extension,
        file_url: file.file_url || 'https://s3.address.com', // Placeholder URL
      };
    }

    // Map the uploaded documents to their correct types
    const documents = docs
      .map(doc => {
        return extractFileData(doc, doc.type);
      })
      .filter(Boolean);

    return {
      first_name: input.firstName,
      last_name: input.lastName,
      nationality_id: input.nationality,
      phone_country_code_id: findCountryByCode(countryCode?.dial_code),
      phone_number: input.companyPhone,
      email: input.companyEmail.toLowerCase(),
      ...(input.emiratesIdNum !== undefined && {
        national_id_number: input.emiratesIdNum,
      }),
      ...(input.emirateIdIssuePlace !== undefined && {
        national_id_issue_place: input.emirateIdIssuePlace,
      }),
      ...(input.eidExpiryDate !== undefined && {
        national_id_expiry_date: input.eidExpiryDate,
      }),
      // national_id_issue_place: input.emirateIdIssuePlace,
      // national_id_expiry_date: formatDate(input.eidExpiryDate),
      passport_number: input.passportNumber,
      passport_issue_place: input.passportIssuePlace,
      passport_expiry_date: formatDate(input.passportExpiryDate),
      designation: input.designation,
      role_id: input.role,

      ...(input.brokenReraNumber !== undefined && {
        broker_rera_number: input.brokenReraNumber,
      }),
      ...(input.reraRegistrationExpiryDate !== undefined && {
        broker_rera_registration_expiry_date: input.reraRegistrationExpiryDate,
      }),
      documents: documents,
    };
  }
  const handleAddAgent = (values: AddAgentFormData) => {
    const docs = [
      {file: values.passport, type: 'Authorized Signatory passport copy'},
      {file: values.emirateIdPdf, type: 'Emirates ID'},
      {file: values.reraCard, type: 'Broker RERA Card'},
    ]
      // filter out empty ones so we only upload provided files
      .filter(item => item.file)
      .map(item => {
        const formData = new FormData();
        formData.append('type', item.type);
        formData.append('file', item.file);

        switch (item.type) {
          case 'Authorized Signatory passport copy':
            formData.append(
              'passport_expiry_date',
              formatDate(values.passportExpiryDate),
            );
            formData.append('passport_issue_place', values.passportIssuePlace);
            formData.append('passport', values.passportNumber);
            break;
          case 'Emirates ID':
            formData.append(
              'national_id_expiry_date',
              formatDate(values.eidExpiryDate),
            );
            formData.append('national_id_number', values.emiratesIdNum);
            break;
          case 'Broker RERA Card':
            formData.append(
              'rera_registration_expiry_date',
              formatDate(values.reraRegistrationExpiryDate),
            );
            formData.append('rera_number', watch('brokenReraNumber'));
            break;
        }

        return {formData, type: item.type};
      });

    if (docs.length === 0) {
      // This shouldn’t happen because validation should catch it,
      // but it’s a good safeguard
      console.error('No documents to upload');
      return;
    }

    setLoading(true);

    Promise.all(docs.map(doc => uploadDocument.mutateAsync(doc.formData))).then(
      results => {
        // Map the results to include the document type
        const documentsWithType = results.map((result, index) => ({
          ...result.data.data,
          type: docs[index].type,
        }));

        postAgent.mutate(transformAgentInput(values, documentsWithType));
      },
    );
  };

  return (
    <MainContainer isHeader isFlatList heading="Add Agent">
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}>
        <View style={globalStyles.cardContainer}>
          <CustomText.LargeSemiBoldText customStyle={styles.headingMargin}>
            User Information
          </CustomText.LargeSemiBoldText>
          <CustomInput
            heading="First Name"
            placeholder="e.g. Muhammad"
            returnKeyType="next"
            isRequired
            fieldName={'firstName'}
            control={control}
            errTxt={errors?.firstName && errors?.firstName?.message}
          />
          <CustomInput
            heading="Last Name"
            placeholder="e.g. Salman"
            returnKeyType="next"
            isRequired
            fieldName={'lastName'}
            control={control}
            errTxt={errors?.lastName && errors?.lastName?.message}
          />
          <DropDownPicker
            heading={'Nationality'}
            isRequired
            placeholder={'Select'}
            data={dropDownData?.nationality}
            fieldName={'nationality'}
            control={control}
            errTxt={errors?.nationality && errors?.nationality?.message}
          />
          <CustomPhoneInput
            heading="Mobile"
            isRequired
            value={countryCode}
            setValue={setCountryCode}
            fieldName={'companyPhone'}
            errTxt={errors?.companyPhone && errors?.companyPhone?.message}
            control={control}
          />

          <CustomInput
            heading="Email Address"
            placeholder="e.g. evans@beyond.ae"
            autoCapitalize="none"
            returnKeyType="next"
            keyboardType="email-address"
            isRequired
            fieldName={'companyEmail'}
            control={control}
            errTxt={errors?.companyEmail && errors?.companyEmail?.message}
          />
          <EmiratesInput
            heading="Emirates ID Number"
            placeholder="e.g. 123-1234-1234567-1"
            autoCapitalize="none"
            keyboardType="numeric"
            returnKeyType="next"
            fieldName={'emiratesIdNum'}
            control={control}
            errTxt={errors?.emiratesIdNum && errors?.emiratesIdNum?.message}
          />
          <CustomDatePicker
            heading={'Emirates ID Expiry Date'}
            placeholder="Select"
            fieldName={'eidExpiryDate'}
            control={control}
            minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // disables today
            errTxt={errors?.eidExpiryDate && errors?.eidExpiryDate?.message}
          />
          <CustomInput
            heading="Emirates ID Issue Place"
            placeholder="e.g. United Arab Emirates"
            autoCapitalize="none"
            returnKeyType="next"
            fieldName={'emirateIdIssuePlace'}
            control={control}
            errTxt={
              errors?.emirateIdIssuePlace &&
              errors?.emirateIdIssuePlace?.message
            }
          />
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
            fieldName={'passportIssuePlace'}
            control={control}
            errTxt={
              errors?.passportIssuePlace && errors?.passportIssuePlace?.message
            }
          />
          <CustomDatePicker
            heading={'Passport Expiry Date'}
            isRequired
            placeholder="Select"
            fieldName={'passportExpiryDate'}
            control={control}
            minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // disables today
            errTxt={
              errors?.passportExpiryDate && errors?.passportExpiryDate?.message
            }
          />

          <CustomInput
            heading="Designation"
            placeholder="e.g. Admin"
            autoCapitalize="none"
            returnKeyType="next"
            isRequired
            fieldName={'designation'}
            control={control}
            errTxt={errors?.designation && errors?.designation?.message}
          />
          <DropDownPicker
            heading={'Role'}
            isRequired
            placeholder={'Select'}
            data={dropDownData?.role}
            fieldName={'role'}
            control={control}
            errTxt={errors?.role && errors?.role?.message}
          />
          <CustomInput
            heading="Broker RERA Number"
            keyboardType="default"
            placeholder="e.g. 51165"
            autoCapitalize="none"
            returnKeyType="next"
            fieldName={'brokenReraNumber'}
            control={control}
            errTxt={
              errors?.brokenReraNumber && errors?.brokenReraNumber?.message
            }
          />
          <CustomDatePicker
            heading={'RERA Expiry Date'}
            placeholder="Select"
            fieldName={'reraRegistrationExpiryDate'}
            control={control}
            minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // disables today
            errTxt={
              errors?.reraRegistrationExpiryDate &&
              errors?.reraRegistrationExpiryDate?.message
            }
          />
        </View>
        <View style={globalStyles.cardContainer}>
          <CustomText.LargeSemiBoldText>
            Attached Documents
          </CustomText.LargeSemiBoldText>
          <UploadDocument
            customStyle={styles.uploadDocFirst}
            fieldName="reraCard"
            control={control}
            errTxt={errors?.reraCard && errors?.reraCard?.message}
            setError={setError}
            heading={'Upload RERA Broker Card (BRN)'}
          />
          <UploadDocument
            customStyle={styles.uploadDoc}
            fieldName="emirateIdPdf"
            control={control}
            errTxt={errors?.emirateIdPdf && errors?.emirateIdPdf?.message}
            setError={setError}
            heading={'Upload Emirates ID'}
          />
          <UploadDocument
            customStyle={styles.uploadDoc}
            fieldName="passport"
            control={control}
            heading={'Upload Passport'}
            isRequired={true}
            setError={setError}
            errTxt={errors?.passport && errors?.passport?.message}
          />
          {errors[''] && (
            <CustomText.RegularText customStyle={styles.errorText}>
              {errors['']?.message}
            </CustomText.RegularText>
          )}
        </View>
        <PrimaryButton title="Submit" onPress={handleSubmit(handleAddAgent)} />
      </ScrollView>
      <Loader isLoading={loading} />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  headingMargin: {marginBottom: Metrix.VerticalSize(20)},
  inputContainer: {
    marginTop: Metrix.VerticalSize(20),
  },
  errorText: {
    color: Colors.Error,
    left: Metrix.HorizontalSize(5),
    fontSize: FontType.FontSmall,
  },
  scrollContentContainer: {
    paddingBottom: Metrix.VerticalSize(40),
    flexGrow: 1,
  },
  uploadDocFirst: {
    paddingTop: Metrix.VerticalSize(15),
  },
  uploadDoc: {
    paddingTop: Metrix.VerticalSize(0),
  },
});

export default AddAgent;
