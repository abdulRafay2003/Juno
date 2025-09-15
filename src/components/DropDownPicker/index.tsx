import React, {FC} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  ViewProps,
  Platform,
} from 'react-native';
import CustomText from '../CustomText';
import {Colors, FontType, Metrix, Images, FONT_FAMILY} from '@/config';
import {Controller} from 'react-hook-form';
import {SelectList} from 'react-native-dropdown-select-list';
import Animated, {FadeInUp} from 'react-native-reanimated';
import {store} from '@/redux/store';

type DropDownPickerProps = {
  customMainContainerStyle?: any | null;
  heading?: string;
  isRequired?: boolean;
  placeholder: string;
  searchPlaceholder?: string;
  value?: any;
  setValue?: any;
  data: any;
  errTxt?: string | any;
  control?: any;
  fieldName?: string;
  containerStyle?: ViewProps['style'];
  [key: string]: any;
  isSearch?: boolean;
  isFilter?: boolean;
  optionalText?: string;
  disable?: boolean;
  placeholderTextColor?: any;
};

export const DropDownPicker: FC<DropDownPickerProps> = ({
  customMainContainerStyle,
  heading,
  isRequired,
  placeholder,
  searchPlaceholder,
  value,
  setValue,
  data,
  errTxt,
  control,
  fieldName,
  isSearch = false,
  optionalText,
  disable,
  isFilter = false,
  changeValue,
  placeholderTextColor,
  ...rest
}) => {
  const authorized = store.getState()?.auth?.authorized;
  const arr =
    data?.length > 0
      ? data
          ?.filter(item => {
            const isOnboarding = item?.meta?.isOnboarding;

            if (typeof isOnboarding === 'boolean') {
              return (
                (authorized === false && isOnboarding === true) ||
                (authorized === true && isOnboarding === false)
              );
            }

            // if isOnboarding doesn't exist, include the item
            return true;
          })
          ?.map(item => ({
            value: item?.key || item?.name,
            key: item?.id,
          }))
      : [];

  return (
    <View style={[customMainContainerStyle]}>
      {heading && (
        <CustomText.MediumText>
          <CustomText.MediumText
            customStyle={{color: isRequired ? Colors.Error : Colors.White}}>
            *{' '}
          </CustomText.MediumText>
          {heading || ''}
          {!isRequired && isFilter
            ? null
            : !isRequired && (
                <CustomText.MediumText customStyle={styles.isOptional}>
                  {'  '}
                  {optionalText ? optionalText : '(optional)'}
                </CustomText.MediumText>
              )}
        </CustomText.MediumText>
      )}

      <Controller
        control={control}
        name={fieldName}
        render={({field: {onChange, value}}) => (
          <>
            <SelectList
              placeholderTextColor={
                placeholderTextColor ?? Colors.TextInputPlaceholderColor
              }
              disabled={disable}
              setSelected={val => {
                onChange(val);
                setValue && setValue(val);
              }}
              data={arr}
              save="key"
              search={isSearch}
              placeholder={placeholder}
              searchPlaceholder={searchPlaceholder}
              searchicon={
                <Image
                  source={Images.Search}
                  resizeMode="contain"
                  style={styles.searchIcon}
                  tintColor={Colors.PieChartGray2}
                />
              }
              boxStyles={styles.dropdown}
              maxHeight={Metrix.VerticalSize(170)}
              inputStyles={styles.selectedText}
              dropdownStyles={styles.container}
              dropdownItemStyles={styles.itemContainer}
              dropdownTextStyles={styles.itemText}
              arrowicon={
                <Image
                  source={Images.ArrowChevron}
                  resizeMode="contain"
                  style={styles.arrowIcon}
                />
              }
              fontFamily={FONT_FAMILY?.InterRegular}
              defaultOption={
                data?.find((item: any) => item.key == value) || null
              }
              {...rest}
            />
          </>
        )}
      />
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
  required: {
    color: Colors.Error,
    marginRight: 2,
    fontSize: FontType.FontLarge,
  },
  heading: {
    color: Colors.LightBlack,
    fontSize: FontType.FontLarge,
  },
  dropdown: {
    borderWidth: 1,
    backgroundColor: Colors.White,
    height: Metrix.VerticalSize(42),
    paddingHorizontal: Metrix.HorizontalSize(20),
    borderRadius: Metrix.RoundRadius,
    borderColor: Colors.TextInputBorderColor,
    alignItems: 'center',
    marginTop: Metrix.VerticalSize(10),
  },
  container: {
    backgroundColor: Colors.UnreadColor,
    borderRadius: Metrix.Radius,
    borderWidth: 1,
    borderColor: Colors.TextInputBorderColor,
    paddingHorizontal: Metrix.HorizontalSize(10),
    marginBottom: Metrix.VerticalSize(10),
  },
  placeholder: {
    color: Colors.TextInputPlaceholderColor,
    fontSize: FontType.FontRegular,
    fontFamily: FONT_FAMILY?.InterRegular,
  },
  selectedText: {
    fontSize: FontType.FontRegular,
    color: Colors.LightBlack,
    alignSelf: 'center',
    textAlignVertical: 'center',
    fontFamily: FONT_FAMILY?.InterRegular,
    // height: 'Platform.OS == 'android' && Metrix.VerticalSize(40)',
  },

  searchInput: {
    flex: 1,
    color: Colors.LightBlack,
    fontSize: FontType.FontRegular,
    fontFamily: FONT_FAMILY?.InterRegular,
  },
  itemContainer: {
    paddingVertical: Metrix.VerticalSize(12),
    paddingHorizontal: Metrix.HorizontalSize(10),
  },
  itemText: {
    fontSize: FontType.FontRegular,
    color: Colors.LightBlack,
    fontFamily: FONT_FAMILY?.InterRegular,
  },

  errorText: {
    color: Colors.Error,
    // marginBottom: Metrix.VerticalSize(15),
    left: Metrix.HorizontalSize(5),
    fontSize: FontType.FontSmall,
  },
  arrowIcon: {
    width: Metrix.HorizontalSize(16),
    height: Metrix.VerticalSize(16),
  },
  isOptional: {
    fontSize: FontType.FontSmall,
    color: Colors.PieChartGray2,
  },
  searchIcon: {
    width: Metrix.HorizontalSize(13),
    height: Metrix.HorizontalSize(13),
    marginRight: Metrix.HorizontalSize(10),
  },
});

export default DropDownPicker;
