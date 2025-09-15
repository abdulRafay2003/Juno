import CustomText from '@/components/CustomText';
import {Colors, FontType, Images, Metrix} from '@/config';
import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import {pick, types} from '@react-native-documents/picker';
import {Controller, useFormContext} from 'react-hook-form';
import Animated, {FadeInUp} from 'react-native-reanimated';
import {sanitizeFileName, showToast} from '@/utils/business.helper';
import {useQuery} from '@tanstack/react-query';
import {APIS} from '@/services/apiMethods';

type UploadDocumentProps = {
  heading?: string;
  isRequired?: boolean;
  optionalText?: string;
  errTxt?: string | any;
  fieldName?: string;
  control?: any;
  customStyle?: ViewProps['style'];
  setError?: any;
};

const UploadDocument = ({
  heading,
  isRequired,
  optionalText,
  errTxt,
  control,
  fieldName,
  customStyle,
  setError,
}: UploadDocumentProps) => {
  const {
    data: fileSize,
    isError: fileSizeError,
    isLoading: fileSizeDataLoading,
  } = useQuery({
    queryKey: ['fileSize'],
    queryFn: () => APIS?.getHelp(),
    staleTime: 50000,
  });

  // Get max file size in bytes from API, default to 10MB if not available
  const maxFileSizeInBytes =
    fileSize?.data?.data?.FILE_SIZE_IN_BYTES || 10 * 1024 * 1024;

  return (
    <Controller
      control={control}
      name={fieldName}
      defaultValue={null}
      render={({field: {onChange, value}, fieldState: {error}}) => {
        const handleUploadDocument = async () => {
          try {
            const [pickResult] = await pick({
              type: [
                'image/jpg',
                'image/jpeg',
                'image/png',
                'image/heic',

                'public.jpg',
                'public.jpeg',
                'public.png',
                'public.heic',
                types.pdf,

                // types.pdf, types.images
              ],
              copyTo: 'cachesDirectory',
            });

            if (pickResult.size && pickResult.size > maxFileSizeInBytes) {
              const maxSizeMB = (maxFileSizeInBytes / (1024 * 1024)).toFixed(0);
              setError(fieldName, {
                message: `File size exceeds ${maxSizeMB} MB limit`,
              });
              return;
            }
            const cleanName = sanitizeFileName(pickResult.name);
            onChange({...pickResult, name: cleanName});
          } catch (err: unknown) {}
        };

        return (
          <View style={[styles.container, customStyle]}>
            {heading && (
              <CustomText.MediumText>
                <CustomText.MediumText
                  customStyle={
                    isRequired
                      ? styles.requiredAsterisk
                      : styles.optionalAsterisk
                  }>
                  *{' '}
                </CustomText.MediumText>
                {heading}
                {!isRequired && (
                  <CustomText.RegularText customStyle={styles.optionalText}>
                    {' '}
                    {optionalText}
                  </CustomText.RegularText>
                )}
              </CustomText.MediumText>
            )}
            {value ? (
              <View
                style={[
                  styles.dottedLineContainer,
                  styles.selectedDottedLineContainer,
                ]}>
                <Images.CheckSVG
                  height={Metrix.VerticalSize(24)}
                  width={Metrix.HorizontalSize(24)}
                  marginBottom={Metrix.VerticalSize(12)}
                />
                <CustomText.MediumText customStyle={styles.centerText}>
                  {value?.name}
                </CustomText.MediumText>
                <CustomText.RegularText customStyle={styles.uploadText}>
                  Uploaded Successfully
                </CustomText.RegularText>
                <TouchableOpacity onPress={() => onChange(null)}>
                  <CustomText.RegularText customStyle={styles.deleteText}>
                    Delete?
                  </CustomText.RegularText>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleUploadDocument}
                style={styles.dottedLineContainer}>
                <Images.UploadSVG
                  height={Metrix.VerticalSize(24)}
                  width={Metrix.HorizontalSize(24)}
                  color={Colors.Black}
                  marginBottom={Metrix.VerticalSize(12)}
                />
                <CustomText.MediumText>
                  Choose file to upload
                </CustomText.MediumText>
                <CustomText.RegularText customStyle={styles.pdfText}>
                  {`PDF or Image(JPG, JPEG, PNG, HEIC) only.`}
                </CustomText.RegularText>
                <CustomText.RegularText customStyle={styles.pdfText}>
                  {`Max file size: ${(maxFileSizeInBytes / (1024 * 1024)).toFixed(0)} MB`}
                </CustomText.RegularText>
              </TouchableOpacity>
            )}

            <View style={styles.errorSpacer}>
              {errTxt && (
                <CustomText.RegularText customStyle={styles.errorText}>
                  {'  '}
                  {errTxt}
                </CustomText.RegularText>
              )}
            </View>
          </View>
        );
      }}
    />
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.White,
    borderWidth: 1,
    borderColor: Colors.LightGrey,
    borderRadius: Metrix.Radius,
    paddingVertical: Metrix.VerticalSize(15),
    paddingHorizontal: Metrix.HorizontalSize(20),
    marginTop: Metrix.VerticalSize(20),
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dottedLineContainer: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.LightGrey,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Metrix.Radius,
    marginTop: Metrix.VerticalSize(5),
    paddingVertical: Metrix.VerticalSize(20),
    paddingHorizontal: Metrix.VerticalSize(20),
  },
  selectedDottedLineContainer: {
    borderColor: Colors.Black,
  },

  pdfText: {
    marginBottom: Metrix.VerticalSize(10),
    fontSize: FontType.FontSuperSmall,
    color: Colors.Grey,
  },
  documentImage: {
    height: Metrix.VerticalSize(24),
    width: Metrix.HorizontalSize(24),
    resizeMode: 'contain',
    marginBottom: Metrix.VerticalSize(12),
  },
  tickImg: {
    height: Metrix.VerticalSize(15),
    width: Metrix.HorizontalSize(15),
    resizeMode: 'contain',
    marginBottom: Metrix.VerticalSize(12),
  },
  optionalText: {
    color: Colors.PieChartGray1,
    fontSize: FontType.FontMedium,
  },
  container: {
    paddingTop: Metrix.VerticalSize(24),
  },
  requiredAsterisk: {
    color: Colors.Error,
  },
  optionalAsterisk: {
    color: Colors.White,
  },
  centerText: {
    textAlign: 'center',
  },
  errorText: {
    color: Colors.Error,
    left: Metrix.HorizontalSize(5),
    fontSize: FontType.FontSmall,
  },
  errorSpacer: {
    height: Metrix.VerticalSize(25),
  },
  uploadText: {
    color: Colors.Green,
    fontSize: FontType.FontSmall,
  },
  deleteText: {
    color: Colors.Error,
    fontSize: FontType.FontSmall,
    textDecorationLine: 'underline',
  },
});

export default UploadDocument;
