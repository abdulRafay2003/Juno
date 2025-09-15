import React, {FC, Ref} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TextInputProps,
  ImageProps,
  ViewProps,
  Platform,
} from 'react-native';
import CustomText from '../CustomText';
import {Colors, FONT_FAMILY, FontType, Images, Metrix} from '@/config';
import {Controller, useController} from 'react-hook-form';
import {MaskedTextInput} from 'react-native-mask-text';

type CustomInputProps = TextInputProps & {
  control?: any;
  fieldName?: any;
  customStyle?: TextInputProps['style'];
  hidepswdState?: boolean;
  iconStyle?: ImageProps['style'];
  errTxt?: string | any;
  touched?: boolean;
  inputRef?: Ref<TextInput>;
  heading?: string;
  mainContainerStyle?: any;
  editable?: boolean;
  isRequired?: boolean;
  borderWidth?: number;
  onChangeText?: any | null;
  containerStyle?: ViewProps['style'];
  optionalText?: string;
  customMainContainer?: any | null;
};

export const EmiratesInput: FC<CustomInputProps> = ({
  control,
  fieldName,
  customStyle,
  hidepswdState,
  iconStyle = {},
  errTxt,
  touched,
  inputRef,
  heading,
  mainContainerStyle,
  editable = true,
  isRequired = false,
  borderWidth = 1,
  onChangeText,
  customMainContainer,
  containerStyle,
  optionalText = '',
  ...rest
}) => {
  const {field} = useController({
    control: control,
    name: fieldName,
  });

  return (
    <View style={[{height: Metrix.VerticalSize(105)}, containerStyle]}>
      {heading && (
        <CustomText.MediumText>
          <CustomText.MediumText
            customStyle={{color: isRequired ? Colors.Error : Colors.White}}>
            *{' '}
          </CustomText.MediumText>
          {heading || ''}
          {!isRequired && (
            <CustomText.MediumText customStyle={styles.isOptional}>
              {'  '}
              {optionalText ? optionalText : '(optional)'}
            </CustomText.MediumText>
          )}
        </CustomText.MediumText>
      )}
      <View
        style={[
          styles.textContainer,
          {
            backgroundColor: editable ? Colors.White : Colors.UnreadColor,
            borderWidth: borderWidth,
            marginBottom: errTxt
              ? Metrix.VerticalSize(0)
              : Metrix.VerticalSize(15),
          },
          mainContainerStyle,
        ]}>
        <Controller
          control={control}
          name={fieldName}
          render={({field: {onChange}}) => (
            // <TextInput
            //   selectionColor={
            //     Platform.OS === 'android'
            //       ? Colors.SelectionColorAndroid
            //       : Colors.SelectionColorIOS
            //   }
            //   style={[
            //     styles.textInput,
            //     {
            //       width: '100%',
            //       paddingLeft: Metrix.HorizontalSize(15),
            //     },
            //     customStyle,
            //   ]}
            //   value={field.value}
            //   allowFontScaling={false}
            //   maxLength={255}
            //   contextMenuHidden={true}
            //   underlineColorAndroid={Colors.Transparent}
            //   placeholderTextColor={Colors.TextInputPlaceholderColor}
            //   ref={inputRef}
            //   editable={editable}
            //   onChangeText={(e: any) => {
            //     onChange(e), onChangeText && onChangeText(e);
            //   }}
            //   {...rest}
            // />
            <MaskedTextInput
              mask="999-9999-9999999-9"
              selectionColor={
                Platform.OS === 'android'
                  ? Colors.SelectionColorAndroid
                  : Colors.SelectionColorIOS
              }
              style={[
                styles.textInput,
                {
                  width: '100%',
                  paddingLeft: Metrix.HorizontalSize(15),
                },
                customStyle,
              ]}
              value={field.value}
              allowFontScaling={false}
              maxLength={255}
              contextMenuHidden={true}
              underlineColorAndroid={Colors.Transparent}
              placeholderTextColor={Colors.TextInputPlaceholderColor}
              ref={inputRef}
              editable={editable}
              onChangeText={text => {
                onChange(text), onChangeText && onChangeText(text);
              }}
              {...rest}
            />
          )}
        />
      </View>
      <View style={{height: Metrix.VerticalSize(25)}}>
        {errTxt && (
          <CustomText.RegularText customStyle={styles.errorText}>
            {'  '}
            {errTxt}
          </CustomText.RegularText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    borderWidth: 1,
    borderRadius: Metrix.RoundRadius,
    height: Metrix.VerticalSize(42),
    width: '100%',
    flexDirection: 'row',
    marginTop: Metrix.VerticalSize(10),
    backgroundColor: Colors.White,
    borderColor: Colors.TextInputBorderColor,
    alignItems: 'center',
    overflow: 'hidden',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: Metrix.HorizontalSize(15),
    color: Colors.LightBlack,
    fontSize: FontType.FontRegular,
    fontFamily: FONT_FAMILY.InterRegular,
    height: Platform.OS == 'android' && Metrix.VerticalSize(40),
  },
  eyeStyle: {
    width: '15%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.White,
  },
  eyeIcon: {
    width: '50%',
    height: '50%',
    tintColor: Colors.PieChartGray1,
  },
  errorText: {
    color: Colors.Error,
    left: Metrix.HorizontalSize(5),
    fontSize: FontType.FontSmall,
  },
  leftIcon: {
    width: Metrix.HorizontalSize(18),
    height: Metrix.HorizontalSize(18),
    marginLeft: Metrix.HorizontalSize(10),
  },
  isOptional: {
    fontSize: FontType.FontSmall,
    color: Colors.PieChartGray2,
  },
});
