import {MainContainer, PrimaryButton, Loader} from '@/components';
import UploadDocument from '@/components/UploadDocument';
import {uploadInvoiceValidation} from '@/components/Validations';
import {Metrix, NavigationService} from '@/config';
import {RouteNames} from '@/config/routes';
import {yupResolver} from '@hookform/resolvers/yup';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet, View} from 'react-native';
import {useMutation} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';
import {showToast} from '@/utils/business.helper';
import {useRoute} from '@react-navigation/native';

interface UploadInvoiceFormData {
  invoiceDocument: any;
}

const UploadInvoice = () => {
  const route = useRoute<any>();
  const item = route.params?.item;

  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm<UploadInvoiceFormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(uploadInvoiceValidation),
  });

  const handleUploadInvoice = (values: UploadInvoiceFormData) => {
    const commissionId = item?.id;
    const invoiceNumber = item?.commission_num;
    const invoiceDate = new Date().toISOString().split('T')[0];
    setLoading(true);
    const formData = new FormData();
    if (values?.invoiceDocument) {
      formData.append('commission_id', commissionId);
      formData.append('invoice_number', invoiceNumber);
      formData.append('invoice_date', invoiceDate);
      formData.append('file', {
        uri: values.invoiceDocument.uri,
        type: values.invoiceDocument.type || 'application/pdf',
        name: values.invoiceDocument.name || 'invoice.pdf',
      });
    }

    mutation.mutate(formData);
  };

  const mutation = useMutation({
    mutationFn: (formData: FormData) => APIS?.uploadInvoice(formData),
    onSuccess: data => {
      setLoading(false);
      NavigationService.navigate(RouteNames.HomeRoutes.Success, {
        from: 'commissions',
        heading:
          'Invoice has been successfully uploaded. Your commission status will be updated shortly.',
        buttonText: 'Close',
      });
    },
    onError: (error: any) => {
      setLoading(false);
      showToast(
        'error',
        'Error',
        error?.response?.data?.message || 'Upload Failed',
      );
    },
  });
  return (
    <MainContainer isHeader isFlatList heading="Upload invoice">
      <UploadDocument
        errTxt={errors?.invoiceDocument && errors?.invoiceDocument?.message}
        control={control}
        fieldName="invoiceDocument"
      />

      {/* <View style={styles.alignBtn}> */}
      <PrimaryButton
        title="Submit"
        onPress={handleSubmit(handleUploadInvoice)}
      />
      {/* </View> */}
      <Loader isLoading={loading} />
    </MainContainer>
  );
};
const styles = StyleSheet.create({
  alignBtn: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: Metrix.VerticalSize(20),
  },
});
export default UploadInvoice;
