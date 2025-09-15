import React, {useState, FC} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';

import PhoneInput from 'react-native-phone-input';
import CustomText from '../CustomText';
import {Colors, FONT_FAMILY, FontType, Images, Metrix} from '@/config';
import {Controller} from 'react-hook-form';
import Animated, {FadeInUp} from 'react-native-reanimated';
// import {CountryPicker} from 'react-native-country-codes-picker';
import {CountryPicker} from '@/components/CountryCodesPicker/index';
import {SvgUri} from 'react-native-svg';
export type CustomPhoneInputProps = {
  heading?: string;
  isRequired?: boolean;
  placeholder?: string;
  value?: any;
  setValue?: any;
  errTxt?: string | any;
  control?: any;
  fieldName?: string;
  mainContainerStyle?: any;
  editable?: boolean;
  disablePicker?: boolean;
};

export const CustomPhoneInput: FC<CustomPhoneInputProps> = ({
  heading,
  isRequired,
  placeholder = 'Enter phone number',
  value,
  setValue,
  errTxt,
  control,
  fieldName,
  mainContainerStyle,
  editable = true,
  disablePicker = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const countryPickerStyle = {
    modal: {
      height: '60%',
      paddingBottom: Metrix.VerticalSize(0),
    },
    dialCode: {
      color: Colors?.Black,
    },
    countryName: {
      color: Colors?.Black,
    },
    flag: {
      color: 'black',
    },
    textInput: {
      height: Metrix.VerticalSize(38),
      borderRadius: Metrix.LightRadius,
      paddingHorizontal: Metrix.HorizontalSize(15),
      fontSize: FontType.FontRegular,
      marginVertical: Metrix.VerticalSize(5),
      marginHorizontal: Metrix.VerticalSize(5),
    },
  };
  const defaultValue = {
    dial_code: '+971',
    flag: '🇦🇪',
  };
  return (
    <View style={mainContainerStyle}>
      {heading && (
        <CustomText.MediumText>
          <CustomText.MediumText
            customStyle={{color: isRequired ? Colors.Error : Colors.White}}>
            *{' '}
          </CustomText.MediumText>
          {heading || ''}
        </CustomText.MediumText>
      )}
      <Controller
        control={control}
        name={fieldName}
        render={({field: {onChange, value: fieldValue}}) => (
          <View style={[styles.textContainer]}>
            <View style={styles.flagContainer}>
              {value?.flag == null ? (
                <Image
                  source={Images.DummyFlag}
                  style={{height: 30, width: 30, borderRadius: 20}}
                />
              ) : (
                <SvgUri width={20} height={20} uri={`${value?.flag}`} />
              )}
              {/* <TextInput
                style={styles.flagText}
                value={value?.flag ? value?.flag : defaultValue?.flag}
                editable={false}
              /> */}
            </View>
            <TouchableOpacity
              style={styles.codeContainer}
              onPress={() => !disablePicker && setShowPicker(true)}
              disabled={!editable}
              activeOpacity={0.7}>
              <CustomText.RegularText customStyle={styles.codeText}>
                {value?.dial_code ? value?.dial_code : defaultValue?.dial_code}
              </CustomText.RegularText>
              <Image
                source={Images.Arrow}
                style={styles.arrowIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TextInput
              allowFontScaling={false}
              contextMenuHidden={true}
              style={styles.phoneInput}
              value={fieldValue}
              selectionColor={Colors.LightBlack}
              keyboardType="number-pad"
              onChangeText={val => {
                onChange(val);
              }}
              placeholder={placeholder}
              placeholderTextColor={Colors.TextInputPlaceholderColor}
            />

            <CountryPicker
              show={showPicker}
              pickerButtonOnPress={item => {
                setValue && setValue(item);
                setShowPicker(false);
              }}
              style={{
                ...countryPickerStyle,
                modal: {
                  ...countryPickerStyle.modal,
                  height: '60%',
                  paddingBottom: Metrix.HorizontalSize(0),
                },
              }}
              lang="en"
              onBackdropPress={() => setShowPicker(false)}
              enableModalAvoiding={true}
              inputPlaceholderTextColor={Colors.TextInputPlaceholderColor}
            />
          </View>
        )}
      />
      {/* {errTxt && (
        <Animated.View entering={FadeInUp.duration(600)}>
          <CustomText.RegularText customStyle={styles.errorText}>
            {'  '}
            {errTxt}
          </CustomText.RegularText>
        </Animated.View>
      )} */}
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
    alignItems: 'center',
    backgroundColor: Colors.White,
    borderColor: Colors.TextInputBorderColor,
    marginTop: Metrix.VerticalSize(10),
    overflow: 'hidden',
  },
  flagContainer: {
    width: Metrix.HorizontalSize(32),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Metrix.HorizontalSize(8),
  },
  flagText: {
    fontSize: FontType.FontExtraLarge,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Metrix.HorizontalSize(4),
    marginRight: Metrix.HorizontalSize(4),
  },
  codeText: {
    fontSize: FontType.FontRegular,
    color: Colors.LightBlack,
    fontFamily: FONT_FAMILY.InterRegular,
    marginRight: Metrix.HorizontalSize(2),
  },
  arrowIcon: {
    width: Metrix.HorizontalSize(10),
    height: Metrix.VerticalSize(10),
    marginLeft: Metrix.HorizontalSize(5),
    transform: [{rotate: '270deg'}],
  },
  phoneInput: {
    flex: 1,
    height: Metrix.VerticalSize(40),
    backgroundColor: 'transparent',
    paddingLeft: Metrix.HorizontalSize(4),
    fontSize: FontType.FontRegular,
    fontFamily: FONT_FAMILY?.InterRegular,
  },
  phoneText: {
    fontSize: FontType.FontRegular,
    color: Colors.LightBlack,
    fontFamily: FONT_FAMILY.InterRegular,
    height: '100%',
  },
  errorText: {
    color: Colors.Error,
    left: Metrix.HorizontalSize(5),
    fontSize: FontType.FontSmall,
  },
});

export default CustomPhoneInput;
